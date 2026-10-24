# -*- coding: utf-8 -*-
"""Generador del sitio espinozat.com.
Salida en out/ con la estructura que sirve Vercel. Para el repo: out/index.html -> index.html, el resto -> public/.
Uso: python3 tools/build.py"""
import os, sys, json, shutil, hashlib, html, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "out")
sys.path.insert(0, HERE)
from data_services import SERVICES, ORDER
import pages_content as PC
import pages_extra as PX
import pages_v2 as V2

SITE = "https://espinozat.com"
TODAY = "2026-10-15"
WA_NUM = "51974770954"
E = html.escape

# ---------------------------------------------------------------- iconos
WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2Zm5.8 14.09c-.24.68-1.42 1.3-1.95 1.34-.5.05-1.13.2-3.8-.86-3.2-1.27-5.24-4.56-5.4-4.77-.16-.21-1.29-1.72-1.29-3.28 0-1.56.82-2.33 1.11-2.65.29-.31.63-.39.84-.39l.6.01c.2 0 .45-.07.71.54.26.63.89 2.18.97 2.34.08.16.13.34.03.55-.1.21-.16.34-.31.52-.16.18-.33.41-.47.55-.16.16-.32.33-.14.65.18.31.82 1.35 1.76 2.19 1.21 1.08 2.23 1.41 2.55 1.57.31.16.5.13.68-.08.18-.21.79-.92 1-1.24.21-.31.42-.26.71-.16.29.11 1.83.86 2.15 1.02.31.16.52.24.6.37.08.13.08.76-.16 1.45Z"/></svg>'
CHEV = '<svg class="chev" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
PLUS = '<span class="plus" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></span>'
ARROW = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
CLOSE = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'

PROGRAMS = [
    ("/programas/supervisores", "Programa de supervisores", "De buen técnico a buen jefe, en sesiones prácticas."),
    ("/programas/hostigamiento", "Prevención del hostigamiento sexual", "La capacitación que pide la norma, documentada."),
    ("/programas/taller-3-horas", "Taller de tres horas", "Un problema puntual, bien trabajado."),
    ("/programas/integracion", "Integración de equipos", "Dinámicas con método y compromisos por escrito."),
    ("/cierre-2026", "Cierre de año 2026", "Capacitación e integración en una sola visita."),
]

def svc_url(slug): return "/servicios/" + slug

# ---------------------------------------------------------------- piezas comunes
def wa_btn(text, label, cls="btn btn-wine", icon=True):
    return '<a class="%s" data-wa="%s" href="https://wa.me/%s">%s%s</a>' % (cls, E(text), WA_NUM, WA_SVG if icon else "", label)

AUD = [("/empresas", "Empresas", "Equipos que rinden, jefes que dirigen y gestión laboral en regla."),
       ("/instituciones", "Instituciones", "Municipalidades, universidades, gremios y organizaciones."),
       ("/comunidades", "Comunidades", "Colegios, equipos, grupos, familias y personas.")]
UNIT_DESC = {s_: (n_, d_) for s_, n_, d_ in V2.UNITS}

