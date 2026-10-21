# -*- coding: utf-8 -*-
"""Genera una imagen para compartir (1200x630) por página, a partir del kicker y el H1 de cada HTML en out/."""
import os, re, html, glob, http.server, threading, functools
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "out")
PORT = 8799
TPL = """<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"Fraunces";src:url("http://localhost:%(p)d/fonts/fraunces-latin-full-normal.woff2") format("woff2-variations");font-weight:100 900}
@font-face{font-family:"Inter";src:url("http://localhost:%(p)d/fonts/inter-latin-wght-normal.woff2") format("woff2-variations");font-weight:100 900}
html,body{margin:0}
body{width:1200px;height:630px;background:#F3EEE6;color:#1B2A4A;position:relative;overflow:hidden;font-family:"Inter"}
.k{position:absolute;left:88px;top:92px;right:88px;font:600 24px/1.2 "Inter";letter-spacing:.08em;text-transform:uppercase;color:#6E2438}
.h{position:absolute;left:88px;top:150px;right:88px;font-family:"Fraunces";font-weight:450;font-size:%(fs)dpx;line-height:1.04;letter-spacing:-.03em;font-variation-settings:"SOFT" 50,"WONK" 0}
.bar{position:absolute;left:88px;top:92px;width:0}
.foot{position:absolute;left:88px;right:88px;bottom:60px;display:flex;justify-content:space-between;align-items:baseline;font-size:23px;color:#4A433B;border-top:2px solid #D9D0C2;padding-top:24px}
.lg{display:block;height:44px;width:auto}
.b{font-family:"Fraunces";font-weight:600;font-size:34px;color:#1B2A4A;letter-spacing:-.02em}.b span{color:#6E2438}.b small{font-family:"Inter";font-weight:500;font-size:20px;color:#4A433B;letter-spacing:.06em;margin-left:10px}
</style></head><body><div class="k">%(k)s</div><div class="h">%(h)s</div>
<div class="foot"><img class="lg" src="http://localhost:%(p)d/logo-horizontal.svg" height="44"><span>espinozat.com · Arequipa</span></div></body></html>"""

def strip(t): return html.unescape(re.sub(r"<[^>]+>", "", t)).strip()

def main():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=OUT)
    handler.log_message = lambda *a, **k: None
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    os.makedirs(os.path.join(OUT, "og"), exist_ok=True)
    pages = sorted(glob.glob(os.path.join(OUT, "**", "index.html"), recursive=True))
    with sync_playwright() as pw:
        b = pw.chromium.launch()
        pg = b.new_page(viewport={"width": 1200, "height": 630})
        n = 0
        for f in pages:
            rel = os.path.relpath(os.path.dirname(f), OUT)
            slug = "inicio" if rel == "." else rel.replace(os.sep, "-")
            src = open(f, encoding="utf-8").read()
            m = re.search(r"<h1[^>]*>(.*?)</h1>", src, re.S)
            k = re.search(r'<p class="kicker">(.*?)</p>', src, re.S)
            h1 = strip(m.group(1)) if m else "Piensa en personas."
            if slug == "inicio": h1, kick = "Piensa en personas.", "Capacitación, cultura y clima laboral"
            else: kick = strip(k.group(1)) if k else "Espinoza T Personas"
            fs = 96 if len(h1) < 34 else 80 if len(h1) < 60 else 64
            pg.set_content(TPL % {"p": PORT, "k": html.escape(kick), "h": html.escape(h1), "fs": fs}, wait_until="networkidle")
            pg.evaluate("document.fonts.ready")
            pg.screenshot(path=os.path.join(OUT, "og", slug + ".png"))
            n += 1
        b.close()
    srv.shutdown()
    print("og:", n, "imágenes")

if __name__ == "__main__":
    main()
