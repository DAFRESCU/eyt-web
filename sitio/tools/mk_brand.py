"""Genera los activos de marca a partir de los archivos oficiales de Canva (tools/brand/fuente/).
Logo oficial: monograma ETP (E marino, T vino, P gris, con la onda) + 'ESPINOZA T PERSONAS'.
 - nombres.svg: logotipo en vector puro (apilado y horizontal).
 - monograma_rgba.png: monograma 2048 px con transparencia real (se vectoriza aquí).
No se usa ningún otro logo. Ejecutar: python3 tools/mk_brand.py"""
import os, re, copy, io, vtracer
from lxml import etree
from PIL import Image
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "brand"); F = os.path.join(D, "fuente")
NAVY, WINE, GRAY = (0x19,0x29,0x4B), (0x7E,0x24,0x3C), (0x54,0x54,0x54)
CREAM, ROSE, LGRAY = (0xF3,0xEE,0xE6), (0xE4,0xA6,0xB4), (0xC9,0xC2,0xB6)
def hx(c): return "#%02X%02X%02X" % c
def rgb(h): h=h.lstrip("#"); return tuple(int(h[i:i+2],16) for i in (0,2,4))
def dist(a,b): return sum((x-y)**2 for x,y in zip(a,b))**.5
def lum(c): return .299*c[0]+.587*c[1]+.114*c[2]
def mix(a,b,t): return tuple(round(a[i]+(b[i]-a[i])*t) for i in range(3))
def classify(c):
    if lum(c) > 235: return "bg"
    if dist(c,WINE) < 55: return "wine"
    return "mid"   # marino, gris y todo el degradado de la onda (por luminosidad)
def tone_t(c):
    t = max(0, min(1, (lum(c)-lum(NAVY)) / (lum(GRAY)-lum(NAVY))))
    return 0 if t < .12 else 1 if t > .88 else t
def pal(k, c, mode):
    if mode == "color": return {"wine":WINE,"gray":GRAY,"navy":NAVY}.get(k) or mix(NAVY,GRAY,tone_t(c))
    if mode == "light": return {"wine":ROSE,"gray":LGRAY,"navy":CREAM}.get(k) or mix(CREAM,LGRAY,tone_t(c))
    return mode
def recolor(svg, mode):
    def f(m):
        c = rgb(m.group(1)); k = classify(c)
        if k == "bg": return 'fill="none"'
        return 'fill="%s"' % hx(pal(k, c, mode))
    s = re.sub(r'fill="(#[0-9a-fA-F]{6})"', f, svg)
    s = re.sub(r'<path d="[^"]+" fill="none"[^>]*/>\s*', "", s)
    return re.sub(r'<\?xml[^>]*\?>\s*|<!--.*?-->\s*', "", s, flags=re.S)
def write(name, s): open(os.path.join(D, name), "w").write(s)

# ---- monograma: PNG con alfa -> 3 máscaras (vino / gris / marino+onda) -> vector; la onda lleva degradado real
import numpy as np
from scipy import ndimage as ndi
im = Image.open(os.path.join(F, "monograma_rgba.png")).convert("RGBA"); im = im.crop(im.getbbox())
MW, MH = im.size; A = np.array(im).astype(int)
alpha = A[...,3] > 128; wine = alpha & ((A[...,0]-A[...,2]) > 25); rest = alpha & ~wine
lab, n = ndi.label(rest); sizes = ndi.sum(rest, lab, range(1, n+1))
xs = [np.where(lab == i)[1].mean() for i in range(1, n+1)]
big = int(np.argmax(sizes)) + 1                       # E + onda + panza de la P
gray_ids = [i for i in range(1, n+1) if i != big and sizes[i-1] > 500 and A[lab == i][:, :3].mean() > 80]
masks = {"wine": wine, "gray": np.isin(lab, gray_ids), "navy": rest & ~np.isin(lab, gray_ids) & (lab != big),
         "wave": lab == big}
def trace(mask):
    t = os.path.join(D, "_k.png"); o = os.path.join(D, "_k.svg")
    Image.fromarray(np.where(mask, 0, 255).astype("uint8")).save(t)
    vtracer.convert_image_to_svg_py(t, o, colormode="binary", mode="spline", filter_speckle=6, corner_threshold=60,
        length_threshold=3.0, splice_threshold=45, path_precision=1)
    p = re.findall(r'<path d="([^"]+)"[^>]*?transform="([^"]+)"', open(o).read()); os.remove(t); os.remove(o)
    return "".join('<path d="%s" transform="%s"/>' % x for x in p)