def header(path):
    def cur(href):
        return ' aria-current="page"' if path == href else ""
    serv_cur = path.startswith("/servicios")
    prog_cur = path.startswith("/programas") or path == "/cierre-2026"
    aud_cur = path in ("/empresas", "/instituciones", "/comunidades")
    herr_cur = path in ("/herramientas", "/termometro", "/cumple-ley-27942", "/brujula", "/calculadora-rotacion")
    serv_links = "".join('<a href="%s"%s><b>%s</b><span>%s</span></a>' % (svc_url(s), cur(svc_url(s)), UNIT_DESC[s][0], UNIT_DESC[s][1]) for s in ORDER)
    serv_links += '<div class="menu-foot"><a href="/empresas-grandes"%s><b>Empresas grandes</b><span>Más de 500 trabajadores, por proyecto o programa.</span></a></div>' % cur("/empresas-grandes")
    aud_links = "".join('<a href="%s"%s><b>%s</b><span>%s</span></a>' % (h, cur(h), t, d) for h, t, d in AUD)
    prog_links = "".join('<a href="%s"%s><b>%s</b><span>%s</span></a>' % (h, cur(h), t, d) for h, t, d in PROGRAMS)
    return f'''<header class="top" id="top">
  <div class="wrap">
    <a class="brand" href="/" aria-label="Espinoza T Personas, inicio"><img class="brand-logo" src="/logo-horizontal.svg" width="265" height="40" alt="Espinoza T Personas"></a>
    <nav class="nav" aria-label="Principal">
      <span class="nav-pill" aria-hidden="true"></span>
      <div class="nav-item has-menu{' is-current' if aud_cur else ''}"><button class="nav-link" type="button" aria-expanded="false" aria-controls="m-aud">Para quién {CHEV}</button><div class="menu" id="m-aud">{aud_links}</div></div>
      <div class="nav-item has-menu{' is-current' if serv_cur else ''}"><button class="nav-link" type="button" aria-expanded="false" aria-controls="m-serv">Servicios {CHEV}</button><div class="menu menu-wide" id="m-serv">{serv_links}</div></div>
      <div class="nav-item has-menu{' is-current' if prog_cur else ''}"><button class="nav-link" type="button" aria-expanded="false" aria-controls="m-prog">Programas {CHEV}</button><div class="menu" id="m-prog">{prog_links}</div></div>
      <a class="nav-link{' is-current' if herr_cur else ''}" href="/herramientas"{cur("/herramientas")}>Herramientas <span class="tag-free">gratis</span></a>
      <a class="nav-link" href="/nosotros"{cur("/nosotros")}>Nosotros</a>
      <a class="nav-link" href="/contacto"{cur("/contacto")}>Contacto</a>
      {wa_btn("Hola Espinoza T, vi la web de Espinoza T Personas y quiero conversar.", "Conversemos", "btn btn-wine btn-small", icon=False)}
    </nav>
    <button class="menu-btn" id="menu-btn" type="button" aria-expanded="false" aria-controls="sheet"><i aria-hidden="true"></i>Menú</button>
  </div>
</header>'''

def sheet(path):
    def cur(href): return ' aria-current="page"' if path == href else ""
    serv = "".join('<a href="%s"%s>%s</a>' % (svc_url(s), cur(svc_url(s)), UNIT_DESC[s][0]) for s in ORDER)
    aud = "".join('<a href="%s"%s>%s</a>' % (h, cur(h), t) for h, t, d in AUD)
    ao = " open" if path in ("/empresas", "/instituciones", "/comunidades") else ""
    prog = "".join('<a href="%s"%s>%s</a>' % (h, cur(h), t) for h, t, d in PROGRAMS)
    so = " open" if path.startswith("/servicios") else ""
    po = " open" if (path.startswith("/programas") or path == "/cierre-2026") else ""
    return f'''<div class="sheet" id="sheet" hidden role="dialog" aria-modal="true" aria-label="Menú">
  <div class="sheet-top"><a class="brand" href="/" aria-label="Espinoza T Personas, inicio"><img class="brand-logo" src="/logo-horizontal-claro.svg" width="265" height="40" alt="Espinoza T Personas"></a><button class="sheet-close" type="button" aria-label="Cerrar menú">{CLOSE}</button></div>
  <nav class="sheet-body" aria-label="Menú del celular">
    <a href="/"{cur("/")}>Inicio</a>
    <details{ao}><summary>Para quién {CHEV}</summary><div class="sheet-sub">{aud}</div></details>
    <details{so}><summary>Servicios {CHEV}</summary><div class="sheet-sub">{serv}</div></details>
    <details{po}><summary>Programas {CHEV}</summary><div class="sheet-sub">{prog}</div></details>
    <a href="/herramientas"{cur("/herramientas")}>Herramientas <span class="tag-free">gratis</span></a>
    <a href="/nosotros"{cur("/nosotros")}>Nosotros</a>
    <a href="/empresas-grandes"{cur("/empresas-grandes")}>Empresas grandes</a>
    <a href="/recursos"{cur("/recursos")}>Recursos</a>
    <a href="/contacto"{cur("/contacto")}>Contacto</a>
  </nav>
  <div class="sheet-foot">
    {wa_btn("Hola Espinoza T, vi la web de Espinoza T Personas y quiero conversar sobre mi empresa.", "Escríbenos por WhatsApp")}
    <a class="btn btn-outline" href="tel:+51974770954">Llamar al 974 770 954</a>
  </div>
</div>'''

