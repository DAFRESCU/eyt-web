/* Espinoza T Personas — portada en carrusel.
   Cambia sola cada pocos segundos: una persona, una palabra, una unidad.
   No secuestra el scroll: quien quiere bajar, baja. Se pausa con el mouse, el teclado, el dedo o el botón. */
(function () {
  var reel = document.getElementById("inicio");
  if (!reel) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var slides = Array.prototype.slice.call(reel.querySelectorAll(".reel-slide"));
  var layers = Array.prototype.slice.call(reel.querySelectorAll(".reel-cap"));
  var dots = Array.prototype.slice.call(reel.querySelectorAll(".reel-cycle li"));
  var struck = reel.querySelector(".struck");
  var word = struck && struck.querySelector(".w");
  var pauseBtn = reel.querySelector(".reel-pause");
  var N = slides.length;
  if (N < 2 || !word) return;

  var DUR = 3000;
  var idx = 0, timer = null, userPaused = reduce, hoverPaused = false, hidden = false, offscreen = false;
  reel.style.setProperty("--dur", DUR + "ms");

  /* fotos 2..N: se cargan después de la primera, para no frenar la portada */
  var loaded = false;
  function loadRest() {
    if (loaded) return; loaded = true;
    reel.querySelectorAll("img[data-src]").forEach(function (im) {
      var pic = im.parentNode;
      if (pic && pic.tagName === "PICTURE") {
        Array.prototype.forEach.call(pic.querySelectorAll("source[data-srcset]"), function (s) { s.srcset = s.getAttribute("data-srcset"); s.removeAttribute("data-srcset"); });
      }
      im.src = im.getAttribute("data-src"); im.removeAttribute("data-src");
    });
  }
  if (document.readyState === "complete") setTimeout(loadRest, 300);
  else window.addEventListener("load", function () { setTimeout(loadRest, 300); });

  /* ---------- la palabra tachada ---------- */
  var wordToken = 0, shownWord = word.textContent;
  function setWord(w) {
    if (w === shownWord) return;
    var token = ++wordToken; shownWord = w;
    struck.style.setProperty("--strike", "0");
    word.classList.add("out");
    setTimeout(function () {
      if (token !== wordToken) return;
      word.textContent = w; word.classList.remove("out");
      setTimeout(function () { if (token === wordToken) struck.style.setProperty("--strike", "1"); }, 180);
    }, 260);
  }

  function go(i) {
    i = (i + N) % N;
    slides.forEach(function (s, k) { s.classList.toggle("on", k === i); });
    layers.forEach(function (l, k) { var on = k === i; l.classList.toggle("on", on); l.setAttribute("aria-hidden", on ? "false" : "true"); });
    dots.forEach(function (d, k) {
      d.classList.toggle("on", k === i);
      d.classList.toggle("done", k < i);
      var b = d.querySelector("button"); if (b) b.setAttribute("aria-current", k === i ? "true" : "false");
      if (k === i) { d.classList.remove("on"); void d.offsetWidth; d.classList.add("on"); }
    });
    setWord(slides[i].getAttribute("data-word"));
    reel.classList.toggle("is-last", i === N - 1);
    idx = i;
  }

  function running() { return !userPaused && !hoverPaused && !hidden && !offscreen; }
  function schedule() {
    clearTimeout(timer);
    reel.classList.toggle("paused", !running());
    if (!running()) return;
    timer = setTimeout(function () { go(idx + 1); schedule(); }, DUR);
  }
  function jump(i) { go(i); schedule(); }

  dots.forEach(function (d, k) { var b = d.querySelector("button"); if (b) b.addEventListener("click", function () { jump(k); }); });
  if (pauseBtn) pauseBtn.addEventListener("click", function () {
    userPaused = !userPaused;
    pauseBtn.setAttribute("aria-pressed", userPaused ? "true" : "false");
    pauseBtn.setAttribute("aria-label", userPaused ? "Reanudar el carrusel" : "Pausar el carrusel");
    pauseBtn.querySelector("span").textContent = userPaused ? "Reanudar" : "Pausar";
    schedule();
  });
  if (userPaused && pauseBtn) {
    pauseBtn.setAttribute("aria-pressed", "true");
    pauseBtn.setAttribute("aria-label", "Reanudar el carrusel");
    pauseBtn.querySelector("span").textContent = "Reanudar";
  }

  /* pausas naturales */
  var stage = reel.querySelector(".reel-stage");
  if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
    stage.addEventListener("mouseenter", function () { hoverPaused = true; schedule(); });
    stage.addEventListener("mouseleave", function () { hoverPaused = false; schedule(); });
  }
  reel.addEventListener("focusin", function () { hoverPaused = true; schedule(); });
  reel.addEventListener("focusout", function () { hoverPaused = false; schedule(); });
  document.addEventListener("visibilitychange", function () { hidden = document.hidden; schedule(); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { offscreen = !es[0].isIntersecting; schedule(); }, { threshold: 0.25 }).observe(reel);
  }

  /* deslizar con el dedo */
  var x0 = null, y0 = 0;
  stage.addEventListener("pointerdown", function (e) { if (e.pointerType === "mouse") return; x0 = e.clientX; y0 = e.clientY; hoverPaused = true; schedule(); }, { passive: true });
  stage.addEventListener("pointerup", function (e) {
    if (x0 == null) return;
    var dx = e.clientX - x0, dy = e.clientY - y0; x0 = null; hoverPaused = false;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) jump(idx + (dx < 0 ? 1 : -1)); else schedule();
  }, { passive: true });
  stage.addEventListener("pointercancel", function () { x0 = null; hoverPaused = false; schedule(); }, { passive: true });
  reel.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { jump(idx + 1); } else if (e.key === "ArrowLeft") { jump(idx - 1); }
  });

  go(0); schedule();
})();
