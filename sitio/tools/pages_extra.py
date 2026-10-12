# -*- coding: utf-8 -*-
"""Páginas nuevas (oct-2026): calculadora de rotación, modo reunión, tarjeta digital, enlaces,
verificación de constancias, y versiones nuevas de Plan mensual y Cierre 2026."""
import html, io
import pages_content as PC
E = html.escape

# ======================================================================= CALCULADORA (compartida)
def calculadora(B, title="¿Cuánto te cuesta que se vaya un trabajador?", heading="h2", hid="calc-t"):
    return f'''<section class="band" id="calculadora" aria-labelledby="{hid}">
  <div class="wrap">
    <div class="head"><{heading} class="reveal" id="{hid}">{title}</{heading}><p>Pon tus números y mira cuánto se va con cada renuncia. Todo se calcula en tu navegador: no guardamos nada.</p></div>
    <div class="calc" data-calc>
      <form class="form calc-form" novalidate onsubmit="return false">
        <div class="field"><label for="c-trab">Trabajadores en planilla</label><input id="c-trab" type="number" inputmode="numeric" min="1" value="30"></div>
        <div class="field"><label for="c-sueldo">Sueldo mensual promedio (S/)</label><input id="c-sueldo" type="number" inputmode="numeric" min="0" step="50" value="1500"></div>
        <div class="field"><label for="c-ren">Renuncias o salidas en los últimos 12 meses</label><input id="c-ren" type="number" inputmode="numeric" min="0" value="8"></div>
        <div class="field"><label for="c-dias">Días que tardas en cubrir un puesto</label><input id="c-dias" type="number" inputmode="numeric" min="0" value="30"></div>
        <details class="calc-adv full">
          <summary>Ajustar los supuestos</summary>
          <p class="note">Son supuestos de partida, no datos de tu empresa. Cámbialos por los tuyos.</p>
          <div class="form">
            <div class="field"><label for="c-vac">Parte del trabajo que se deja de hacer con el puesto vacío (%)</label><input id="c-vac" type="number" min="0" max="100" value="50"></div>
            <div class="field"><label for="c-meses">Meses que tarda el nuevo en rendir al 100 %</label><input id="c-meses" type="number" min="0" step="0.5" value="3"></div>
            <div class="field"><label for="c-curva">Rendimiento promedio del nuevo mientras aprende (%)</label><input id="c-curva" type="number" min="0" max="100" value="50"></div>
            <div class="field"><label for="c-busq">Búsqueda, selección e inducción (% de un sueldo)</label><input id="c-busq" type="number" min="0" value="25"></div>
          </div>
        </details>
      </form>
      <div class="calc-out" aria-live="polite">
        <p class="calc-label">Lo que te costó la rotación en 12 meses</p>
        <p class="calc-total" id="c-total">S/ 0</p>
        <p class="calc-sub" id="c-sub"></p>
        <ul class="calc-bars" id="c-bars"></ul>
        <div class="calc-tips"><h3>Por dónde empezar</h3><ul class="incl" id="c-tips"></ul></div>
        <div class="hero-actions">{B.wa_btn("Hola Daniel, hice la calculadora de rotación y quiero conversar.", "Revisemos mi resultado")}</div>
        <p class="note">Estimación del costo de reemplazo y de productividad. No incluye liquidaciones ni beneficios sociales. Es una referencia, no un informe.</p>
      </div>
    </div>
  </div>
</section>'''