def quick(path):
    termo = "#herramientas" if path == "/" else "/herramientas"
    return f'''<aside class="quick" aria-label="Contacto rápido">
  <div class="mbar" id="mbar"><a class="btn btn-ghost" href="{termo}">Herramientas gratis</a>{wa_btn("Hola Espinoza T, vi la web de Espinoza T Personas y quiero conversar.", "WhatsApp")}</div>
  <a class="wa-float" id="wa-float" data-wa="Hola Espinoza T, vi la web de Espinoza T Personas y quiero conversar." href="https://wa.me/{WA_NUM}" aria-label="Escríbenos por WhatsApp">{WA_SVG}</a>
</aside>'''

def footer():
    serv = "".join('<li><a href="%s">%s</a></li>' % (svc_url(s), UNIT_DESC[s][0]) for s in ORDER)
    prog = "".join('<li><a href="%s">%s</a></li>' % (h, t) for h, t, d in PROGRAMS)
    return f'''<footer class="foot">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <a class="foot-logo" href="/" aria-label="Espinoza T Personas, inicio"><img src="/logo-horizontal-claro.svg" width="272" height="41" alt="Espinoza T Personas" loading="lazy"></a>
        <p class="foot-tag">Capacitación, desarrollo, cultura y clima para empresas, instituciones y comunidades, desde Arequipa.</p>
        <div class="foot-contact"><a href="tel:+51974770954">974 770 954</a><a href="mailto:gerencia@espinozat.com">gerencia@espinozat.com</a><span>Arequipa, Perú</span></div>
      </div>
      <div><h2 class="foot-h">Servicios</h2><ul>{serv}</ul></div>
      <div><h2 class="foot-h">Programas</h2><ul>{prog}</ul></div>
      <div><h2 class="foot-h">Espinoza T</h2><ul><li><a href="/nosotros">Nosotros</a></li><li><a href="/empresas">Empresas</a></li><li><a href="/instituciones">Instituciones</a></li><li><a href="/comunidades">Comunidades</a></li><li><a href="/herramientas">Herramientas gratis</a></li><li><a href="/termometro">Termómetro de riesgo</a></li><li><a href="/cumple-ley-27942">¿Cumples la Ley 27942?</a></li><li><a href="/brujula">Brújula vocacional</a></li><li><a href="/calculadora-rotacion">Calculadora de rotación</a></li><li><a href="/certificado">Verificar constancia</a></li><li><a href="/empresas-grandes">Empresas grandes</a></li><li><a href="/recursos">Recursos</a></li><li><a href="/guias">Guías</a></li><li><a href="/contacto">Contacto</a></li><li><a href="/red">Únete a la red de especialistas</a></li></ul></div>
    </div>
    <div class="foot-bottom"><span>© <span data-year>2026</span> Espinoza T Personas. Piensa en personas.</span><span>Las fotos de personas son imágenes ilustrativas generadas con IA. Las cifras y logros citados son experiencia profesional previa del gerente general.</span></div>
  </div>
</footer>'''

