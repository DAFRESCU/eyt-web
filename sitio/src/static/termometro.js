/* Espinoza T Personas — Termómetro de Riesgo Laboral (12 preguntas) */
(function () {
  var form = document.getElementById("termo-form");
  if (!form) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var wa = function (t) { return (window.ET && ET.wa) ? ET.wa(t) : "https://wa.me/51974770954?text=" + encodeURIComponent(t); };
  var go = function (el, off) { if (window.ET && ET.scrollTo) ET.scrollTo(el, off); else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); };

  var groups = form.querySelectorAll(".seg[data-q]");
  var TOTAL = groups.length;
  var opts = [["Sí", "0"], ["No", "1"], ["No sé", "1"]];
  groups.forEach(function (g) {
    var name = g.getAttribute("data-q");
    opts.forEach(function (o, j) {
      var id = name + "-" + j;
      var inp = document.createElement("input");
      inp.type = "radio"; inp.name = name; inp.id = id; inp.value = o[1];
      var lab = document.createElement("label");
      lab.htmlFor = id; lab.textContent = o[0];
      g.appendChild(inp); g.appendChild(lab);
    });
  });

  var pbar = document.getElementById("pbar");
  var plabel = document.getElementById("plabel");
  var see = document.getElementById("see");
  var hint = document.getElementById("hint");
  var result = document.getElementById("result");
  var answered = function () { return form.querySelectorAll('.seg[data-q] input:checked').length; };
  var START_HINT = "Responde las doce preguntas para ver tu resultado.";

  form.addEventListener("change", function () {
    var n = answered();
    pbar.style.transform = "scaleX(" + (n / TOTAL) + ")";
    plabel.textContent = n + " de " + TOTAL + " respondidas";
    see.disabled = n < TOTAL;
    var left = TOTAL - n;
    hint.textContent = left > 0 ? "Te faltan " + left + (left === 1 ? " pregunta." : " preguntas.") : "Listo. Mira tu resultado.";
  });

  var BLOCKS = ["Orden laboral", "Talento", "Cultura y bienestar"];
  var LINKS = ["/servicios/orden-laboral", "/servicios/capacitacion-y-desarrollo", "/servicios/clima-y-cultura"];
  var level = function (s) { return s === 0 ? "en orden" : (s <= 2 ? "atención" : "prioritario"); };

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (answered() < TOTAL) return;
    var sub = [0, 0, 0];
    for (var q = 1; q <= TOTAL; q++) {
      var v = form.querySelector('input[name="q' + q + '"]:checked');
      sub[Math.floor((q - 1) / 4)] += parseInt(v.value, 10);
    }
    var total = sub[0] + sub[1] + sub[2];
    var lead = 0;
    for (var b = 1; b < 3; b++) if (sub[b] > sub[lead]) lead = b;
    var where = BLOCKS[lead].toLowerCase();
    var verdict, advice;
    if (total === 0) {
      verdict = "Todo en orden";
      advice = "Respondiste sí a las doce. Aquí el trabajo es sostener lo que funciona y medirlo cada año para que siga así.";
    } else if (total <= 2) {
      verdict = "Gestión ordenada";
      advice = "Tu empresa tiene lo básico resuelto. Toca cerrar los pocos vacíos que quedan, empezando por " + where + ".";
    } else if (total <= 6) {
      verdict = "Exposición moderada";
      advice = "Hay vacíos que todavía no te cuestan dinero, pero pueden costarlo este año. Conviene empezar por " + where + ", donde está tu puntaje más alto.";
    } else {
      verdict = "Exposición alta";
      advice = "Conviene intervenir ya en " + where + ". No hace falta atacar todo a la vez: se empieza por ahí y se avanza desde ese punto.";
    }
    document.getElementById("score").innerHTML = total + "<small> de " + TOTAL + "</small>";
    document.getElementById("verdict").textContent = verdict;
    document.getElementById("advice").textContent = advice;
    var more = document.getElementById("result-more");
    if (more) { more.href = LINKS[lead]; more.textContent = "Ver cómo trabajamos " + where; more.hidden = total === 0; }

    var bars = document.getElementById("bars");
    bars.innerHTML = "";
    sub.forEach(function (s, k) {
      var row = document.createElement("div");
      row.className = "bar-row" + (k === lead && total > 0 ? " lead" : "");
      row.innerHTML = "<b>" + BLOCKS[k] + '</b><div class="bar-track"><div class="bar-fill"></div></div><span>' + s + " de 4, " + level(s) + "</span>";
      bars.appendChild(row);
      var fill = row.querySelector(".bar-fill");
      requestAnimationFrame(function () { requestAnimationFrame(function () { fill.style.transform = "scaleX(" + (s / 4) + ")"; }); });
    });

    var size = form.querySelector('input[name="tam"]:checked');
    var msg = "Hola Daniel, hice el Termómetro de Riesgo Laboral en la web.\n" +
      (size ? "Somos " + size.value + " trabajadores.\n" : "") +
      "Resultado: " + total + " de " + TOTAL + " (" + verdict.toLowerCase() + ").\n" +
      "Orden laboral " + sub[0] + "/4, Talento " + sub[1] + "/4, Cultura y bienestar " + sub[2] + "/4.\n" +
      "Me gustaría revisarlo contigo en la reunión de 45 minutos.";
    var btn = document.getElementById("wa-result");
    btn.href = wa(msg); btn.target = "_blank"; btn.rel = "noopener";

    result.hidden = false;
    result.focus({ preventScroll: true });
    go(result, -90);
  });

  document.getElementById("restart").addEventListener("click", function () {
    form.reset();
    result.hidden = true;
    pbar.style.transform = "scaleX(0)";
    plabel.textContent = "0 de " + TOTAL + " respondidas";
    see.disabled = true;
    hint.textContent = START_HINT;
    go(document.getElementById("termometro"), -70);
  });
})();
