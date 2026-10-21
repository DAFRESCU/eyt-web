/* Espinoza T Personas — comportamiento común a todas las páginas */
(function () {
  var doc = document, root = doc.documentElement;
  var WA = "https://wa.me/51974770954";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("js");
  if (reduce) root.classList.add("reduce");
  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  window.ET = window.ET || {};
  ET.wa = function (text) { return WA + "?text=" + encodeURIComponent(text); };

  /* ---------- medición (Vercel Web Analytics, sin cookies) ----------
     Cada evento se registra como una visita a /evento/<nombre> y, si el plan lo permite, como evento propio.
     Así se ven en el panel de Analytics: clics a WhatsApp y herramientas completadas. */
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  var sent = {};
  ET.track = function (name, once) {
    if (once && sent[name]) return; sent[name] = 1;
    var from = location.pathname.replace(/\/$/, "") || "/inicio";
    try {
      window.va("event", { name: name, data: { pagina: from } });
      window.va("pageview", { route: "/evento/" + name, path: "/evento/" + name + from });
    } catch (e) {}
  };
  doc.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="https://wa.me"]');
    if (a) ET.track("whatsapp");
  }, true);

  /* ---------- enlaces de WhatsApp con mensaje listo ---------- */
  $$("[data-wa]").forEach(function (a) {
    a.href = ET.wa(a.getAttribute("data-wa"));
    a.target = "_blank"; a.rel = "noopener";
  });

  /* ---------- desplazamiento suave (solo escritorio, Lenis no toca el táctil) ---------- */
  if (!reduce && window.Lenis) {
    var lenis = new window.Lenis({ lerp: 0.1, anchors: { offset: -80 } });
    window.__lenis = lenis;
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
  }
  ET.scrollTo = function (el, offset) {
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: offset == null ? -80 : offset });
    else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  /* ---------- títulos que aparecen ---------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    root.classList.add("motion");
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -10% 0px" });
    reveals.forEach(function (r) { io.observe(r); });
  }

  /* ---------- línea del método ---------- */
  var line = $(".steps-line span"), steps = $(".steps");
  if (line && steps) {
    if (reduce) line.style.transform = "none";
    else {
      var drawLine = function () {
        var r = steps.getBoundingClientRect(), vh = innerHeight;
        var p = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height + vh * 0.25)));
        line.style.transform = "scaleX(" + p.toFixed(3) + ")";
      };
      addEventListener("scroll", drawLine, { passive: true }); drawLine();
    }
  }

  /* ---------- cabecera, botón flotante y barra móvil ---------- */
  var top = $("#top"), fab = $("#wa-float"), mbar = $("#mbar");
  var hero = $("#inicio");
  function onScroll() {
    var y = scrollY;
    if (top) top.classList.toggle("scrolled", y > 8);
    var limit = hero ? hero.offsetTop + hero.offsetHeight - innerHeight * 0.6 : innerHeight * 0.45;
    var past = y > limit;
    if (fab) fab.classList.toggle("show", past);
    if (mbar) mbar.classList.toggle("show", past && !doc.body.classList.contains("sheet-open"));
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  /* ---------- menú Clientes y servicios: cada grupo muestra sus unidades ---------- */
  $$(".menu-mega").forEach(function (m) {
    var gs = $$(".mega-g", m), ps = $$(".mega-p", m);
    function act(i) { gs.forEach(function (g, k) { g.classList.toggle("on", k === i); }); ps.forEach(function (p, k) { p.classList.toggle("on", k === i); }); }
    gs.forEach(function (g, i) {
      g.addEventListener("pointerenter", function () { act(i); });
      g.addEventListener("focus", function () { act(i); });
    });
    var c = gs.findIndex ? gs.findIndex(function (g) { return g.getAttribute("aria-current") === "page"; }) : -1;
    if (c > 0) act(c);
  });

  /* ---------- menú de pestañas ---------- */
  var nav = $(".nav"), pill = $(".nav-pill");
  var items = $$(".nav-item.has-menu");
  function closeAll(except) {
    items.forEach(function (it) {
      if (it === except) return;
      it.classList.remove("open");
      var b = $(".nav-link", it); if (b) b.setAttribute("aria-expanded", "false");
    });
  }
  function movePill(el, instant) {
    if (!pill || !nav) return;
    if (!el) { pill.classList.remove("on"); return; }
    var nr = nav.getBoundingClientRect(), r = el.getBoundingClientRect();
    pill.classList.toggle("instant", !!instant);
    pill.style.setProperty("--x", (r.left - nr.left) + "px");
    pill.style.setProperty("--w", r.width + "px");
    pill.classList.add("on");
  }
  var pillOn = false, hoverTimer;
  if (nav) {
    $$(".nav-link", nav).forEach(function (l) {
      l.addEventListener("pointerenter", function (e) {
        if (e.pointerType !== "mouse") return;
        movePill(l, !pillOn); pillOn = true;
      });
      l.addEventListener("focus", function () { movePill(l, !pillOn); pillOn = true; });
    });
    nav.addEventListener("pointerleave", function (e) {
      if (e.pointerType !== "mouse") return;
      movePill(null); pillOn = false;
      hoverTimer = setTimeout(function () { closeAll(); }, 160);
    });
    nav.addEventListener("pointerenter", function () { clearTimeout(hoverTimer); });
    nav.addEventListener("focusout", function (e) {
      if (!nav.contains(e.relatedTarget)) { movePill(null); pillOn = false; closeAll(); }
    });
  }
  items.forEach(function (it) {
    var btn = $(".nav-link", it);
    btn.addEventListener("click", function () {
      var open = !it.classList.contains("open");
      closeAll(it);
      it.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    it.addEventListener("pointerenter", function (e) {
      if (e.pointerType !== "mouse") return;
      clearTimeout(hoverTimer);
      closeAll(it);
      it.classList.add("open"); btn.setAttribute("aria-expanded", "true");
    });
  });
  doc.addEventListener("click", function (e) { if (nav && !nav.contains(e.target)) closeAll(); });
  doc.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var open = items.filter(function (it) { return it.classList.contains("open"); })[0];
    if (open) { closeAll(); $(".nav-link", open).focus(); }
    if (doc.body.classList.contains("sheet-open")) closeSheet(true);
  });

  /* ---------- hoja de menú en celular ---------- */
  var sheet = $("#sheet"), menuBtn = $("#menu-btn"), lastFocus;
  function openSheet() {
    if (!sheet) return;
    lastFocus = doc.activeElement;
    sheet.hidden = false;
    requestAnimationFrame(function () { sheet.classList.add("open"); });
    doc.body.classList.add("sheet-open");
    menuBtn.setAttribute("aria-expanded", "true");
    if (window.__lenis) window.__lenis.stop();
    onScroll();
    setTimeout(function () { var c = $(".sheet-close", sheet); if (c) c.focus(); }, 60);
  }
  function closeSheet(restore) {
    if (!sheet || !sheet.classList.contains("open")) return;
    sheet.classList.remove("open");
    doc.body.classList.remove("sheet-open");
    menuBtn.setAttribute("aria-expanded", "false");
    if (window.__lenis) window.__lenis.start();
    setTimeout(function () { if (!sheet.classList.contains("open")) sheet.hidden = true; }, 280);
    onScroll();
    if (restore && lastFocus) lastFocus.focus();
  }
  if (menuBtn && sheet) {
    menuBtn.addEventListener("click", openSheet);
    $(".sheet-close", sheet).addEventListener("click", function () { closeSheet(true); });
    $$("a", sheet).forEach(function (a) { a.addEventListener("click", function () { closeSheet(false); }); });
    sheet.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var f = $$("a[href],button,summary", sheet).filter(function (n) { return n.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && doc.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && doc.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
    addEventListener("resize", function () { if (innerWidth > 1080) closeSheet(false); });
  }

  /* ---------- formulario de contacto: arma el mensaje, sin servidor ---------- */
  var form = $("#contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = function (n) { var el = form.elements[n]; return el ? el.value.trim() : ""; };
      if (!d("nombre") || !d("mensaje")) {
        var st = $("#form-status"); st.textContent = "Escribe al menos tu nombre y qué necesitas.";
        (d("nombre") ? form.elements.mensaje : form.elements.nombre).focus();
        return;
      }
      var lines = ["Hola Daniel, te escribo desde la web."];
      lines.push("Nombre: " + d("nombre"));
      if (d("empresa")) lines.push("Empresa: " + d("empresa"));
      if (d("tamano")) lines.push("Trabajadores: " + d("tamano"));
      if (d("tema")) lines.push("Tema: " + d("tema"));
      lines.push("", d("mensaje"));
      var text = lines.join("\n");
      var via = (e.submitter && e.submitter.value) || "wa";
      if (via === "mail") {
        location.href = "mailto:gerencia@espinozat.com?subject=" + encodeURIComponent("Consulta desde la web" + (d("empresa") ? " · " + d("empresa") : "")) + "&body=" + encodeURIComponent(text);
      } else {
        window.open(ET.wa(text), "_blank", "noopener");
      }
      $("#form-status").textContent = via === "mail" ? "Se abrió tu correo con el mensaje listo. Solo dale enviar." : "Se abrió WhatsApp con tu mensaje listo. Solo dale enviar.";
    });
  }

  /* ---------- año en el pie ---------- */
  $$("[data-year]").forEach(function (n) { n.textContent = new Date().getFullYear(); });
})();