ORG = {
    "@type": "ProfessionalService", "@id": SITE + "/#empresa", "name": "Espinoza T Personas",
    "slogan": "Piensa en personas.", "url": SITE + "/", "image": SITE + "/og.png", "logo": SITE + "/monograma.svg",
    "email": "gerencia@espinozat.com", "telephone": "+51 974 770 954",
    "description": "Consultora de gestión de personas en Arequipa: capacitación, desarrollo, cultura y clima laboral para empresas desde 20 trabajadores hasta corporaciones.",
    "address": {"@type": "PostalAddress", "addressLocality": "Arequipa", "addressRegion": "Arequipa", "addressCountry": "PE"},
    "areaServed": [{"@type": "City", "name": "Arequipa"}, {"@type": "City", "name": "Cusco"}, {"@type": "City", "name": "Ica"}, {"@type": "Country", "name": "Perú"}],
    "founder": {"@type": "Person", "@id": SITE + "/nosotros#daniel", "name": "Daniel Espinoza C.", "jobTitle": "Fundador y Gerente General",
                "alumniOf": {"@type": "CollegeOrUniversity", "name": "Universidad Católica de Santa María"}},
    "knowsAbout": ["Capacitación empresarial", "Liderazgo de supervisores y mandos medios", "Clima laboral", "Cultura organizacional",
                   "Selección de personal", "Evaluación de desempeño", "Perfiles de puesto y MOF", "Auditoría laboral preventiva",
                   "Prevención del hostigamiento sexual laboral", "Bienestar laboral"],
}

def crumbs_ld(items):
    return {"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n, "item": SITE + u} for i, (n, u) in enumerate(items)]}

def faq_ld(faq):
    return {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]}

ASSET_V = {}
def v(path):
    return path + "?v=" + ASSET_V.get(path, "1")

def page(path, title, desc, body, graph=None, scripts=(), body_class="", og_title=None, robots=None):
    canonical = SITE + (path if path != "/" else "/")
    g = [ORG] + (graph or [])
    ld = json.dumps({"@context": "https://schema.org", "@graph": g}, ensure_ascii=False, separators=(",", ":"))
    sc = "".join('\n<script src="%s" defer></script>' % v(s) for s in scripts)
    rob = '\n<meta name="robots" content="%s">' % robots if robots else ""
    full_title = title if "Espinoza T" in title else title + " | Espinoza T Personas"
    og_img = "/og.png" if path in ("/404",) else "/og/" + (path.strip("/").replace("/", "-") or "inicio") + ".png"
    return f'''<!doctype html>
<html lang="es-PE">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{E(full_title)}</title>
<meta name="description" content="{E(desc)}">
<link rel="canonical" href="{canonical}">{rob}
<meta name="theme-color" content="#1B2A4A">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_PE">
<meta property="og:site_name" content="Espinoza T Personas">
<meta property="og:title" content="{E(og_title or full_title)}">
<meta property="og:description" content="{E(desc)}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{SITE}{og_img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/fraunces-latin-full-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{v('/static/site.css')}">
<script type="application/ld+json">{ld}</script>
</head>
<body class="{body_class}">
<a class="skip" href="#main">Saltar al contenido</a>
{header(path)}
<main id="main">
{body}
</main>
{footer()}
{sheet(path)}
{quick(path)}
<script src="{v('/vendor/lenis.min.js')}" defer></script>
<script src="{v('/static/site.js')}" defer></script>{sc}
<script src="/_vercel/insights/script.js" defer></script>
</body>
</html>
'''

# ---------------------------------------------------------------- bloques de contenido
def page_hero(crumbs, kicker, h1, lede, actions="", facts=None):
    cr = '<nav class="crumbs" aria-label="Ruta"><a href="/">Inicio</a>' + "".join(
        ('<span aria-hidden="true">/</span>' + ('<a href="%s">%s</a>' % (u, n) if u else '<span aria-current="page">%s</span>' % n)) for n, u in crumbs) + "</nav>"
    fx = ""
    if facts:
        fx = '<div class="facts">' + "".join('<div><b>%s</b><span>%s</span></div>' % (a, b) for a, b in facts) + "</div>"
    act = '<div class="hero-actions">%s</div>' % actions if actions else ""
    return f'''<section class="page-hero">
  <div class="wrap">
    {cr}
    <p class="kicker">{kicker}</p>
    <h1>{h1}</h1>
    <p class="lede">{lede}</p>
    {act}
    {fx}
  </div>
</section>'''