PATHS = {k: trace(m) for k, m in masks.items()}
X1, X2 = round(MW*.42), round(MW*.66)               # tramo del degradado marino -> gris
def mono(c_wine, c_gray, c_navy, c_wave_a, c_wave_b):
    g = '<defs><linearGradient id="w" gradientUnits="userSpaceOnUse" x1="%d" y1="0" x2="%d" y2="0"><stop offset="0" stop-color="%s"/><stop offset="1" stop-color="%s"/></linearGradient></defs>' % (X1, X2, hx(c_wave_a), hx(c_wave_b)) if c_wave_a != c_wave_b else ""
    wf = 'url(#w)' if g else hx(c_wave_a)
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d">%s<g fill="%s">%s</g><g fill="%s">%s</g><g fill="%s">%s</g><g fill="%s">%s</g></svg>'
            % (MW, MH, g, hx(c_wine), PATHS["wine"], hx(c_gray), PATHS["gray"], hx(c_navy), PATHS["navy"], wf, PATHS["wave"]))
write("monograma.svg", mono(WINE, GRAY, NAVY, NAVY, GRAY))
write("monograma-claro.svg", mono(ROSE, LGRAY, CREAM, CREAM, LGRAY))
write("monograma-rosa.svg", mono(ROSE, ROSE, ROSE, ROSE, ROSE))
write("monograma-marino.svg", mono(NAVY, NAVY, NAVY, NAVY, NAVY))
def body(f): return re.search(r'<svg[^>]*>(.*)</svg>', open(os.path.join(D,f)).read(), re.S).group(1)

# ---- nombres (vector puro de Canva)
NS = "http://www.w3.org/2000/svg"
def nombre(variant, mode):
    t = etree.parse(os.path.join(F, "nombres.svg")); r = t.getroot()
    inner = r.xpath('/*/*[local-name()="g"]/*[local-name()="g"]')[0]; kids = list(inner)
    keep = kids[:3] if variant == "apilado" else kids[3:]
    for k in kids:
        if k not in keep: inner.remove(k)
    box = (149,181,2506,611) if variant == "apilado" else (70,2061,2717,221)
    s = etree.tostring(r).decode()
    s = re.sub(r'<svg[^>]*>', '<svg xmlns="%s" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="%d %d %d %d">' % ((NS,)+box), s, 1)
    s = re.sub(r'fill="(#[0-9a-fA-F]{6})"', lambda m: 'fill="%s"' % hx(pal(classify(rgb(m.group(1))), rgb(m.group(1)), mode)), s)
    return s, box
for var in ("apilado", "horizontal"):
    for mode, suf in (("color",""),("light","-claro")):
        s, box = nombre(var, mode); write("nombre-%s%s.svg" % (var, suf), s)

# ---- lockups (monograma + nombre)
def lockup(var, mode):
    s, box = nombre(var, mode); nb = re.search(r'<svg[^>]*>(.*)</svg>', s, re.S).group(1)
    mono = body("monograma%s.svg" % ("-claro" if mode == "light" else ""))
    if var == "horizontal": mh, tw, th = 545, box[2], box[3]
    else: mh, tw, th = 1036, box[2], box[3]
    mw = round(mh * MW / MH); gap = round(mw * (.118 if var == "horizontal" else .06)); W = mw + gap + tw; H = max(mh, th)
    return ('<svg xmlns="%s" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 %d %d">'
            '<svg x="0" y="%d" width="%d" height="%d" viewBox="0 0 %d %d">%s</svg>'
            '<svg x="%d" y="%d" width="%d" height="%d" viewBox="%d %d %d %d">%s</svg></svg>') % (
            NS, W, H, (H-mh)//2, mw, mh, MW, MH, mono, mw+gap, (H-th)//2, tw, th, *box, nb)
for var, out in (("horizontal","logo-horizontal"),("apilado","logo-apilado")):
    write(out + ".svg", lockup(var, "color")); write(out + "-claro.svg", lockup(var, "light"))

# ---- favicon y patrones
vb = re.search(r'viewBox="0 0 (\d+) (\d+)"', open(os.path.join(D,"monograma-claro.svg")).read()).groups()
write("favicon.svg", '<svg xmlns="%s" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1B2A4A"/><svg x="7" y="15" width="50" height="34" viewBox="0 0 %s %s">%s</svg></svg>' % (NS, vb[0], vb[1], body("monograma-claro.svg")))
def tile(f, op):
    return ('<svg xmlns="%s" width="260" height="190" viewBox="0 0 260 190"><defs><symbol id="m" viewBox="0 0 %s %s">%s</symbol></defs>'
            '<g opacity="%s"><use href="#m" x="14" y="12" width="78" height="53"/><use href="#m" x="144" y="107" width="78" height="53"/></g></svg>') % (NS, vb[0], vb[1], body(f), op)
write("pat-rose.svg", tile("monograma-rosa.svg", 0.06)); write("pat-navy.svg", tile("monograma-marino.svg", 0.05))
print(sorted((f, os.path.getsize(os.path.join(D,f))) for f in os.listdir(D) if f.endswith(".svg")))
