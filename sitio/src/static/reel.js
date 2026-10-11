/* Espinoza T Personas — reel de personas.
   Fotos con la misma estructura que se funden una en otra con el scroll.
   La frase "No pienses solo en ___" acompaña a cada persona con una palabra de su rubro,
   y al final todos los rubros vistos vuelan hacia la palabra "rubros". */
(function () {
  var reel = document.getElementById("inicio");
  if (!reel) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var imgs = Array.prototype.slice.call(reel.querySelectorAll("img.reel-img"));
  var layers = Array.prototype.slice.call(reel.querySelectorAll(".reel-layer"));
  var cycle = Array.prototype.slice.call(reel.querySelectorAll(".reel-cycle li"));
  var chips = Array.prototype.slice.call(reel.querySelectorAll(".reel-rubros .chip"));
  var struck = reel.querySelector(".struck");
  var word = struck && struck.querySelector(".w");
  var N = imgs.length;
  if (N < 2 || reduce || !word) return;

  document.documentElement.classList.add("reel-on");
  /* en celular el recorrido mide la mitad: el que quiere verlo lo ve, el que no, lo salta */
  var SEG = 72;
  function size() {
    SEG = window.innerWidth <= 760 ? 36 : 72;
    reel.style.height = (100 + (N - 1) * SEG + (SEG > 40 ? 50 : 30)) + "vh";
  }
  size();
  window.addEventListener("resize", size);

  /* fotos 2..N: se cargan después de la primera, para no frenar la portada */
  var loaded = false;
  function loadRest() {
    if (loaded) return; loaded = true;
    imgs.forEach(function (im) {
      var pic = im.parentNode;
      if (pic && pic.tagName === "PICTURE") {
        Array.prototype.forEach.call(pic.querySelectorAll("source[data-srcset]"), function (s) { s.srcset = s.getAttribute("data-srcset"); s.removeAttribute("data-srcset"); });
      }
      if (im.getAttribute("data-src")) { im.src = im.getAttribute("data-src"); im.removeAttribute("data-src"); }
    });
  }
  if (document.readyState === "complete") setTimeout(loadRest, 200);
  else window.addEventListener("load", function () { setTimeout(loadRest, 200); });
  window.addEventListener("scroll", loadRest, { passive: true, once: true });

  var M = window.Motion;
  var EASE = [0.23, 1, 0.32, 1];
  function clamp(x, a, b) { return Math.min(b, Math.max(a, x)); }
  function smooth(e0, e1, x) { var t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); }
  function anim(el, kf, opts) { if (M && M.animate) return M.animate(el, kf, opts); for (var k in kf) { var v = kf[k]; el.style[k] = Array.isArray(v) ? v[v.length - 1] : v; } }

  /* ---------- la palabra tachada ---------- */
  var wordToken = 0, shownWord = word.textContent;
  function setWord(w, delay) {
    if (w === shownWord) return;
    var token = ++wordToken;
    shownWord = w;
    setTimeout(function () {
      if (token !== wordToken) return;
      struck.style.setProperty("--strike", "0");
      word.classList.add("out");
      setTimeout(function () {
        if (token !== wordToken) return;
        word.textContent = w;
        word.classList.remove("out");
        setTimeout(function () { if (token === wordToken) struck.style.setProperty("--strike", "1"); }, 160);
      }, 260);
    }, delay || 0);
  }

  /* ---------- capas de texto ---------- */
  var current = 0;
  function showLayer(idx) {
    var prev = layers[current], el = layers[idx];
    if (prev && prev !== el) {
      anim(prev, { opacity: 0, y: -10 }, { duration: 0.25, ease: EASE });
      var p = prev;
      setTimeout(function () { if (layers[current] !== p) p.classList.remove("on"); }, 260);
      p.setAttribute("aria-hidden", "true");
    }
    el.classList.add("on");
    el.setAttribute("aria-hidden", "false");
    anim(el, { opacity: 1, y: 0 }, { duration: 0.01 });
    var kids = el.querySelectorAll(".k, .say, .hero-lede, .hero-actions, .btn");
    anim(kids, { opacity: [0, 1], y: [18, 0], filter: ["blur(6px)", "blur(0px)"] },
      { duration: 0.65, ease: EASE, delay: M && M.stagger ? M.stagger(0.07, { startDelay: 0.08 }) : 0 });
    current = idx;
  }

  /* ---------- rubros que se juntan en la palabra final ---------- */
  var merged = false;
  function merge(on) {
    if (on === merged) return;
    merged = on;
    chips[0].parentNode.classList.toggle("merging", on);
    var t = word.getBoundingClientRect();
    var tx = t.left + t.width / 2, ty = t.top + t.height / 2;
    chips.forEach(function (c, i) {
      if (on) {
        var r = c.getBoundingClientRect();
        var dx = tx - (r.left + r.width / 2), dy = ty - (r.top + r.height / 2);
        anim(c, { x: dx, y: dy, scale: 0.35 }, { duration: 0.75, ease: [0.77, 0, 0.175, 1], delay: i * 0.05 });
        anim(c.firstChild, { opacity: [1, 0] }, { duration: 0.35, ease: "ease-in", delay: i * 0.05 + 0.45 });
      } else {
        anim(c, { x: 0, y: 0, scale: 1 }, { duration: 0.5, ease: EASE, delay: (chips.length - i) * 0.03 });
        anim(c.firstChild, { opacity: 1 }, { duration: 0.3, ease: EASE, delay: (chips.length - i) * 0.03 });
      }
    });
    if (on) {
      setWord(imgs[N - 1].getAttribute("data-word"), 650);
      setTimeout(function () { if (merged) anim(struck, { scale: [1, 1.08, 1] }, { duration: 0.5, ease: EASE }); }, 1000);
    }
  }

  var lastIdx = -1, lastP = -1;
  function frame() {
    requestAnimationFrame(frame);
    var rect = reel.getBoundingClientRect();
    var vh = window.innerHeight;
    if (rect.bottom < -50 || rect.top > vh + 50) return;
    var total = reel.offsetHeight - vh;
    var p = clamp(-rect.top / Math.max(1, total), 0, 1);
    if (Math.abs(p - lastP) < 0.00005) return;
    lastP = p;

    // u avanza de 0 a N-1: una unidad por persona, con pausa al inicio y al final
    var u = clamp((p - 0.04) / 0.9, 0, 1) * (N - 1);
    var i = Math.floor(u), f = u - i;
    var fade = smooth(0.5, 1, f);
    for (var j = 0; j < N; j++) {
      var op = j === i ? 1 : (j === i + 1 ? fade : 0);
      var img = imgs[j];
      if (op <= 0.001 && img.__op === 0) continue;
      img.__op = op <= 0.001 ? 0 : op;
      img.style.opacity = op.toFixed(3);
      img.style.transform = "scale(" + (1.03 + 0.05 * clamp((u - j + 1) / 2, 0, 1)).toFixed(4) + ")";
    }

    var idx = clamp(Math.round(u - 0.25), 0, N - 1);
    if (idx !== lastIdx) {
      lastIdx = idx;
      showLayer(idx);
      chips.forEach(function (c, k) { c.classList.toggle("seen", k < idx); c.classList.toggle("now", k === idx); });
      if (idx === N - 1) merge(true);
      else { merge(false); setWord(imgs[idx].getAttribute("data-word")); }
    }
    for (var k = 0; k < cycle.length; k++) {
      cycle[k].style.setProperty("--fill", (clamp(u - k, 0, 1) * 100).toFixed(1) + "%");
      cycle[k].classList.toggle("on", idx === k + 1);
    }
  }
  requestAnimationFrame(frame);
})();