def steps_mini():
    return '''<ol class="steps-mini">
  <li><b>Diagnóstico</b>45 minutos sin costo. Aplicamos el Termómetro y ubicamos tus prioridades reales.</li>
  <li><b>Propuesta escrita</b>Alcance, lo que queda fuera, plazos e inversión. Sin costo.</li>
  <li class="paid"><b>Ejecución</b>Empieza con la firma, con una contraparte de tu empresa.</li>
  <li class="paid"><b>Entrega</b>Todo en editable, con una sesión para tu equipo.</li>
  <li class="paid"><b>Verificación</b>A los 30 días revisamos que se esté usando. Incluida.</li>
</ol>'''

def faq_block(faq, title="Preguntas frecuentes", hid="faq"):
    items = "".join('<details><summary>%s%s</summary><p>%s</p></details>' % (E(q), PLUS, E(a)) for q, a in faq)
    return f'''<section class="band band-paper" aria-labelledby="{hid}">
  <div class="wrap">
    <div class="head"><h2 class="reveal" id="{hid}">{title}</h2></div>
    <div class="faq">{items}</div>
  </div>
</section>'''

def cta_band(h2="Conversemos 45 minutos.", p="Cuéntanos qué está pasando con tu equipo. Si no podemos ayudarte, te lo decimos en la primera reunión.", wa="Hola Espinoza T, quiero agendar el diagnóstico de 45 minutos sin costo.", hid="cta"):
    return f'''<section class="cta-band" aria-labelledby="{hid}">
  <div class="wrap">
    <h2 class="reveal" id="{hid}">{h2}</h2>
    <p>{p}</p>
    <div class="hero-actions">{wa_btn(wa, "Agenda tu diagnóstico sin costo")}<a class="textlink" href="/contacto">Otras formas de contacto</a></div>
  </div>
</section>'''

def card(href, small, h3, p, go="Ver más", navy=False):
    return f'<a class="card{" card-navy" if navy else ""}" href="{href}"><small>{small}</small><h3>{h3}</h3><p>{p}</p><span class="go">{go} {ARROW}</span></a>'

def li(items): return "".join("<li>%s</li>" % x for x in items)