def p_calculadora(B):
    hero = B.page_hero([("Calculadora de rotación", None)], "Herramienta gratuita",
        "Cada renuncia tiene un precio. Míralo en soles.",
        "Puesto vacío, búsqueda, inducción y meses de aprendizaje. Cuatro datos de tu empresa y ves cuánto te cuesta la rotación al año, y por dónde conviene empezar a bajarla.",
        '<a class="btn btn-wine" href="#calculadora">Calcular ahora</a><a class="textlink" href="/termometro">Prefiero el Termómetro</a>')
    faq = [("¿De dónde salen los supuestos?", "Son puntos de partida razonables para una pyme: medio puesto sin cubrir mientras está vacío, tres meses para que el nuevo rinda y un cuarto de sueldo en búsqueda e inducción. Puedes cambiarlos todos por los datos reales de tu empresa."),
           ("¿Mis números se guardan?", "No. El cálculo ocurre en tu navegador y no se envía a ningún servidor. Solo si tú decides, nos mandas el resultado por WhatsApp."),
           ("¿Qué hago si el número es alto?", "Primero, saber por qué se va la gente: entrevistas de salida y una mirada al primer trimestre de cada ingreso. Eso lo vemos en la reunión de 45 minutos sin costo.")]
    body = hero + calculadora(B) + PC.sec("siguiente", "Y después, ¿qué?", PC.modules([
        ("Ves tu número", "El costo anual estimado y qué parte pesa más."),
        ("Entiendes la causa", "Entrevistas de salida y revisión de los primeros 90 días de cada ingreso."),
        ("Atacas la parte que más pesa", "Inducción, supervisores o selección, según tu caso."),
        ("Mides de nuevo", "En seis meses vuelves a calcular con tus datos reales."),
        ("Tú decides", "Si conversamos, te decimos con honestidad si podemos ayudarte.")]), paper=True) + B.faq_block(faq) + B.cta_band()
    return B.page("/calculadora-rotacion", "Calculadora del costo de la rotación de personal",
                  "Calcula gratis cuánto le cuesta a tu empresa cada renuncia: puesto vacío, búsqueda, inducción y curva de aprendizaje. En soles y en tu navegador, sin registro.",
                  body, [B.crumbs_ld([("Inicio", "/"), ("Calculadora de rotación", "/calculadora-rotacion")]), B.faq_ld(faq),
                         {"@type": "WebApplication", "name": "Calculadora del costo de la rotación", "applicationCategory": "BusinessApplication", "operatingSystem": "Web",
                          "offers": {"@type": "Offer", "price": "0", "priceCurrency": "PEN"}, "provider": {"@id": B.SITE + "/#empresa"}, "url": B.SITE + "/calculadora-rotacion"}],
                  scripts=("/static/calculadora.js",))

# ======================================================================= MODO REUNIÓN
def p_reunion(B):
    tabs = '''<nav class="meet-tabs" aria-label="Pasos de la reunión"><a href="#m1">1 · Tu empresa</a><a href="#termometro">2 · Termómetro</a><a href="#calculadora">3 · Rotación</a><a href="#m4">4 · Siguiente paso</a></nav>'''
    notes = f'''<section class="band" id="m1" aria-labelledby="m1-t">
  <div class="wrap">
    <div class="head"><h2 id="m1-t">Lo que veo en tu empresa.</h2><p>Lo anotamos juntos. Queda solo en esta pantalla.</p></div>
    <div class="form meet-notes">
      <div class="field"><label for="r-emp">Empresa</label><input id="r-emp" autocomplete="off"></div>
      <div class="field"><label for="r-trab">Trabajadores</label><input id="r-trab" inputmode="numeric" autocomplete="off"></div>
      <div class="field full"><label for="r-dolor">Lo que más preocupa hoy</label><textarea id="r-dolor"></textarea></div>
      <div class="field full"><label for="r-meta">Cómo se vería resuelto en seis meses</label><textarea id="r-meta"></textarea></div>
    </div>
  </div>
</section>'''
    nxt = f'''<section class="band band-paper" id="m4" aria-labelledby="m4-t">
  <div class="wrap">
    <div class="head"><h2 id="m4-t">Cómo seguimos.</h2><p>Cinco pasos, siempre los mismos. Los dos primeros no tienen costo.</p></div>
    {B.steps_mini()}
    <div class="hero-actions" style="margin-top:1.5rem">{B.wa_btn("Hola Daniel, gracias por la reunión. Quedo atento a la propuesta.", "Recibir la propuesta hoy")}</div>
  </div>
</section>'''
    hero = '''<section class="page-hero meet-hero"><div class="wrap"><p class="kicker">Reunión de diagnóstico · 45 minutos</p><h1>Veamos tu empresa juntos.</h1><p class="lede">Cuatro pasos: lo que te preocupa, tu Termómetro, el costo de tu rotación y el siguiente paso.</p>''' + tabs + "</div></section>"
    body = hero + notes + PC.termometro(B, title="Termómetro de Riesgo Laboral") + calculadora(B, title="El costo de tu rotación", hid="calc-r") + nxt
    return B.page("/reunion", "Reunión de diagnóstico", "Herramienta de la reunión de diagnóstico de Espinoza T Personas.", body,
                  scripts=("/static/termometro.js", "/static/calculadora.js"), robots="noindex")

# ======================================================================= TARJETA DIGITAL
def qr_svg(url):
    import qrcode, qrcode.image.svg
    img = qrcode.make(url, image_factory=qrcode.image.svg.SvgPathImage, box_size=10, border=1)
    buf = io.BytesIO(); img.save(buf)
    svg = buf.getvalue().decode("utf-8")
    svg = svg[svg.find("<svg"):]
    return svg.replace("<svg ", '<svg role="img" aria-label="Código QR de la tarjeta de Daniel Espinoza" ', 1)

