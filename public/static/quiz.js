/* Espinoza T Personas — motor de herramientas (una pregunta por pantalla).
   Lee la configuración de <script id="quiz-data" type="application/json"> y arma la experiencia.
   Modos: "risk" (Sí/No/No sé con informe de puntos críticos) y "likert" (intereses, para la Brújula).
   No guarda nada: todo ocurre en el navegador. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var WA = "51974770954";
  function wa(t) { return (window.ET && ET.wa) ? ET.wa(t) : "https://wa.me/" + WA + "?text=" + encodeURIComponent(t); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- carrusel de herramientas (inicio): flechas ---------- */
  var rail = document.querySelector("[data-rail]");
  if (rail) {
    var step = function (dir) { var c = rail.querySelector(".tool-card"); var w = c ? c.getBoundingClientRect().width + 16 : 360; rail.scrollBy({ left: dir * w, behavior: reduce ? "auto" : "smooth" }); };
    var prev = document.querySelector("[data-rail-prev]"), next = document.querySelector("[data-rail-next]");
    if (prev) prev.addEventListener("click", function () { step(-1); });
    if (next) next.addEventListener("click", function () { step(1); });
    var upd = function () {
      if (prev) prev.disabled = rail.scrollLeft < 8;
      if (next) next.disabled = rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8;
    };
    rail.addEventListener("scroll", upd, { passive: true }); window.addEventListener("resize", upd); upd();
  }
  /* ---------- tarjetas con primera pregunta: llevan a la herramienta con la respuesta ya puesta ---------- */
  document.querySelectorAll("[data-teaser]").forEach(function (box) {
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-v]"); if (!b) return;
      window.location.href = box.getAttribute("data-teaser") + "#a=" + b.getAttribute("data-v");
    });
  });

  /* ---------- herramienta ---------- */
  var dataEl = document.getElementById("quiz-data");
  var root = document.getElementById("tool");
  if (!dataEl || !root) return;
  var C;
  try { C = JSON.parse(dataEl.textContent); } catch (e) { return; }
  var items = C.items, N = items.length;
  var answers = new Array(N).fill(null);
  var idx = 0, size = null;
  var opts = C.options; // [[etiqueta, valor], ...]
  var stage = root.querySelector(".tool-stage"), intro = root.querySelector(".tool-intro"), out = root.querySelector(".tool-result");

  function show(which) {
    intro.hidden = which !== "intro"; stage.hidden = which !== "stage"; out.hidden = which !== "out";
    root.setAttribute("data-view", which);
  }
  function focusTop(node) {
    var t = node.querySelector("[data-focus]") || node;
    t.setAttribute("tabindex", "-1"); try { t.focus({ preventScroll: true }); } catch (e) { t.focus(); }
    var r = root.getBoundingClientRect();
    if (r.top < 0 || r.top > 140) {
      var y = window.scrollY + r.top - 84;
      window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    }
  }

  /* pantalla de inicio */
  function start(preset) {
    idx = 0; answers = new Array(N).fill(null);
    if (preset !== undefined && preset !== null && opts[preset]) { answers[0] = preset; idx = 1; }
    show("stage"); renderQ(); focusTop(stage);
  }
  root.querySelectorAll("[data-start]").forEach(function (b) { b.addEventListener("click", function () { start(); }); });
  var sizeBtns = root.querySelectorAll("[data-size]");
  sizeBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      size = b.getAttribute("data-size");
      sizeBtns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    });
  });

  /* pregunta */
  function renderQ() {
    var it = items[idx];
    var g = C.groups ? C.groups[it.g] : null;
    var pct = Math.round((idx / N) * 100);
    var h = '';
    h += '<div class="tq-top"><p class="tq-count" aria-live="polite">Pregunta ' + (idx + 1) + ' de ' + N + '</p>' + (g ? '<p class="tq-group">' + esc(g.name) + '</p>' : '') + '</div>';
    h += '<div class="tq-bar" role="presentation"><i style="transform:scaleX(' + (pct / 100) + ')"></i></div>';
    h += '<h2 class="tq-q" data-focus id="tq-q">' + esc(it.q) + '</h2>';
    h += '<div class="tq-opts" role="radiogroup" aria-labelledby="tq-q">';
    opts.forEach(function (o, k) {
      var on = answers[idx] === k;
      h += '<button type="button" class="tq-opt' + (on ? " on" : "") + '" role="radio" aria-checked="' + on + '" data-k="' + k + '"><kbd aria-hidden="true">' + (k + 1) + '</kbd><span>' + esc(o[0]) + '</span></button>';
    });
    h += '</div>';
    if (it.why) h += '<details class="tq-why"><summary>' + esc(C.whyLabel || "¿Por qué importa?") + '</summary><p>' + esc(it.why) + '</p></details>';
    h += '<div class="tq-nav"><button type="button" class="linkbtn" data-back' + (idx === 0 ? " hidden" : "") + '>← Atrás</button>' +
         (C.mode === "risk" ? '<p class="tq-hint">«No sé» también cuenta: lo que no puedes comprobar, no te protege.</p>' : '<p class="tq-hint">No hay respuestas buenas ni malas.</p>') + '</div>';
    stage.innerHTML = h;
    stage.querySelectorAll(".tq-opt").forEach(function (b) { b.addEventListener("click", function () { pick(parseInt(b.getAttribute("data-k"), 10)); }); });
    var back = stage.querySelector("[data-back]");
    if (back) back.addEventListener("click", function () { if (idx > 0) { idx--; renderQ(); focusTop(stage); } });
  }
  var locked = false;
  function pick(k) {
    if (locked) return;
    answers[idx] = k; locked = true;
    stage.querySelectorAll(".tq-opt").forEach(function (b, j) { var on = j === k; b.classList.toggle("on", on); b.setAttribute("aria-checked", on); });
    setTimeout(function () {
      locked = false;
      if (idx < N - 1) { idx++; renderQ(); focusTop(stage); }
      else finish();
    }, reduce ? 0 : 260);
  }
  document.addEventListener("keydown", function (e) {
    if (stage.hidden || e.ctrlKey || e.metaKey || e.altKey) return;
    var n = parseInt(e.key, 10);
    if (n >= 1 && n <= opts.length) { e.preventDefault(); pick(n - 1); }
    else if (e.key === "ArrowLeft" && idx > 0) { idx--; renderQ(); focusTop(stage); }
  });

  /* ---------- resultados ---------- */
  function finish() {
    if (C.mode === "likert") resultLikert(); else resultRisk();
    show("out"); focusTop(out);
  }
  function actions(msg) {
    return '<div class="tr-actions">' +
      '<a class="btn btn-wine" target="_blank" rel="noopener" href="' + wa(msg) + '"><svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2Zm5.8 14.09c-.24.68-1.42 1.3-1.95 1.34-.5.05-1.13.2-3.8-.86-3.2-1.27-5.24-4.56-5.4-4.77-.16-.21-1.29-1.72-1.29-3.28 0-1.56.82-2.33 1.11-2.65.29-.31.63-.39.84-.39l.6.01c.2 0 .45-.07.71.54.26.63.89 2.18.97 2.34.08.16.13.34.03.55-.1.21-.16.34-.31.52-.16.18-.33.41-.47.55-.16.16-.32.33-.14.65.18.31.82 1.35 1.76 2.19 1.21 1.08 2.23 1.41 2.55 1.57.31.16.5.13.68-.08.18-.21.79-.92 1-1.24.21-.31.42-.26.71-.16.29.11 1.83.86 2.15 1.02.31.16.52.24.6.37.08.13.08.76-.16 1.45Z"/></svg>' + esc(C.waLabel || "Revisar mi resultado por WhatsApp") + '</a>' +
      '<button type="button" class="btn btn-outline" data-print>Guardar mi informe (PDF)</button>' +
      '<button type="button" class="linkbtn" data-restart>Empezar de nuevo</button></div>';
  }
  function bindResult() {
    var p = out.querySelector("[data-print]"); if (p) p.addEventListener("click", function () { window.print(); });
    var r = out.querySelector("[data-restart]"); if (r) r.addEventListener("click", function () { show("intro"); focusTop(intro); });
  }
  function today() { var d = new Date(); return d.toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" }); }

  function resultRisk() {
    var G = C.groups.length, sub = new Array(G).fill(0), cnt = new Array(G).fill(0), gaps = [];
    items.forEach(function (it, i) {
      cnt[it.g]++;
      var v = opts[answers[i]][1];
      if (v > 0) { sub[it.g] += 1; gaps.push({ it: it, unknown: answers[i] === (C.unknownIndex), g: it.g }); }
    });
    var total = sub.reduce(function (a, b) { return a + b; }, 0);
    var lead = 0; for (var b = 1; b < G; b++) if (sub[b] > sub[lead]) lead = b;
    var vd = C.verdicts[C.verdicts.length - 1];
    for (var k = 0; k < C.verdicts.length; k++) if (total <= C.verdicts[k].max) { vd = C.verdicts[k]; break; }
    var where = C.groups[lead].name.toLowerCase();
    var h = '<div class="tr-head" data-focus><p class="kicker kicker-light">' + esc(C.reportTitle || "Tu informe") + ' · ' + today() + (size ? ' · Empresa de ' + esc(size) + ' trabajadores' : '') + '</p>' +
      '<div class="tr-score"><p class="tr-num">' + total + '<small> de ' + N + '</small></p><div><p class="tr-verdict">' + esc(vd.t) + '</p><p class="tr-adv">' + esc(vd.a.replace("{donde}", where)) + '</p></div></div></div>';
    h += '<div class="tr-bars">';
    C.groups.forEach(function (g, i) {
      var pc = Math.round(sub[i] / cnt[i] * 100);
      var lvl = sub[i] === 0 ? "en orden" : (sub[i] / cnt[i] <= 0.5 ? "atención" : "prioritario");
      h += '<div class="tr-bar' + (i === lead && total > 0 ? " lead" : "") + '"><b>' + esc(g.name) + '</b><div class="tr-track"><i style="transform:scaleX(' + (pc / 100) + ')"></i></div><span>' + sub[i] + ' de ' + cnt[i] + ' · ' + lvl + '</span></div>';
    });
    h += '</div>';
    if (gaps.length) {
      h += '<h2 class="tr-h">Lo que encontramos, punto por punto</h2><p class="tr-sub">Ordenado por frente. Cada punto dice qué significa, qué riesgo trae y por dónde empezar.</p><ol class="tr-gaps">';
      gaps.forEach(function (x, n) {
        h += '<li class="tr-gap"><div class="tr-gap-top"><span class="tr-n">' + (n + 1) + '</span><div><p class="tr-gap-g">' + esc(C.groups[x.g].name) + (x.unknown ? ' · respondiste «No sé»' : '') + '</p><h3>' + esc(x.it.gap) + '</h3></div></div>' +
          '<dl><div><dt>Qué significa</dt><dd>' + esc(x.it.why) + '</dd></div><div><dt>Qué riesgo trae</dt><dd>' + esc(x.it.risk) + '</dd></div><div><dt>Por dónde empezar</dt><dd>' + esc(x.it.step) + '</dd></div></dl></li>';
      });
      h += '</ol>';
    } else {
      h += '<p class="tr-sub">No encontramos puntos críticos en esta revisión. Lo que sigue es sostenerlo: revisarlo cada año y dejar evidencia.</p>';
    }
    if (C.links && gaps.length) {
      h += '<p class="tr-next">Si quieres ordenar este frente con acompañamiento: <a class="textlink" href="' + C.links[lead] + '">ver cómo trabajamos ' + esc(where) + '</a>.</p>';
    }
    h += '<p class="tr-note">' + esc(C.note) + '</p>';
    var msg = C.waIntro + "\n" + (size ? "Somos " + size + " trabajadores.\n" : "") + "Resultado: " + total + " de " + N + " (" + vd.t.toLowerCase() + ").\n" +
      C.groups.map(function (g, i) { return g.name + " " + sub[i] + "/" + cnt[i]; }).join(", ") + ".\nMe gustaría revisarlo contigo.";
    h += actions(msg);
    out.innerHTML = h; bindResult();
  }

  function resultLikert() {
    var T = C.types, keys = Object.keys(T), score = {}, cnt = {};
    keys.forEach(function (k) { score[k] = 0; cnt[k] = 0; });
    items.forEach(function (it, i) { score[it.t] += opts[answers[i]][1]; cnt[it.t] += 3; });
    var rank = keys.slice().sort(function (a, b) { return score[b] - score[a] || keys.indexOf(a) - keys.indexOf(b); });
    var top = rank.slice(0, 3);
    var h = '<div class="tr-head" data-focus><p class="kicker kicker-light">' + esc(C.reportTitle) + ' · ' + today() + '</p>' +
      '<div class="tr-score tr-score-b"><div><p class="tr-verdict">Tu mapa: ' + top.map(function (k) { return esc(T[k].name); }).join(" · ") + '</p><p class="tr-adv">' + esc(C.lead) + '</p></div></div></div>';
    h += '<div class="tr-bars">';
    rank.forEach(function (k, i) {
      h += '<div class="tr-bar' + (i < 3 ? " lead" : "") + '"><b>' + esc(T[k].name) + '</b><div class="tr-track"><i style="transform:scaleX(' + (score[k] / cnt[k]) + ')"></i></div><span>' + score[k] + ' de ' + cnt[k] + '</span></div>';
    });
    h += '</div><h2 class="tr-h">Tus tres caminos para explorar</h2><ol class="tr-gaps">';
    top.forEach(function (k, n) {
      h += '<li class="tr-gap"><div class="tr-gap-top"><span class="tr-n">' + (n + 1) + '</span><div><p class="tr-gap-g">' + esc(T[k].tag) + '</p><h3>' + esc(T[k].name) + '</h3></div></div>' +
        '<dl><div><dt>Cómo eres cuando estás en lo tuyo</dt><dd>' + esc(T[k].desc) + '</dd></div><div><dt>Áreas para explorar</dt><dd>' + T[k].areas.map(function (a) { return '<span class="chip-l">' + esc(a) + '</span>'; }).join("") + '</dd></div><div><dt>Para probarlo esta semana</dt><dd>' + esc(T[k].try) + '</dd></div></dl></li>';
    });
    h += '</ol><p class="tr-note">' + esc(C.note) + '</p>';
    var msg = C.waIntro + "\nMi mapa: " + top.map(function (k) { return T[k].name; }).join(", ") + ".\nMe gustaría conversar sobre orientación vocacional.";
    h += actions(msg);
    out.innerHTML = h; bindResult();
  }

  /* ---------- arranque: respuesta que viene de la tarjeta del inicio ---------- */
  var m = /[#&]a=(\d)/.exec(window.location.hash || "");
  show("intro");
  if (m && opts[parseInt(m[1], 10)]) {
    start(parseInt(m[1], 10));
    try { history.replaceState(null, "", window.location.pathname); } catch (e) {}
  }
})();