# ---------------------------------------------------------------- páginas de servicio
def service_page(slug):
    d = SERVICES[slug]
    url = svc_url(slug)
    hero = page_hero([("Servicios", None), (d["nav"], None)], f'{d["unit"]} · {d["unit_name"]}', d["h1"], d["lede"],
                     wa_btn(f'Hola Espinoza T, me interesa {d["nav"].lower()} para mi empresa. ¿Agendamos el diagnóstico de 45 minutos?', "Agenda tu diagnóstico sin costo") + '<a class="textlink" href="#servicios-lista">Ver los servicios</a>',
                     d["facts"])
    hero = hero.replace('<nav class="crumbs" aria-label="Ruta"><a href="/">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">Servicios</span>', '<nav class="crumbs" aria-label="Ruta"><a href="/">Inicio</a><span aria-hidden="true">/</span><span>Servicios</span>')
    signals = f'''<section class="band" aria-labelledby="senales">
  <div class="wrap">
    <div class="cards2">
      <div>
        <h2 class="section-title reveal" id="senales">Te suena alguna de estas.</h2>
        <ul class="incl signals">{li(d["signals"])}</ul>
      </div>
      <div>
        <p class="kicker" style="margin-top:0">Para quién es</p>
        <div class="who">{"".join('<span class="pill-l">%s</span>' % w for w in d["who"])}</div>
        <p class="note">Frente de {d["front"]}. Atendemos desde Arequipa; Cusco e Ica por proyecto, y el resto del Perú en remoto o híbrido.</p>
      </div>
    </div>
  </div>
</section>'''
    cards = []
    for i, s in enumerate(d["services"]):
        msg = f'Hola Espinoza T, me interesa el servicio: {s["name"]}. ¿Podemos conversar?'
        cards.append(f'''<details class="svc"{" open" if i == 0 else ""}>
  <summary><div><h3>{E(s["name"])}</h3><p>{E(s["short"])}</p></div>{PLUS}</summary>
  <div class="svc-body">
    <div><h4>Qué incluye</h4><ul class="incl">{li(E(x) for x in s["incl"])}</ul></div>
    <div><h4>Qué no incluye</h4><ul class="excl">{li(E(x) for x in s["excl"])}</ul></div>
    <div><h4>Qué te entregamos</h4><p>{E(s["ent"])}</p></div>
    <div><h4>Qué necesitamos de tu empresa</h4><p>{E(s["nec"])}</p></div>
    <div class="svc-foot"><div class="svc-meta"><span class="pill-l"><b>Plazo</b> {E(s["plazo"])}</span><span class="pill-l">{E(s["model"])}</span></div>{wa_btn(msg, "Consultar este servicio", "btn btn-wine btn-small", icon=False)}</div>
  </div>
</details>''')
    note = '<p class="note svc-note">%s</p>' % E(d["note"]) if d.get("note") else ""
    lst = f'''<section class="band band-paper" id="servicios-lista" aria-labelledby="lista">
  <div class="wrap">
    <div class="head"><h2 class="reveal" id="lista">Qué hacemos, con detalle.</h2><p>Cada servicio dice qué incluye, qué no, qué te entregamos, en cuánto tiempo y qué necesitamos de tu empresa. La inversión se calcula según el número de trabajadores y queda por escrito en la propuesta.</p></div>
    {note}
    <div class="svc-list">{"".join(cards)}</div>
  </div>
</section>'''
    method = f'''<section class="band" aria-labelledby="como">
  <div class="wrap">
    <div class="head"><h2 class="reveal" id="como">Cómo trabajamos.</h2><p>Cinco pasos, siempre los mismos. Sabes qué vas a recibir antes de pagar un sol.</p></div>
    {steps_mini()}
  </div>
</section>'''
    rel = "".join(card(svc_url(r), SERVICES[r]["unit"], SERVICES[r]["nav"], SERVICES[r]["nav_desc"]) for r in d["related"])
    related = f'''<section class="band" aria-labelledby="relacionados">
  <div class="wrap">
    <div class="head"><h2 class="reveal" id="relacionados">Suele ir de la mano con.</h2></div>
    <div class="cards3">{rel}</div>
  </div>
</section>'''
    body = hero + signals + lst + method + faq_block(d["faq"]) + related + cta_band()
    graph = [crumbs_ld([("Inicio", "/"), (d["nav"], url)]), faq_ld(d["faq"]), {
        "@type": "Service", "@id": SITE + url + "#servicio", "name": d["unit_name"], "alternateName": d["nav"],
        "serviceType": d["nav"], "description": d["lede"], "provider": {"@id": SITE + "/#empresa"},
        "areaServed": {"@type": "City", "name": "Arequipa"}, "url": SITE + url,
        "hasOfferCatalog": {"@type": "OfferCatalog", "name": d["nav"], "itemListElement": [{"@type": "Offer", "itemOffered": {"@type": "Service", "name": s["name"], "description": s["short"]}} for s in d["services"]]}}]
    return page(url, d["title"], d["meta"], body, graph)

# ---------------------------------------------------------------- escribir
def write(path, content):
    if path == "/": fp = os.path.join(OUT, "index.html")
    else: fp = os.path.join(OUT, path.strip("/"), "index.html")
    os.makedirs(os.path.dirname(fp), exist_ok=True)
    with open(fp, "w", encoding="utf-8") as f: f.write(content)
    return fp

