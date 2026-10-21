/* Espinoza T Personas — buscador de servicios y «Arma tu consulta» */
(function () {
  var doc = document;
  var WA = "https://wa.me/51974770954";
  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function track(n) { try { window.ET && ET.track && ET.track(n); } catch (e) {} }
  function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ================= Buscador ================= */
  var idx = null, box, input, list, lastFocus;
  function load() {
    if (idx) return Promise.resolve(idx);
    return fetch("/static/buscar.json").then(function (r) { return r.json(); }).then(function (d) { idx = d.map(function (x) { x.n = norm(x.t + " " + x.s + " " + (x.k || "")); return x; }); return idx; });
  }
  function build() {
    box = doc.createElement("div");
    box.className = "srch"; box.hidden = true;
    box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", "Buscar un servicio");
    box.innerHTML = '<div class="srch-back" data-close></div><div class="srch-panel"><div class="srch-top"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><input type="search" placeholder="Busca un servicio: clima, oratoria, regidores, jornada…" aria-label="Busca un servicio" autocomplete="off"><button type="button" class="srch-x" data-close aria-label="Cerrar">Esc</button></div><ul class="srch-list" data-lenis-prevent></ul><p class="srch-hint">¿No lo encuentras? <a href="' + WA + '?text=' + encodeURIComponent("Hola Espinoza T, busco un servicio que no encontré en la web: ") + '" target="_blank" rel="noopener">Escríbenos por WhatsApp</a> y te decimos si lo hacemos.</p></div>';
    doc.body.appendChild(box);
    input = $("input", box); list = $(".srch-list", box);
    input.addEventListener("input", render);
    input.addEventListener("keydown", function (e) {
      var items = $$("a", list), i = items.indexOf(doc.activeElement);
      if (e.key === "ArrowDown" && items.length) { e.preventDefault(); items[0].focus(); }
      if (e.key === "Enter" && items.length) { e.preventDefault(); items[0].click(); }
    });
    list.addEventListener("keydown", function (e) {
      var items = $$("a", list), i = items.indexOf(doc.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); (items[i + 1] || items[i]).focus(); }
      if (e.key === "ArrowUp") { e.preventDefault(); (i > 0 ? items[i - 1] : input).focus(); }
    });
    box.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) close();
      var a = e.target.closest("a[data-r]"); if (a) { track("buscador-resultado"); close(); }
    });
  }
  function render() {
    var q = norm(input.value).trim(), words = q.split(/\s+/).filter(Boolean), out = [];
    if (!idx) return;
    if (!words.length) { out = idx.filter(function (x) { return x.f; }); }
    else {
      idx.forEach(function (x) {
        if (words.every(function (w) { return x.n.indexOf(w) > -1; })) {
          var sc = (norm(x.t).indexOf(words[0]) === 0 ? 3 : 0) + (norm(x.t).indexOf(q) > -1 ? 2 : 0) + (x.y === "Servicio" ? 1 : 0);
          out.push([sc, x]);
        }
      });
      out = out.sort(function (a, b) { return b[0] - a[0]; }).map(function (p) { return p[1]; });
    }
    out = out.slice(0, 9);
    list.innerHTML = out.length ? out.map(function (x) {
      return '<li><a data-r href="' + esc(x.u) + '"><small>' + esc(x.y) + ' · ' + esc(x.s) + '</small><b>' + esc(x.t) + '</b></a></li>';
    }).join("") : '<li class="srch-none">No encontramos «' + esc(input.value) + '». Prueba con otra palabra.</li>';
  }
  function open() {
    if (!box) build();
    lastFocus = doc.activeElement;
    box.hidden = false; doc.documentElement.classList.add("srch-on");
    load().then(render).catch(function () { list.innerHTML = '<li class="srch-none">No se pudo cargar el buscador. Recarga la página.</li>'; });
    setTimeout(function () { input.focus(); input.select(); }, 30);
    track("buscador-abierto");
  }
  function close() {
    if (!box || box.hidden) return;
    box.hidden = true; doc.documentElement.classList.remove("srch-on");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  doc.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-search]");
    if (t) { e.preventDefault(); var sh = doc.querySelector(".sheet.open, .sheet[open]"); open(); }
  });
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
    var typing = /input|textarea|select/i.test((doc.activeElement || {}).tagName || "");
    if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing)) { e.preventDefault(); open(); }
  });

  /* ================= Arma tu consulta ================= */
  var KEY = "et-consulta", sel = [];
  try { sel = JSON.parse(localStorage.getItem(KEY) || "[]") || []; } catch (e) { sel = []; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(sel)); } catch (e) {} }
  function has(n) { return sel.some(function (x) { return x.n === n; }); }
  var bar;
  function msg() {
    return "Hola Espinoza T, me interesan estos servicios:\n" + sel.map(function (x) { return "• " + x.n + (x.u ? " (" + x.u + ")" : ""); }).join("\n") + "\n¿Podemos conversar para armar una propuesta?";
  }
  function paint() {
    $$("[data-add]").forEach(function (b) {
      var on = has(b.getAttribute("data-add"));
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.querySelector("span").textContent = on ? "Agregado a tu consulta" : "Agregar a mi consulta";
    });
    if (!bar) {
      bar = doc.createElement("div"); bar.className = "cbar"; bar.setAttribute("role", "region"); bar.setAttribute("aria-label", "Tu consulta");
      bar.innerHTML = '<div class="cbar-txt"><b></b><button type="button" class="cbar-ver">Ver</button></div><ul class="cbar-list" hidden></ul><div class="cbar-act"><a class="btn btn-wine btn-small cbar-send" target="_blank" rel="noopener">Enviar por WhatsApp</a><button type="button" class="cbar-clear" aria-label="Vaciar la consulta">Vaciar</button></div>';
      doc.body.appendChild(bar);
      $(".cbar-ver", bar).addEventListener("click", function () { var l = $(".cbar-list", bar); l.hidden = !l.hidden; this.textContent = l.hidden ? "Ver" : "Ocultar"; });
      $(".cbar-clear", bar).addEventListener("click", function () { sel = []; save(); paint(); });
      $(".cbar-send", bar).addEventListener("click", function () { track("consulta-armada"); });
      bar.addEventListener("click", function (e) { var r = e.target.closest("[data-rm]"); if (r) { var n = r.getAttribute("data-rm"); sel = sel.filter(function (x) { return x.n !== n; }); save(); paint(); } });
    }
    bar.classList.toggle("show", sel.length > 0);
    doc.documentElement.classList.toggle("cbar-on", sel.length > 0);
    $("b", bar).textContent = sel.length === 1 ? "1 servicio en tu consulta" : sel.length + " servicios en tu consulta";
    $(".cbar-list", bar).innerHTML = sel.map(function (x) { return '<li><span>' + esc(x.n) + '</span><button type="button" data-rm="' + esc(x.n) + '" aria-label="Quitar ' + esc(x.n) + '">×</button></li>'; }).join("");
    $(".cbar-send", bar).href = WA + "?text=" + encodeURIComponent(msg());
  }
  var unit = ($(".page-hero .kicker") || {}).textContent || "";
  $$("details.svc").forEach(function (d) {
    var h = $("summary h3", d), foot = $(".svc-foot", d);
    if (!h || !foot) return;
    var name = h.textContent.trim();
    var b = doc.createElement("button");
    b.type = "button"; b.className = "btn-add"; b.setAttribute("data-add", name); b.setAttribute("data-unit", unit.trim());
    b.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><span>Agregar a mi consulta</span>';
    b.addEventListener("click", function () {
      if (has(name)) sel = sel.filter(function (x) { return x.n !== name; });
      else { sel.push({ n: name, u: unit.trim() }); track("consulta-agregar"); }
      save(); paint();
    });
    foot.appendChild(b);
  });
  paint();
})();

/* barra de avance de lectura */
(function () {
  var bar = document.querySelector(".read-bar span"); if (!bar) return;
  var tick = false;
  function upd() { tick = false; var h = document.documentElement, max = h.scrollHeight - h.clientHeight; bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, h.scrollTop / max) : 0) + ")"; }
  window.addEventListener("scroll", function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
  window.addEventListener("resize", upd); upd();
})();