VCARD = "\r\n".join([
    "BEGIN:VCARD", "VERSION:3.0", "N:Espinoza Cuadra;Daniel Franco;;;", "FN:Daniel Espinoza", "ORG:Espinoza T Personas",
    "TITLE:Gerente General", "TEL;TYPE=CELL,VOICE:+51974770954", "EMAIL;TYPE=WORK:gerencia@espinozat.com",
    "URL:https://espinozat.com", "ADR;TYPE=WORK:;;;Arequipa;Arequipa;;Perú",
    "NOTE:Capacitación, desarrollo, cultura y clima laboral. Piensa en personas.", "END:VCARD", ""])

def p_daniel(B):
    body = f'''<section class="band vcard-band">
  <div class="wrap">
    <div class="vcard">
      <div class="vcard-mono" aria-hidden="true">DE</div>
      <h1>Daniel Espinoza</h1>
      <p class="vcard-role">Gerente General · Espinoza T Personas</p>
      <p class="vcard-tag">Capacitación, desarrollo, cultura y clima laboral. Piensa en personas.</p>
      <div class="vcard-actions">
        <a class="btn btn-wine" href="/daniel.vcf" download>Guardar contacto</a>
        {B.wa_btn("Hola Daniel, te escribo desde tu tarjeta digital.", "WhatsApp", "btn btn-outline")}
        <a class="btn btn-outline" href="tel:+51974770954">Llamar</a>
        <a class="btn btn-outline" href="mailto:gerencia@espinozat.com">Correo</a>
      </div>
      <div class="vcard-qr">{qr_svg(B.SITE + "/daniel")}<p>Escanea para guardar esta tarjeta</p></div>
      <ul class="vcard-links"><li><a href="/termometro">Termómetro de riesgo laboral gratis</a></li><li><a href="/calculadora-rotacion">Calculadora del costo de la rotación</a></li><li><a href="/">espinozat.com</a></li></ul>
    </div>
  </div>
</section>'''
    return B.page("/daniel", "Daniel Espinoza, Gerente General", "Tarjeta digital de Daniel Espinoza, Gerente General de Espinoza T Personas. Guarda el contacto, escribe por WhatsApp o agenda una reunión.",
                  body, [B.crumbs_ld([("Inicio", "/"), ("Daniel Espinoza", "/daniel")])])

# ======================================================================= ENLACES
def p_links(B):
    items = [("/cierre-2026", "Cierre de año 2026", "Capacitación e integración en una sola visita"),
             ("/termometro", "Termómetro de riesgo laboral", "Gratis, 3 minutos"),
             ("/calculadora-rotacion", "¿Cuánto te cuesta la rotación?", "Calculadora gratis en soles"),
             ("/programas/supervisores", "Programa de supervisores", "De buen técnico a buen jefe"),
             ("/plan-mensual", "Plan mensual", "Tu gerente de personas a tiempo parcial"),
             ("/nosotros", "Quiénes somos", "Daniel Espinoza y el método")]
    links = "".join(f'<a class="link-row" href="{h}"><b>{t}</b><span>{d}</span></a>' for h, t, d in items)
    body = f'''<section class="band links-band">
  <div class="wrap">
    <div class="links">
      <p class="kicker">Espinoza T Personas</p>
      <h1>Piensa en personas.</h1>
      {B.wa_btn("Hola Daniel, te encontré en redes y quiero conversar sobre mi empresa.", "Escríbenos por WhatsApp", "btn btn-wine link-cta")}
      {links}
    </div>
  </div>
</section>'''
    return B.page("/links", "Enlaces", "Enlaces de Espinoza T Personas: Termómetro, calculadora de rotación, cierre de año y contacto.", body, robots="noindex")

# ======================================================================= VERIFICAR CONSTANCIA
def p_certificado(B):
    hero = B.page_hero([("Verificar constancia", None)], "Constancias verificables",
        "Verifica una constancia de Espinoza T Personas.",
        "Cada constancia que emitimos tiene un código único. Escríbelo aquí para confirmar que es auténtica, a quién se emitió y por qué programa.")
    form = '''<section class="band" aria-labelledby="ver-t">
  <div class="wrap">
    <h2 class="section-title" id="ver-t">Ingresa el código.</h2>
    <form class="form cert-form" id="cert-form" novalidate>
      <div class="field"><label for="cert-code">Código de la constancia</label><input id="cert-code" name="c" autocomplete="off" placeholder="Ej.: ET-2026-0001" required></div>
      <div class="form-actions"><button class="btn btn-wine" type="submit">Verificar</button></div>
    </form>
    <div class="cert-out" id="cert-out" role="status" aria-live="polite"></div>
  </div>
</section>'''
    return B.page("/certificado", "Verificar una constancia", "Verifica la autenticidad de una constancia de participación emitida por Espinoza T Personas con su código único.",
                  hero + form, [B.crumbs_ld([("Inicio", "/"), ("Verificar constancia", "/certificado")])], scripts=("/static/certificado.js",))