def build_assets():
    st = os.path.join(OUT, "static"); vd = os.path.join(OUT, "vendor")
    os.makedirs(st, exist_ok=True); os.makedirs(vd, exist_ok=True)
    css = open(os.path.join(HERE, "base.css"), encoding="utf-8").read() + "\n" + open(os.path.join(HERE, "components.css"), encoding="utf-8").read() + "\n" + open(os.path.join(HERE, "v2.css"), encoding="utf-8").read()
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    css = re.sub(r"\n\s*\n+", "\n", css)
    files = {"/static/site.css": css}
    for name in ("site.js", "termometro.js", "reel.js", "quiz.js", "calculadora.js", "certificado.js"):
        files["/static/" + name] = open(os.path.join(ROOT, "src", "static", name), encoding="utf-8").read()
    for name in ("lenis.min.js", "motion.js"):
        files["/vendor/" + name] = open(os.path.join(ROOT, "src", "vendor", name), encoding="utf-8").read()
    for p, c in files.items():
        with open(os.path.join(OUT, p.strip("/")), "w", encoding="utf-8") as f: f.write(c)
        ASSET_V[p] = hashlib.md5(c.encode("utf-8")).hexdigest()[:8]
    # fotos, fuentes e íconos: se toman de esta carpeta o, si no están, de ../public (repo eyt-web)
    def src(name):
        a = os.path.join(ROOT, name)
        return a if os.path.exists(a) else os.path.join(ROOT, "..", "public", name)
    for d in ("fonts", "personas"):
        shutil.copytree(src(d), os.path.join(OUT, d), dirs_exist_ok=True)
    shutil.copy(os.path.join(os.path.dirname(os.path.abspath(__file__)), "brand", "favicon.svg"), os.path.join(OUT, "favicon.svg"))
    shutil.copy(src("og.png"), os.path.join(OUT, "og.png"))
    for f in os.listdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), "brand")):
        if f.endswith(".svg") and f != "favicon.svg": shutil.copy(os.path.join(os.path.dirname(os.path.abspath(__file__)), "brand", f), os.path.join(OUT, f))

def main():
    if os.path.isdir(OUT): shutil.rmtree(OUT)
    os.makedirs(OUT)
    build_assets()
    urls = []
    def emit(path, html_, prio="0.7"):
        write(path, html_); urls.append((path, prio))
    emit("/", V2.home(sys.modules[__name__]), "1.0")
    for s in ORDER: emit(svc_url(s), service_page(s), "0.9")
    for path, fn in V2.NEW_PAGES:
        emit(path, fn(sys.modules[__name__]), "0.9")
    for path, fn in PC.PAGES:
        if path == "/termometro": continue
        emit(path, fn(sys.modules[__name__]), "0.8")
    for path, fn, in_map in PX.NEW_PAGES:
        if in_map: emit(path, fn(sys.modules[__name__]), "0.7")
        else: write(path, fn(sys.modules[__name__]))
    with open(os.path.join(OUT, "daniel.vcf"), "w", encoding="utf-8", newline="") as f: f.write(PX.VCARD)
    cj = os.path.join(ROOT, "src", "certificados.json")
    shutil.copy(cj, os.path.join(OUT, "certificados.json"))
    # 404, robots, sitemap, llms.txt
    with open(os.path.join(OUT, "404.html"), "w", encoding="utf-8") as f: f.write(PC.not_found(sys.modules[__name__]))
    with open(os.path.join(OUT, "robots.txt"), "w") as f:
        f.write("User-agent: *\nAllow: /\n\nSitemap: %s/sitemap.xml\n" % SITE)
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for p, pr in urls:
        sm.append("  <url><loc>%s%s</loc><lastmod>%s</lastmod><priority>%s</priority></url>" % (SITE, p, TODAY, pr))
    sm.append("</urlset>")
    with open(os.path.join(OUT, "sitemap.xml"), "w") as f: f.write("\n".join(sm) + "\n")
    with open(os.path.join(OUT, "llms.txt"), "w", encoding="utf-8") as f: f.write(PC.llms(sys.modules[__name__]))
    print("ok:", len(urls), "páginas")
    for p, _ in urls: print("  ", p)

if __name__ == "__main__":
    main()
