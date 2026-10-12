/* Verificación de constancias: lee /certificados.json y busca el código. */
(function () {
  "use strict";
  var form = document.getElementById("cert-form");
  var input = document.getElementById("cert-code");
  var out = document.getElementById("cert-out");
  if (!form || !input || !out) return;
  var data = null;

  function load() {
    if (data) return Promise.resolve(data);
    return fetch("/certificados.json", { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : []; })
      .catch(function () { return []; }).then(function (d) { data = Array.isArray(d) ? d : []; return data; });
  }
  function show(rec, code) {
    out.innerHTML = "";
    var box = document.createElement("div");
    box.className = "cert-card " + (rec ? "ok" : "no");
    var h = document.createElement("h3");
    h.textContent = rec ? "Constancia válida" : "No encontramos ese código";
    box.appendChild(h);
    if (rec) {
      var dl = document.createElement("dl");
      [["Código", rec.codigo], ["Emitida a", rec.nombre], ["Programa", rec.programa], ["Horas", rec.horas], ["Fecha", rec.fecha]].forEach(function (r) {
        if (!r[1]) return;
        var d = document.createElement("div"), dt = document.createElement("dt"), dd = document.createElement("dd");
        dt.textContent = r[0]; dd.textContent = r[1]; d.appendChild(dt); d.appendChild(dd); dl.appendChild(d);
      });
      box.appendChild(dl);
    } else {
      var p = document.createElement("p");
      p.textContent = "Revisa que esté bien escrito (" + code + "). Si el problema sigue, escríbenos a gerencia@espinozat.com.";
      box.appendChild(p);
    }
    out.appendChild(box);
  }
  function check(code) {
    code = (code || "").trim().toUpperCase();
    if (!code) { input.focus(); return; }
    load().then(function (list) {
      var rec = list.filter(function (x) { return String(x.codigo || "").toUpperCase() === code; })[0];
      show(rec, code);
    });
  }
  form.addEventListener("submit", function (e) { e.preventDefault(); check(input.value); });
  var m = location.search.match(/[?&]c=([^&]+)/);
  if (m) { input.value = decodeURIComponent(m[1]); check(input.value); }
})();