# ======================================================================= PLAN MENSUAL (versión membresía)
def p_plan(B):
    tiers = '''<div class="cards3 tiers">
<div class="card"><small>Nivel 1</small><h3>Base</h3><p>Para ordenar lo del día a día.</p><ul class="incl"><li>Consultas del dueño y los jefes antes de decidir sobre un caso</li><li>Inducción de cada ingreso y seguimiento a los 30, 60 y 90 días</li><li>Entrevista de salida de cada persona que se va</li><li>Informe mensual de una página</li></ul></div>
<div class="card card-feature"><small>Nivel 2 · recomendado</small><h3>Plus</h3><p>Para bajar la rotación con datos.</p><ul class="incl"><li>Todo lo del nivel Base</li><li>Informe trimestral de rotación con sus causas</li><li>Medición de clima anual con línea base y plan de mejora</li><li>Plan anual de capacitación</li><li>Políticas, perfiles y formatos cuando hagan falta</li></ul></div>
<div class="card"><small>Nivel 3</small><h3>Dirección</h3><p>Para el dueño que decide mucho y solo.</p><ul class="incl"><li>Todo lo del nivel Plus</li><li>Una sesión mensual de 90 minutos para la decisión de personas más difícil del mes</li><li>Acta con opciones, riesgos y próximos pasos</li><li>Prioridad en tiempos de respuesta</li></ul></div>
</div>'''
    how = PC.modules([("Diagnóstico", "45 minutos sin costo para ver qué necesita tu empresa."),
                      ("Nivel y alcance", "Eliges el nivel y fijamos juntos los topes mensuales."),
                      ("Tarifa fija", "Un monto mensual según el número de trabajadores, por escrito."),
                      ("Informe mensual", "Qué se hizo, qué está pendiente y qué conviene decidir."),
                      ("Revisión trimestral", "Ajustamos el alcance según lo que de verdad se usó.")])
    fit = '''<div class="cards2">
<div class="card"><small>Encaja si</small><h3>Ya necesitas a alguien de RR. HH.</h3><ul class="incl"><li>Tienes entre 20 y 150 trabajadores</li><li>Los temas de personal le quitan tiempo al dueño o al contador</li><li>Contratas y pierdes gente con frecuencia</li><li>Quieres orden sin sumar un sueldo fijo más</li></ul></div>
<div class="card"><small>No encaja si</small><h3>Buscas otra cosa</h3><ul class="excl"><li>Buscas representación legal en un proceso</li><li>Tienes un problema puntual: ahí conviene un proyecto cerrado</li></ul></div>
</div>'''
    faq = [("¿En qué se diferencia de contratar un jefe de RR. HH.?", "Pagas solo el alcance que necesitas, sin un sueldo fijo a tiempo completo, y tienes a alguien que ya trabajó dentro de empresas grandes. Cuando tu empresa crezca lo suficiente, te ayudamos a contratar a tu propio jefe de RR. HH."),
           ("¿Puedo cambiar de nivel?", "Sí, en la revisión trimestral. Subes o bajas según lo que de verdad usaste."),
           ("¿Qué pasa si un mes necesito más de lo pactado?", "El volumen que exceda los topes se cotiza aparte y solo se hace con tu aprobación previa por escrito. Lo que no se usa en un mes no se acumula al siguiente."),
           ("¿Cómo se paga?", "El primer mes se paga por adelantado al firmar, y los siguientes en los primeros días de cada mes."),
           ("¿Es presencial?", "Es mixto: horas presenciales en tu empresa según lo pactado, y el resto por WhatsApp, llamada o videollamada.")]
    return PC.program_page(B, "/plan-mensual", "Plan mensual", "Servicio continuo · Gerente de personas a tiempo parcial",
        "Tu área de personas, sin contratar un área.",
        "Para empresas que ya necesitan a alguien de RR. HH. pero todavía no justifican una persona a tiempo completo. Tres niveles, una tarifa mensual fija, alcance escrito y un informe cada mes.",
        [("Tres niveles", "Base, Plus y Dirección"), ("Tarifa fija", "según tu número de trabajadores"), ("Informe mensual", "para que sepas en qué se usó")],
        [PC.sec("niveles", "Elige tu nivel.", tiers, "Cada nivel suma al anterior. La tarifa se calcula según tu número de trabajadores y queda por escrito.", sid="detalle"),
         PC.sec("como", "Cómo funciona.", how, paper=True),
         PC.sec("fit", "Para quién es.", fit)],
        faq, "Plan mensual: gerente de personas a tiempo parcial en Arequipa",
        "Gerente de personas a tiempo parcial para empresas de Arequipa en tres niveles: consultas, inducción, rotación, clima, capacitación y una sesión mensual de decisiones con el dueño. Tarifa mensual fija.",
        "Hola Daniel, me interesa el plan mensual de gerente de personas a tiempo parcial.", "Quiero mi plan")

