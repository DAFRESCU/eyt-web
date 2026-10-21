/* Calculadora del costo de la rotación — todo en el navegador, nada se envía. */
(function () {
  "use strict";
  var roots = document.querySelectorAll("[data-calc]");
  if (!roots.length) return;
  var fmt = function (n) { return "S/ " + Math.round(n).toLocaleString("es-PE"); };
  var num = function (el, def) { var v = parseFloat(el && el.value); return isFinite(v) && v >= 0 ? v : def; };

  roots.forEach(function (root) {
    var q = function (id) { return root.querySelector("#" + id); };
    var out = { total: q("c-total"), sub: q("c-sub"), bars: q("c-bars"), tips: q("c-tips") };
    var wa = root.querySelector("[data-wa]");

    function calc() {
      var trab = Math.max(1, num(q("c-trab"), 30));
      var sueldo = num(q("c-sueldo"), 1500);
      var ren = num(q("c-ren"), 0);
      if (ren > 0 && window.ET && ET.track) ET.track("herramienta-calculadora", true);
      var dias = num(q("c-dias"), 30);
      var vac = Math.min(100, num(q("c-vac"), 50)) / 100;
      var meses = num(q("c-meses"), 3);
      var curva = Math.min(100, num(q("c-curva"), 50)) / 100;
      var busq = num(q("c-busq"), 25) / 100;

      var parts = [
        { k: "vacante", label: "Puesto vacío", v: (sueldo / 30) * dias * vac },
        { k: "aprendizaje", label: "Meses de aprendizaje del nuevo", v: sueldo * meses * (1 - curva) },
        { k: "reposicion", label: "Búsqueda, selección e inducción", v: sueldo * busq }
      ];
      var porSalida = parts.reduce(function (a, p) { return a + p.v; }, 0);
      var anual = porSalida * ren;
      var tasa = (ren / trab) * 100;
      var sueldos = sueldo > 0 ? anual / sueldo : 0;

      out.total.textContent = fmt(anual);
      out.sub.textContent = ren === 0
        ? "Sin salidas en 12 meses: tu costo de rotación es cero. Vale la pena saber qué estás haciendo bien."
        : fmt(porSalida) + " por cada salida · rotación de " + tasa.toFixed(0) + " % al año · equivale a " + sueldos.toFixed(1) + " sueldos";

      out.bars.innerHTML = "";
      var max = Math.max.apply(null, parts.map(function (p) { return p.v; })) || 1;
      parts.forEach(function (p) {
        var li = document.createElement("li");
        var lab = document.createElement("span"); lab.className = "lab"; lab.textContent = p.label;
        var val = document.createElement("b"); val.textContent = fmt(p.v * ren);
        var bar = document.createElement("i"); bar.style.transform = "scaleX(" + (p.v / max).toFixed(3) + ")";
        li.appendChild(lab); li.appendChild(val); li.appendChild(bar);
        out.bars.appendChild(li);
      });

      var top = parts.slice().sort(function (a, b) { return b.v - a.v; })[0].k;
      var tips = {
        aprendizaje: ["Lo que más pesa es el tiempo que el nuevo tarda en rendir: una inducción de 30-60-90 días lo acorta.",
                      "Revisa cuántas salidas ocurren en los primeros tres meses: si son muchas, el problema empieza el primer día.",
                      "Un supervisor formado acompaña mejor al nuevo y lo retiene más."],
        vacante: ["Lo que más pesa es el puesto vacío: perfiles listos y un banco de candidatos cortan los días de búsqueda.",
                  "Identifica los puestos que más rotan y prepara su reemplazo antes de que alguien renuncie.",
                  "Pregunta en cada salida por qué se va: así atacas la causa y no solo el reemplazo."],
        reposicion: ["Lo que más pesa es reponer a la gente: cada salida evitada es plata que no se gasta.",
                     "Haz entrevistas de salida y suma las causas cada trimestre.",
                     "Mide el clima una vez al año: avisa antes de que la gente se vaya."]
      }[top];
      out.tips.innerHTML = "";
      tips.forEach(function (t) { var li = document.createElement("li"); li.textContent = t; out.tips.appendChild(li); });

      if (wa && window.ET && ET.wa) {
        var msg = "Hola Daniel, hice la calculadora de rotación: " + trab + " trabajadores, " + ren + " salidas en 12 meses, costo estimado de " + fmt(anual) + " al año. Quiero conversar.";
        wa.setAttribute("data-wa", msg);
        wa.href = ET.wa(msg);
      }
    }
    root.addEventListener("input", calc);
    calc();
    window.addEventListener("load", calc);
  });
})();