# ======================================================================= CIERRE 2026 (tres formatos)
def p_cierre(B):
    packs = '''<div class="cards3 tiers">
<div class="card"><small>2 horas</small><h3>Esencial</h3><p>Una actividad de cierre bien conducida.</p><ul class="incl"><li>Dinámica de reconocimiento entre compañeros</li><li>Cierre del año con el equipo</li><li>Foto y constancia de participación</li></ul></div>
<div class="card card-feature"><small>4 horas · recomendado</small><h3>Recomendado</h3><p>Juego serio con resultado.</p><ul class="incl"><li>Retos por equipos con juego serio</li><li>Mapa de lo que el equipo logró en 2026</li><li>Tres compromisos del equipo para 2027, por escrito</li><li>Resumen de una página para la gerencia</li></ul></div>
<div class="card"><small>6 horas</small><h3>Completo</h3><p>Cierre con datos del equipo.</p><ul class="incl"><li>Todo lo del Recomendado</li><li>Pulso anónimo de cinco preguntas una semana antes</li><li>Devolución de resultados dentro de la jornada</li><li>Informe «Lo que nos llevamos a 2027»</li></ul></div>
</div>'''
    day = PC.modules([("Opcional, mañana", "Capacitación de una hora en prevención del hostigamiento sexual, con registro firmado y constancias."),
                      ("Almuerzo", "Lo organiza la empresa, a su gusto."),
                      ("Tarde", "El formato de cierre que elegiste."),
                      ("Cierre", "Compromisos del equipo para 2027, por escrito."),
                      ("Después", "Informe breve para la gerencia con lo que dejó la jornada.")])
    return PC.program_page(B, "/cierre-2026", "Cierre de año 2026", "Temporada · Noviembre y diciembre",
        "Cierra el año con tu equipo más unido de lo que lo empezaste.",
        "No es un paseo con juegos. Es juego serio con método: cada actividad deja algo, y el equipo sale con tres compromisos para 2027. Si quieres, sumamos la capacitación de hostigamiento el mismo día.",
        [("Tres formatos", "de 2, 4 o 6 horas"), ("Hasta 25 personas", "por grupo"), ("Cupos limitados", "por semana en noviembre y diciembre")],
        [PC.sec("formatos", "Elige el formato.", packs, "La inversión depende del formato y del tamaño del equipo, y queda por escrito en la propuesta, que te enviamos el mismo día.", sid="detalle"),
         PC.sec("dia", "Cómo puede ser el día.", day, paper=True)],
        [("¿Puedo contratar solo la integración?", "Sí. La capacitación de hostigamiento es opcional; juntas te ahorran una segunda visita."),
         ("¿Qué pasa si somos más de 25?", "Armamos un segundo grupo en paralelo o en otro horario, con el mismo formato."),
         ("¿Quién pone el local y la comida?", "La empresa. Nosotros diseñamos y conducimos; si quieres, coordinamos con tus proveedores."),
         ("¿Hasta cuándo hay fechas?", "Mientras queden cupos en noviembre y diciembre. Escríbenos para ver la disponibilidad de tu semana.")],
        "Cierre de año 2026: integración con juego serio en Arequipa",
        "Cierre de año 2026 para empresas de Arequipa: integración con juego serio en formatos de 2, 4 o 6 horas, compromisos del equipo para 2027 y capacitación de hostigamiento opcional el mismo día.",
        "Hola Daniel, me interesa el cierre de año 2026 para mi equipo.", "Ver fechas disponibles")

# ======================================================================= registro
NEW_PAGES = [
    ("/calculadora-rotacion", p_calculadora, True),
    ("/certificado", p_certificado, True),
    ("/daniel", p_daniel, True),
    ("/reunion", p_reunion, False),
    ("/links", p_links, False),
]
OVERRIDES = {"/plan-mensual": p_plan, "/cierre-2026": p_cierre}
for i, (path, fn) in enumerate(PC.PAGES):
    if path in OVERRIDES: PC.PAGES[i] = (path, OVERRIDES[path])
