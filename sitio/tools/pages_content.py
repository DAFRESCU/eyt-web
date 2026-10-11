# -*- coding: utf-8 -*-
"""Contenido de inicio, programas y páginas institucionales. Cada función recibe el módulo build (B) con los helpers."""
import html
E = html.escape

# ======================================================================= TERMÓMETRO (compartido)
QUESTIONS = [
    ("Orden laboral", "Frente de Capital Humano", [
        "¿Todos tus trabajadores están declarados en el T-Registro y tienen contrato firmado vigente?",
        "¿Tu Reglamento Interno de Trabajo está actualizado y entregado a cada trabajador con cargo firmado?",
        "¿Tienes elegido el Comité o Supervisor de SST, con actas, capacitaciones y exámenes médicos documentados?",
        "¿Los files del personal están completos: contratos, boletas, constancias y control de asistencia?"]),
    ("Talento", "Frente de Talento", [
        "¿Cada puesto tiene un perfil escrito con funciones y requisitos que se usa al momento de contratar?",
        "¿El personal nuevo pasa por una inducción formal en sus primeros días?",
        "¿Tus supervisores y jefes han recibido formación en liderazgo o manejo de equipos en el último año?",
        "¿Se evalúa el desempeño del personal al menos una vez al año, con una conversación de resultados?"]),
    ("Cultura y bienestar", "Frente de Cultura y Bienestar", [
        "¿Sabes cuántos trabajadores se fueron el año pasado y por qué razón?",
        "¿Se ha medido el clima laboral o la satisfacción del personal en los últimos doce meses?",
        "¿Hay alguien responsable de gestionar descansos médicos, subsidios EsSalud y casos sociales?",
        "¿Existe un canal formal y conocido para que un trabajador reporte una queja o un caso de hostigamiento?"]),
]
SIZES = ["menos de 20", "20 a 50", "51 a 150", "151 a 500", "más de 500"]

def termometro(B, heading="h2", title="¿Dónde está expuesta tu empresa?", intro=None):
    intro = intro or "Doce preguntas de sí o no, tres minutos. Cada “No” o “No sé” es un punto de exposición legal, económica o de rotación. Al final sabrás por cuál frente conviene empezar."
    n = 0; blocks = []
    for b, (legend, note, qs) in enumerate(QUESTIONS):
        rows = []
        for q in qs:
            n += 1
            rows.append(f'<div class="q"><p class="q-text" id="q{n}"><i>{n}</i>{E(q)}</p><div class="seg" role="radiogroup" aria-labelledby="q{n}" data-q="q{n}"></div></div>')
        blocks.append(f'<fieldset class="block" data-block="{b}"><legend>{legend}</legend><p class="block-note">{note}</p>{"".join(rows)}</fieldset>')
    sizes = "".join(f'<input type="radio" name="tam" id="tam-{i}" value="{s}"><label for="tam-{i}">{s[0].upper() + s[1:]}</label>' for i, s in enumerate(SIZES))
    return f'''<section class="band band-navy" id="termometro" aria-labelledby="termo-title">
  <div class="wrap termo">
    <div class="termo-side">
      <p class="kicker kicker-light">Gratis · 3 minutos</p>
      <{heading} id="termo-title">{title}</{heading}>
      <p>{intro}</p>
      <div class="progress" aria-hidden="true">
        <div class="progress-track"><div class="progress-bar" id="pbar"></div></div>
        <p class="progress-label" id="plabel">0 de 12 respondidas</p>
      </div>
      <p class="privacy-note">Tus respuestas no se guardan ni se envían a ningún lado: el cálculo ocurre en tu teléfono o computadora. Solo si tú decides, nos mandas el resultado por WhatsApp.</p>
    </div>
    <form id="termo-form" novalidate>
      <fieldset class="size-q"><legend>¿Cuántos trabajadores tiene tu empresa? <span>Opcional</span></legend><div class="seg seg-size">{sizes}</div></fieldset>
      {"".join(blocks)}
      <div class="termo-actions">
        <button class="btn btn-light" type="submit" id="see" disabled>Ver mi resultado</button>
        <p class="hint" id="hint" aria-live="polite">Responde las doce preguntas para ver tu resultado.</p>
      </div>
      <div class="result" id="result" hidden tabindex="-1" aria-live="polite">
        <div class="result-top"><p class="score" id="score">0<small> de 12</small></p><p class="verdict" id="verdict"></p></div>
        <p id="advice"></p>
        <div class="bars" id="bars"></div>
        <div class="result-actions">
          <a class="btn btn-wine" id="wa-result" href="https://wa.me/{B.WA_NUM}">{B.WA_SVG}Revisar mi resultado por WhatsApp</a>
          <a class="textlink" id="result-more" href="/servicios/orden-laboral" hidden>Ver cómo trabajamos este frente</a>
          <button class="linkbtn" type="button" id="restart">Responder de nuevo</button>
        </div>
      </div>
    </form>
  </div>
</section>'''

# ======================================================================= INICIO
REEL = [  # (archivo, rubro, palabra tachada)
    ("02-construccion", "Construcción", "plazos"),
    ("06-hoteleria", "Hotelería", "ocupación"),
    ("10-legal", "Legal", "expedientes"),
    ("04-contact-center", "Contact center", "llamadas"),
    ("07-servicios", "Servicios generales", "turnos"),
    ("05-salud", "Salud", "atenciones"),
    ("08-agroindustria", "Agroindustria", "toneladas"),
    ("09-quimica", "Industria química", "producción"),
    ("03-rrhh", "Recursos Humanos", "planilla"),
    ("01-administracion", "Administración", "rubros"),
]
CAPS = [
    ("U1 · Diseño organizacional", "Estructuras claras que ordenan la operación y sostienen el crecimiento."),
    ("U2 · Atracción de talento", "Talento que llega al puesto correcto y decide quedarse."),
    ("U2 · Integración", "Equipos productivos y comprometidos desde la primera semana."),
    ("U3 · Desarrollo", "Competencias que se convierten en resultados medibles."),
    ("U5 · Cultura y clima", "Un clima que retiene, compromete y se nota en los números."),
    ("U4 · Bienestar", "Bienestar que reduce el ausentismo y la rotación."),
    ("U6 · Cumplimiento laboral", "Una gestión laboral en regla, sin sobresaltos ante SUNAFIL."),
    ("U3 · Liderazgo", "Líderes que multiplican el desempeño de su gente."),
]
HOME_FAQ = [
    ("¿Con qué tamaño de empresa trabajan?", "Sobre todo con empresas de Arequipa de 20 a 500 trabajadores que no tienen un área de recursos humanos o la tienen pequeña. También trabajamos con corporaciones por proyecto o programa."),
    ("¿El diagnóstico de 45 minutos tiene algún costo?", "No. Es una reunión sin costo y sin compromiso: aplicamos el Termómetro de Riesgo Laboral y al terminar sabes cuáles son tus dos o tres prioridades reales."),
    ("¿Cuánto cuesta trabajar con ustedes?", "Depende del número de trabajadores y del alcance. La inversión se calcula según el número de trabajadores y siempre queda por escrito en la propuesta, antes de que firmes nada."),
    ("¿Trabajan fuera de Arequipa?", "Sí. Nuestra sede es Arequipa; Cusco e Ica van por proyecto, y el resto del Perú en remoto o híbrido."),
    ("¿Entregan constancias de capacitación?", "Sí. Cada participante recibe una constancia con las horas cronológicas, y la empresa se queda con la lista de asistencia firmada y el informe de cierre."),
    ("¿Son un estudio de abogados?", "No. Somos consultores de gestión de personas. Ordenamos tu gestión laboral de forma preventiva y podemos acompañarte en una inspección, pero no damos representación legal ni patrocinio."),
    ("¿Quién hace el trabajo?", "Daniel Espinoza conduce cada proyecto. Cuando un servicio necesita a otro especialista, como en bienestar o casos sociales, lo ejecuta nuestra red de especialistas asociados con la misma coordinación."),
    ("¿Qué pasa después de la entrega?", "A los 30 días hacemos una reunión de verificación sin costo para revisar que lo entregado se esté usando. Si algo no se implementó, también lo reportamos."),
]

def split_claim(text):
    out, i = [], 0
    for w in text.split(" "):
        chs = []
        for c in w:
            chs.append('<span class="split-ch" style="--i:%d">%s</span>' % (i, E(c))); i += 1
        out.append('<span class="split-line">%s</span>' % "".join(chs))
    return " ".join(out)

def home(B):
    imgs = []
    for k, (f, rubro, word) in enumerate(REEL):
        if k == 0:
            imgs.append(f'<picture><source media="(max-width:760px) and (orientation:portrait)" srcset="/personas/m/{f}.webp" width="540" height="960"><img class="reel-img" src="/personas/{f}.webp" alt="" data-word="{word}" width="1600" height="900" decoding="async" fetchpriority="high"></picture>')
        else:
            imgs.append(f'<picture><source media="(max-width:760px) and (orientation:portrait)" data-srcset="/personas/m/{f}.webp" width="540" height="960"><img class="reel-img" data-src="/personas/{f}.webp" alt="" data-word="{word}" width="1600" height="900" decoding="async"></picture>')
    caps = "".join(f'<div class="reel-layer reel-cap" aria-hidden="true"><p class="k">{k}</p><p class="say">{s}</p></div>' for k, s in CAPS)
    chips = "".join(f'<span class="chip"><span>{r}</span></span>' for _, r, _ in REEL[:-1])
    cycle = "".join(f"<li>{x}</li>" for x in ["Diseño", "Atracción", "Integración", "Desarrollo", "Cultura", "Bienestar", "Cumplimiento", "Liderazgo"])
    WA_HELLO = "Hola Daniel, vi la web de Espinoza T Personas y quiero agendar el diagnóstico de 45 minutos sin costo."
    reel = f'''<section class="reel" id="inicio" aria-label="Personas que trabajan en distintos rubros">
  <div class="reel-stage">
    <div class="reel-media" aria-hidden="true">{"".join(imgs)}</div>
    <div class="reel-shade" aria-hidden="true"></div>
    <a class="reel-skip" href="#despues">Saltar recorrido</a>
    <div class="reel-ui">
      <div class="wrap">
        <div class="hero reel-copy">
          <h1 id="claim">
            <span class="claim-no" aria-hidden="true">No pienses solo en <br class="br-m"><span class="struck"><span class="w">plazos</span></span>.</span>
            <span class="claim-yes"><span class="sr">Piensa en personas.</span><span aria-hidden="true">{split_claim("Piensa en personas.")}</span></span>
          </h1>
          <div class="reel-layers">
            <div class="reel-layer reel-intro on">
              <p class="k">Tu aliado en todo el ciclo de vida del colaborador</p>
              <p class="hero-lede">Capacitación, desarrollo, cultura y clima para empresas de Arequipa, desde 20 trabajadores hasta corporaciones.</p>
              <div class="hero-actions">
                {B.wa_btn(WA_HELLO, "Agenda tu diagnóstico de 45 minutos sin costo")}
                <a class="textlink" href="#termometro">Mide tu riesgo laboral en 3 minutos</a>
              </div>
            </div>
            {caps}
            <div class="reel-layer reel-cap reel-end" aria-hidden="true"><p class="k">Espinoza T Personas</p><p class="say">En cualquier rubro, detrás de cada puesto hay personas. Te acompañamos en todo su ciclo, desde que llegan hasta que crecen contigo.</p><a class="btn btn-wine" data-wa="{E(WA_HELLO)}" href="https://wa.me/{B.WA_NUM}" tabindex="-1">Conversemos por WhatsApp</a></div>
          </div>
        </div>
      </div>
      <div class="wrap reel-foot" aria-hidden="true">
        <ol class="reel-cycle">{cycle}</ol>
        <div class="reel-rubros">{chips}</div>
      </div>
      <p class="reel-hint" aria-hidden="true">Desliza</p>
    </div>
  </div>
</section>'''

    proof = '''<section class="proof" id="despues" aria-label="Trayectoria">
  <div class="wrap">
    <div class="hero-meta">
      <p><strong>+5 años</strong>gestionando personas desde dentro de empresas grandes de Arequipa y del sur.</p>
      <p><strong>+18 000 colaboradores</strong>en las empresas de agroindustria, industria, retail, sector financiero y salud donde ha trabajado Daniel.</p>
      <p><strong>74% → 93%</strong>de satisfacción laboral en una agroexportadora de más de 15 000 trabajadores, con los programas que él diseñó y condujo.</p>
    </div>
  </div>
</section>'''

    voices = '''<section class="band band-paper" aria-labelledby="voces">
  <div class="wrap">
    <div class="head">
      <h2 class="reveal" id="voces">Lo escuchamos en casi todas las empresas de la región.</h2>
      <p>En muchas empresas de Arequipa nadie se dedica a la gente: el personal lo lleva el dueño o el contador, entre factura y factura.</p>
    </div>
    <div class="voices">
      <figure class="voice"><blockquote>“Ascendí al mejor técnico a supervisor. Ahora dirige a ocho personas y nadie le enseñó cómo.”</blockquote><p>Dirigir gente y hacer bien el trabajo son <b>dos oficios distintos</b>. El segundo se enseña.</p></figure>
      <figure class="voice"><blockquote>“Contratamos por urgencia, no por perfil. Y al que se queda, nadie lo forma.”</blockquote><p>Cada salida cuesta meses de sueldo en búsqueda, curva de aprendizaje y <b>trabajo que se queda sin hacer</b>.</p></figure>
      <figure class="voice"><blockquote>“La gente cumple, pero no está. Y cuando aparece un problema, nadie sabe qué hacer.”</blockquote><p>El clima se mide con una encuesta que la gente conteste con confianza, y después <b>se actúa</b>.</p></figure>
    </div>
  </div>
</section>'''

    doors = f'''<section class="band" id="programas" aria-labelledby="puertas">
  <div class="wrap">
    <div class="head">
      <h2 class="reveal" id="puertas">Para empezar, algo concreto.</h2>
      <p>Para conocernos basta un primer trabajo corto. Cada una de estas entradas resuelve un problema puntual, tiene duración y entregables claros, y deja a tu equipo mejor de lo que lo encontramos.</p>
    </div>
    <div class="doors">
      <article class="door">
        <header class="door-head"><h3>Prevención del hostigamiento sexual laboral</h3><p class="when">La capacitación que pide la norma, con todo documentado.</p></header>
        <div class="door-body">
          <p>La Ley 27942 y su reglamento piden capacitar a cada trabajador al ingresar, capacitar cada año al área de personas y al comité o delegado, y difundir información de forma periódica. Lo armamos para que cumplas y quede probado.</p>
          <ul class="incl"><li>Qué es hostigamiento, cómo se reconoce y cómo se previene</li><li>El canal de denuncia y qué hace la empresa cuando llega un caso</li><li>Casos prácticos adaptados a tu rubro</li></ul>
        </div>
        <div class="specs"><dl><div><dt>Duración</dt><dd>2 horas por sesión</dd></div><div><dt>Grupo</dt><dd>Hasta 25 personas</dd></div><div><dt>Te llevas</dt><dd>Registro firmado y constancia por participante</dd></div></dl>
          <a class="btn btn-wine btn-small" href="/programas/hostigamiento">Ver el programa</a></div>
      </article>
      <article class="door">
        <header class="door-head"><h3>Programa de supervisores</h3><p class="when">De buen técnico a buen jefe.</p></header>
        <div class="door-body">
          <p>Para quienes dirigen gente sin que nadie les haya enseñado cómo. Sesiones prácticas con casos de su propia operación, en grupo cerrado para tu empresa o en cohortes abiertas.</p>
          <ul class="incl"><li>El cambio de rol: de hacer a lograr que otros hagan</li><li>Instrucciones claras, seguimiento y corrección sin gritar</li><li>Conflictos en el equipo y entre turnos</li></ul>
        </div>
        <div class="specs"><dl><div><dt>Formato</dt><dd>Sesiones de 3 horas</dd></div><div><dt>Grupo</dt><dd>Hasta 20 personas</dd></div><div><dt>Te llevas</dt><dd>Plan de acción por participante y constancia con horas</dd></div></dl>
          <a class="btn btn-wine btn-small" href="/programas/supervisores">Ver el programa</a></div>
      </article>
      <article class="door">
        <header class="door-head"><h3>Taller de tres horas</h3><p class="when">Un solo problema, bien trabajado.</p></header>
        <div class="door-body">
          <p>Para resolver algo puntual sin comprometerte a un programa largo. Se trabaja con situaciones reales de tu operación.</p>
          <ul class="incl"><li>Supervisores que corrigen sin gritar</li><li>Conflictos entre áreas o entre turnos</li><li>Comunicación entre jefes y equipo</li><li>Trato al cliente y servicio</li></ul>
        </div>
        <div class="specs"><dl><div><dt>Duración</dt><dd>3 horas</dd></div><div><dt>Grupo</dt><dd>Hasta 20 personas</dd></div><div><dt>Te llevas</dt><dd>Material por participante y evaluación de cierre</dd></div></dl>
          <a class="btn btn-wine btn-small" href="/programas/taller-3-horas">Ver los temas</a></div>
      </article>
    </div>
    <div class="combo">
      <p><strong>Cierra el año en una sola visita.</strong>La capacitación en prevención del hostigamiento por la mañana y la integración del equipo por la tarde. Cumples y celebras el mismo día.</p>
      <a class="btn btn-light" href="/cierre-2026">Ver cómo funciona</a>
    </div>
  </div>
</section>'''

    plan = f'''<section class="band band-paper" aria-labelledby="plan-title">
  <div class="wrap">
    <div class="plan">
      <div>
        <p class="kicker">Plan mensual</p>
        <h2 id="plan-title">Tu gerente de personas, a tiempo parcial.</h2>
        <p>Para empresas que ya necesitan a alguien de RR. HH. pero todavía no justifican una persona a tiempo completo. Una tarifa mensual fija, un alcance escrito y un informe cada mes.</p>
        <div class="hero-actions"><a class="btn btn-wine" href="/plan-mensual">Ver qué incluye</a></div>
      </div>
      <ul>
        <li>Consultas del dueño y de los jefes sobre casos de personal</li>
        <li>Inducción de cada ingreso y seguimiento del período de prueba</li>
        <li>Entrevistas de salida e informe trimestral de rotación</li>
        <li>Políticas y documentos a medida que hagan falta</li>
        <li>Clima anual y plan de capacitación del año</li>
      </ul>
    </div>
  </div>
</section>'''

    fronts = "".join(B.card(B.svc_url(s), B.SERVICES[s]["unit"] + " · " + B.SERVICES[s]["front"], B.SERVICES[s]["nav"], B.SERVICES[s]["nav_desc"], "Ver servicios") for s in B.ORDER)
    services = f'''<section class="band" id="servicios" aria-labelledby="frentes">
  <div class="wrap">
    <div class="head">
      <h2 class="reveal" id="frentes">Y cuando hay confianza, el trabajo de fondo.</h2>
      <p>Siete unidades de servicio en tres frentes, para todo el ciclo de vida del colaborador. Cada página dice qué incluye cada servicio, qué no, qué te entregamos y en cuánto tiempo.</p>
    </div>
    <div class="fronts-grid">{fronts}</div>
    <p class="u7-line">¿Eres una municipalidad o un gobierno regional? Tenemos el <b>Programa de Liderazgo Público (U7)</b> para equipos directivos. <a href="/contacto">Escríbenos</a>.</p>
  </div>
</section>'''

    method = '''<section class="band band-paper" id="metodo" aria-labelledby="metodo-title">
  <div class="wrap">
    <div class="head"><h2 class="reveal" id="metodo-title">Cómo trabajamos.</h2><p>Cinco pasos, siempre los mismos. Sabes qué vas a recibir antes de pagar un sol.</p></div>
    <div class="steps-line" aria-hidden="true"><span></span></div>
    <ol class="steps">
      <li class="step"><h3>Diagnóstico</h3><p>45 minutos sin costo. Aplicamos el Termómetro y ubicamos las prioridades reales.</p></li>
      <li class="step"><h3>Propuesta escrita</h3><p>Alcance, lo que queda fuera, plazos e inversión. Vigente por 15 días.</p></li>
      <li class="step paid"><h3>Ejecución</h3><p>Empieza con la firma del acuerdo. En tu local, en remoto o híbrido.</p></li>
      <li class="step paid"><h3>Entrega</h3><p>Documentos en editable y un equipo interno capacitado para sostenerlo.</p></li>
      <li class="step paid"><h3>Verificación</h3><p>A los 30 días revisamos que lo implementado siga funcionando.</p></li>
    </ol>
    <p class="steps-note">Los dos primeros pasos no tienen costo. La inversión se calcula según el número de trabajadores y el alcance, y siempre queda por escrito en la propuesta.</p>
  </div>
</section>'''

    about = '''<section class="band" id="quien" aria-labelledby="quien-title">
  <div class="wrap">
    <div class="about">
      <div>
        <p class="figure-num" aria-label="De 74 por ciento a 93 por ciento">74%<span class="arrow" aria-hidden="true">→</span>93%</p>
        <p class="figure-cap">Satisfacción laboral que logró Daniel en las sedes de Arequipa y Chincha de una agroexportadora de más de 15 000 trabajadores, con los programas que diseñó y condujo durante dos años.</p>
      </div>
      <div class="about-body">
        <h2 class="reveal" id="quien-title">Daniel Franco Espinoza Cuadra</h2>
        <p class="role">Gerente General · Psicología (UCSM) · Candidato a Magíster en Gerencia del Talento Humano (UTP)</p>
        <p>Más de cinco años gestionando personas desde dentro de empresas grandes: capacitación de mandos medios, clima laboral, evaluación de desempeño, planes de sucesión e integración de equipos, en operaciones de 800 a más de 15 000 trabajadores.</p>
        <p>Entre sus resultados: plan anual de capacitación con 100% de ejecución en una clínica, el componente de formación en su acreditación internacional y vacantes cubiertas en menos tiempo que el promedio del sector en retail.</p>
        <p>Espinoza T Personas nace en Arequipa para llevar ese mismo rigor a empresas que no tienen un área de recursos humanos y que, igual, necesitan que su gente funcione.</p>
        <p><a class="textlink" href="/nosotros">Conocer la trayectoria completa</a></p>
      </div>
    </div>
  </div>
</section>'''

    close = f'''<section class="band band-navy close" id="contacto" aria-labelledby="close-title">
  <div class="wrap">
    <h2 class="reveal" id="close-title">Conversemos 45 minutos.</h2>
    <p class="close-lede">Cuéntanos qué está pasando con tu equipo. Si no podemos ayudarte, te lo diremos en la primera reunión.</p>
    <div class="close-actions">
      {B.wa_btn("Hola Daniel, quiero agendar el diagnóstico de 45 minutos sin costo.", "Agenda tu diagnóstico sin costo")}
      <a class="textlink" href="/contacto">Prefiero dejar mis datos</a>
    </div>
    <div class="contact-grid">
      <p><b>WhatsApp y teléfono</b><a href="tel:+51974770954">974 770 954</a></p>
      <p><b>Correo</b><a href="mailto:gerencia@espinozat.com">gerencia@espinozat.com</a></p>
      <p><b>Dónde trabajamos</b><span>Sede en Arequipa. Cusco e Ica por proyecto. Todo el Perú en remoto o híbrido.</span></p>
    </div>
  </div>
</section>'''

    body = reel + proof + termometro(B) + voices + doors + plan + services + method + about + B.faq_block(HOME_FAQ, "Lo que más nos preguntan", "faq") + close
    graph = [B.faq_ld(HOME_FAQ), {"@type": "WebSite", "@id": B.SITE + "/#web", "url": B.SITE + "/", "name": "Espinoza T Personas", "inLanguage": "es-PE", "publisher": {"@id": B.SITE + "/#empresa"}}]
    out = B.page("/", "Espinoza T Personas | Capacitación, desarrollo, cultura y clima laboral en Arequipa",
                 "Consultora de gestión de personas en Arequipa: capacitación, desarrollo, cultura y clima laboral para empresas desde 20 trabajadores hasta corporaciones. Diagnóstico de 45 minutos sin costo.",
                 body, graph, scripts=("/vendor/motion.js", "/static/reel.js", "/static/termometro.js"), body_class="home", og_title="Piensa en personas. | Espinoza T Personas")
    pre = ('<link rel="preload" as="image" href="/personas/m/02-construccion.webp" media="(max-width:760px) and (orientation:portrait)" fetchpriority="high">\n'
           '<link rel="preload" as="image" href="/personas/02-construccion.webp" media="not all and (max-width:760px) and (orientation:portrait)" fetchpriority="high">\n')
    return out.replace('<link rel="stylesheet"', pre + '<link rel="stylesheet"', 1)

# ======================================================================= PROGRAMAS
def program_page(B, path, crumb, kicker, h1, lede, facts, sections, faq, title, meta, wa_msg, cta_label="Consultar fechas"):
    hero = B.page_hero([("Programas", None), (crumb, None)], kicker, h1, lede,
                       B.wa_btn(wa_msg, cta_label) + '<a class="textlink" href="#detalle">Ver el detalle</a>', facts)
    hero = hero.replace('<span aria-current="page">Programas</span>', '<span>Programas</span>')
    body = hero + "".join(sections) + B.faq_block(faq) + B.cta_band()
    graph = [B.crumbs_ld([("Inicio", "/"), (crumb, path)]), B.faq_ld(faq),
             {"@type": "Service", "name": crumb, "description": lede, "provider": {"@id": B.SITE + "/#empresa"}, "areaServed": {"@type": "City", "name": "Arequipa"}, "url": B.SITE + path}]
    return B.page(path, title, meta, body, graph)

def sec(hid, title, inner, sub="", paper=False, sid=None):
    s = f' id="{sid}"' if sid else ""
    p = f"<p>{sub}</p>" if sub else ""
    return f'''<section class="band{" band-paper" if paper else ""}"{s} aria-labelledby="{hid}">
  <div class="wrap">
    <div class="head"><h2 class="reveal" id="{hid}">{title}</h2>{p}</div>
    {inner}
  </div>
</section>'''

def modules(items):
    return '<ol class="steps-mini mods">' + "".join(f"<li><b>{t}</b>{d}</li>" for t, d in items) + "</ol>"

def includes_grid(cols):
    return '<div class="cards3 inc-grid">' + "".join(f'<div class="card"><small>{s}</small><h3>{h}</h3><p>{p}</p></div>' for s, h, p in cols) + "</div>"

def p_supervisores(B):
    mods = modules([
        ("Del hacer al lograr que otros hagan", "El cambio de rol: qué deja de hacer un supervisor y qué empieza a hacer."),
        ("Instrucciones claras y seguimiento", "Cómo pedir, cómo verificar y cómo no tener que repetir todo tres veces."),
        ("Corregir sin gritar", "Retroalimentación que mejora la conducta sin romper la relación."),
        ("Conflictos en el equipo", "Entre compañeros, entre turnos y con otras áreas, antes de que escalen."),
        ("Motivar y reconocer", "Lo que sí está en manos del supervisor, aunque no haya presupuesto."),
    ])
    formats = '<div class="cards2">' + B.card("/contacto", "En tu empresa", "Grupo cerrado", "Solo con tus supervisores, con casos de tu operación y en los horarios de tus turnos. Hasta 20 participantes por grupo.", "Pedir propuesta") + \
              B.card("/contacto", "Cohorte abierta", "Supervisores de varias empresas", "Para empresas con pocos supervisores. Se comparte la sala con supervisores de otros rubros, lo que enriquece los casos. Fechas por anunciar.", "Avísame de la próxima") + "</div>"
    inc = includes_grid([("Antes", "Conversación con la gerencia", "Para entender qué está pasando con tus supervisores y ajustar los casos."),
                         ("Durante", "Sesiones prácticas", "Dinámicas, juego serio y situaciones reales de la operación, no teoría de manual."),
                         ("Después", "Plan de acción y constancia", "Cada participante sale con compromisos concretos, constancia con horas e informe de cierre para la gerencia.")])
    return program_page(B, "/programas/supervisores", "Programa de supervisores", "Programa · Formación y Desarrollo (U3)",
        "De buen técnico a buen jefe.",
        "Un programa práctico para supervisores y mandos medios que dirigen gente sin que nadie les haya enseñado cómo. En grupo cerrado para tu empresa o en cohortes abiertas.",
        [("Sesiones de 3 horas", "una por semana, para aplicar entre sesión y sesión"), ("Hasta 20 participantes", "por grupo, para que todos practiquen"), ("Casos de su operación", "cada sesión se ajusta a tu rubro")],
        [sec("mods", "Lo que trabajamos.", mods, "Cinco ejes que se ajustan a lo que encontramos en la conversación previa con la gerencia. La malla final se cierra con cada grupo.", sid="detalle"),
         sec("inc", "Qué incluye.", inc, paper=True),
         sec("form", "Dos formas de tomarlo.", formats)],
        [("¿Para quién es?", "Para supervisores, jefes de turno, encargados y mandos medios, sobre todo los que fueron ascendidos por ser buenos en su trabajo técnico."),
         ("¿Se puede medir si funcionó?", "Sí. Se puede sumar una medición antes y después, con encuesta a sus jefes y a su equipo, para ver el cambio de conducta a los 60 o 90 días."),
         ("¿Se dicta en planta o en turnos de noche?", "Sí. Nos adaptamos a tus turnos y a tu local."),
         ("¿Cuánto cuesta?", "Depende del número de sesiones y de participantes. La inversión queda por escrito en la propuesta.")],
        "Programa de supervisores y mandos medios en Arequipa",
        "Programa práctico de liderazgo para supervisores y mandos medios en Arequipa: cambio de rol, instrucciones, retroalimentación, conflictos y motivación. En tu empresa o en cohortes abiertas.",
        "Hola Daniel, me interesa el programa de supervisores para mi empresa.", "Consultar el programa")

def p_hostigamiento(B):
    obligations = includes_grid([
        ("Al ingresar", "Capacitación a cada trabajador", "Al inicio de la relación laboral, cada trabajador debe recibir una capacitación sobre hostigamiento sexual."),
        ("Cada año", "Capacitación especializada", "Para el área de recursos humanos, el comité o delegado de intervención y quienes investigan los casos. Las MYPE acreditadas en el REMYPE están exceptuadas."),
        ("Siempre", "Difusión periódica", "Información a todo el personal sobre cómo identificar el hostigamiento, cómo denunciarlo y qué sanciones tiene.")])
    inc = '''<div class="cards2"><div><ul class="incl">
<li>Qué es hostigamiento sexual, cómo se reconoce y cómo se previene</li>
<li>El canal de denuncia y qué debe hacer la empresa cuando llega un caso</li>
<li>Plazos y responsabilidades del comité o delegado de intervención</li>
<li>Casos prácticos adaptados a tu rubro</li></ul></div>
<div class="specs"><dl><div><dt>Duración</dt><dd>2 horas por sesión</dd></div><div><dt>Grupo</dt><dd>Hasta 25 personas, presencial o virtual</dd></div><div><dt>Te llevas</dt><dd>Registro de asistencia firmado, constancia por participante y material de difusión</dd></div></dl></div></div>'''
    return program_page(B, "/programas/hostigamiento", "Prevención del hostigamiento sexual", "Programa · Cumplimiento y Cultura",
        "Capacitación en prevención del hostigamiento sexual laboral.",
        "La Ley 27942 y su reglamento piden capacitar y difundir información a tu personal. La dictamos con casos de tu rubro y te dejamos la documentación lista para demostrar que cumpliste.",
        [("2 horas", "por sesión, presencial o virtual"), ("Hasta 25 personas", "por grupo"), ("Todo documentado", "registro firmado y constancias")],
        [sec("obl", "Lo que pide la norma.", obligations, "El reglamento de la Ley 27942 (D. S. 014-2019-MIMP) establece tres momentos. Armamos la capacitación para cubrir el que te falte.", sid="detalle"),
         sec("inc", "Qué incluye cada sesión.", inc, "La conduce Daniel o un especialista de nuestra red de especialistas asociados, con el mismo contenido y la misma documentación.", paper=True)],
        [("¿Aplica aunque seamos una empresa pequeña?", "Las obligaciones de prevención aplican a todo empleador. Lo que cambia según el tamaño es, por ejemplo, si corresponde un comité de intervención (20 o más trabajadores) o un delegado, y si estás exceptuado de la capacitación especializada anual por ser MYPE acreditada."),
         ("¿Puede ser virtual?", "Sí. La documentación es la misma: lista de asistencia y constancia por participante."),
         ("¿Pueden revisar también nuestra política y el canal de denuncia?", "Sí, como un servicio aparte de políticas internas. Lo vemos en la reunión de diagnóstico."),
         ("¿Se puede hacer el mismo día que la integración de fin de año?", "Sí, es justamente la propuesta de cierre de año: capacitación por la mañana e integración por la tarde.")],
        "Capacitación en prevención del hostigamiento sexual laboral en Arequipa",
        "Capacitación en prevención del hostigamiento sexual laboral según la Ley 27942 y su reglamento, con registro firmado y constancia por participante. Presencial en Arequipa o virtual.",
        "Hola Daniel, quiero la capacitación en prevención del hostigamiento sexual laboral para mi empresa.")

def p_taller(B):
    topics = includes_grid([
        ("Liderazgo", "Supervisores que corrigen sin gritar", "Retroalimentación y seguimiento para jefes de primera línea."),
        ("Equipos", "Conflictos entre áreas o turnos", "Acuerdos de trabajo concretos entre quienes no se entienden."),
        ("Comunicación", "Jefes y equipo hablando claro", "Instrucciones, reuniones cortas y escucha."),
        ("Servicio", "Trato al cliente", "Atención, manejo de reclamos y clientes difíciles."),
        ("Ingreso", "Inducción del personal nuevo", "Una sesión de bienvenida y el formato para repetirla."),
        ("A medida", "El tema que te preocupa", "Lo definimos juntos en la reunión de diagnóstico.")])
    return program_page(B, "/programas/taller-3-horas", "Taller de tres horas", "Programa · Formación y Desarrollo (U3)",
        "Un solo problema, bien trabajado, en tres horas.",
        "Para empresas que quieren resolver algo puntual sin comprometerse a un programa largo. Se trabaja con situaciones reales de tu operación y el equipo sale con acuerdos concretos.",
        [("3 horas", "en tu local o virtual"), ("Hasta 20 personas", "por grupo"), ("Te llevas", "material por participante y evaluación de cierre")],
        [sec("temas", "Temas más pedidos.", topics, sid="detalle")],
        [("¿Es suficiente un taller de tres horas?", "Para un problema puntual, sí. Si el tema necesita cambio de hábitos sostenido, te proponemos un programa con varias sesiones."),
         ("¿Entregan constancia?", "Sí, una constancia de participación por persona con las horas cronológicas."),
         ("¿Pueden dictarlo fuera del horario de trabajo?", "Sí, coordinamos según tus turnos."),
         ("¿Cuánto cuesta?", "Depende del tema y del número de grupos. La inversión queda por escrito en la propuesta.")],
        "Taller de capacitación de tres horas para empresas en Arequipa",
        "Talleres prácticos de tres horas para empresas de Arequipa: supervisores, conflictos, comunicación, servicio al cliente e inducción. Con casos de tu operación.",
        "Hola Daniel, quiero un taller de tres horas para mi equipo.", "Elegir un tema")

def p_integracion(B):
    formats = '<ul class="formats formats-lg"><li><b>Express</b><span>2 horas, hasta 25 personas. Un desafío de presentación y una construcción en equipo.</span></li><li><b>Media jornada</b><span>4 horas, hasta 40 personas. Cuatro dinámicas de cohesión y cierre con compromisos.</span></li><li><b>Jornada completa</b><span>6 horas, hasta 50 personas. Todo lo anterior más un mapa de cómo se siente el equipo hoy.</span></li></ul>'
    when = includes_grid([("Cuándo", "Equipos nuevos o fusionados", "Cuando se juntan áreas, turnos o sedes que no se conocen."),
                          ("Cuándo", "Después de un año difícil", "Para cerrar etapas y empezar con acuerdos claros."),
                          ("Cuándo", "Fechas del equipo", "Aniversarios, inicio de temporada o cierre de año.")])
    return program_page(B, "/programas/integracion", "Integración de equipos", "Programa · Cultura y Experiencia (U5)",
        "Integración con método, que deja acuerdos por escrito.",
        "Dinámicas de cohesión conducidas por un facilitador, con un propósito claro. Cada formato termina con una reflexión del equipo y compromisos concretos.",
        [("2 a 6 horas", "según el formato"), ("Hasta 50 personas", "en tu local o donde elijas"), ("Te llevas", "encuesta de satisfacción, certificado y compromisos por escrito")],
        [sec("formatos", "Elige el formato.", formats, sid="detalle"), sec("cuando", "Cuándo conviene.", when, paper=True)],
        [("¿Es un paseo o una actividad recreativa?", "Es una actividad de cohesión con método: cada dinámica tiene un objetivo y el cierre deja compromisos del equipo por escrito. Se puede combinar con un almuerzo o actividad libre que organice la empresa."),
         ("¿Quién pone el local y la comida?", "La empresa. Nosotros diseñamos y conducimos; si quieres, coordinamos con tus proveedores."),
         ("¿En noviembre y diciembre hay cupos?", "Son los meses más pedidos y los cupos por semana son limitados. Conviene reservar con anticipación."),
         ("¿Cuánto cuesta?", "Depende del formato y del número de personas. La inversión queda por escrito en la propuesta.")],
        "Integración y team building con método para empresas en Arequipa",
        "Integraciones de equipo con método en Arequipa: formatos de 2, 4 y 6 horas, hasta 50 personas, con compromisos del equipo por escrito.",
        "Hola Daniel, me interesa una integración para mi equipo.", "Reservar una fecha")

def p_cierre(B):
    day = modules([("Mañana", "Capacitación en prevención del hostigamiento sexual laboral, con registro firmado y constancias."),
                   ("Almuerzo", "Lo organiza la empresa, a su gusto."),
                   ("Tarde", "Integración del equipo en el formato que elijas, de 2 a 4 horas."),
                   ("Cierre", "Compromisos del equipo para el año que viene, por escrito."),
                   ("Después", "Informe breve para la gerencia con lo que dejó la jornada.")])
    return program_page(B, "/cierre-2026", "Cierre de año 2026", "Temporada · Noviembre y diciembre",
        "Cierra el año en una sola visita.",
        "La capacitación en prevención del hostigamiento por la mañana y la integración del equipo por la tarde. Cumples con lo que pide la norma y celebras el año el mismo día.",
        [("Un solo día", "en tu local o en el lugar que elijas"), ("Hasta 50 personas", "en la integración"), ("Cupos limitados", "por semana en noviembre y diciembre")],
        [sec("dia", "Cómo es el día.", day, sid="detalle")],
        [("¿Puedo contratar solo una de las dos partes?", "Sí. Puedes tomar solo la capacitación o solo la integración. Juntas te ahorran una segunda visita y un segundo día de coordinación."),
         ("¿Hasta cuándo hay fechas?", "Mientras queden cupos en noviembre y diciembre. Escríbenos para ver la disponibilidad de tu semana."),
         ("¿Sirve para empresas pequeñas?", "Sí. Para grupos pequeños se usan los formatos cortos.")],
        "Cierre de año 2026: capacitación e integración en una sola visita",
        "Capacitación en prevención del hostigamiento sexual laboral e integración de equipo en un solo día, en noviembre y diciembre de 2026, en Arequipa.",
        "Hola Daniel, me interesa cerrar el año con la capacitación de hostigamiento y la integración en una sola visita.", "Ver fechas disponibles")

# ======================================================================= PLAN MENSUAL
def p_plan(B):
    inc = includes_grid([
        ("Cada mes", "Consultas de personal", "El dueño y los jefes tienen a quién preguntar antes de decidir sobre un caso."),
        ("Cada ingreso", "Inducción y período de prueba", "Bienvenida ordenada y seguimiento a los 30, 60 y 90 días."),
        ("Cada salida", "Entrevista de salida", "Y un informe trimestral de rotación con las causas a atacar."),
        ("Cuando haga falta", "Políticas y documentos", "Perfiles, políticas, formatos y comunicados a medida."),
        ("Cada año", "Clima y capacitación", "Medición de clima con su plan de mejora y plan anual de capacitación."),
        ("Si lo necesitas", "Bienestar y casos sociales", "Subsidios EsSalud y casos sociales con nuestra red de especialistas.")])
    how = modules([("Diagnóstico", "45 minutos sin costo para ver qué necesita tu empresa."),
                   ("Alcance a medida", "Elegimos juntos qué entra en el plan y con qué topes mensuales."),
                   ("Tarifa fija", "Un monto mensual según el número de trabajadores, por escrito."),
                   ("Informe mensual", "Qué se hizo, qué está pendiente y qué conviene decidir."),
                   ("Revisión trimestral", "Ajustamos el alcance según lo que de verdad se usó.")])
    fit = '''<div class="cards2">
<div class="card"><small>Encaja si</small><h3>Ya necesitas a alguien de RR. HH.</h3><ul class="incl"><li>Tienes entre 20 y 150 trabajadores</li><li>Los temas de personal le quitan tiempo al dueño o al contador</li><li>Contratas y pierdes gente con frecuencia</li><li>Quieres orden sin sumar un sueldo fijo más</li></ul></div>
<div class="card"><small>No encaja si</small><h3>Buscas otra cosa</h3><ul class="excl"><li>Buscas representación legal en un proceso</li><li>Tienes un problema puntual: ahí conviene un proyecto cerrado</li></ul></div>
</div>'''
    faq = [("¿En qué se diferencia de contratar un jefe de RR. HH.?", "Pagas solo el alcance que necesitas, sin un sueldo fijo a tiempo completo, y tienes a alguien que ya trabajó dentro de empresas grandes. Cuando tu empresa crezca lo suficiente, te ayudamos a contratar a tu propio jefe de RR. HH."),
           ("¿Qué pasa si un mes necesito más de lo pactado?", "El volumen que exceda los topes se cotiza aparte y solo se hace con tu aprobación previa por escrito. Lo que no se usa en un mes no se acumula al siguiente."),
           ("¿Cómo se paga?", "El primer mes se paga por adelantado al firmar, y los siguientes en los primeros días de cada mes."),
           ("¿Es presencial?", "Es mixto: horas presenciales en tu empresa según lo pactado, y el resto por WhatsApp, llamada o videollamada.")]
    return program_page(B, "/plan-mensual", "Plan mensual", "Servicio continuo · Gerente de personas a tiempo parcial",
        "Tu área de personas, sin contratar un área.",
        "Para empresas que ya necesitan a alguien de RR. HH. pero todavía no justifican una persona a tiempo completo. Una tarifa mensual fija, un alcance escrito y un informe cada mes.",
        [("Tarifa fija", "según tu número de trabajadores"), ("Alcance escrito", "con topes mensuales claros"), ("Informe mensual", "para que sepas en qué se usó")],
        [sec("inc", "Qué puede incluir.", inc, "No todo entra en todos los planes: armamos el tuyo con lo que tu empresa necesita hoy.", sid="detalle"),
         sec("como", "Cómo funciona.", how, paper=True),
         sec("fit", "Para quién es.", fit)],
        faq, "Plan mensual: gerente de personas a tiempo parcial en Arequipa",
        "Gerente de personas a tiempo parcial para empresas de Arequipa: consultas, inducción, rotación, políticas, clima y capacitación con una tarifa mensual fija y alcance escrito.",
        "Hola Daniel, me interesa el plan mensual de gerente de personas a tiempo parcial.", "Quiero mi plan")

# ======================================================================= TERMÓMETRO (página)
def p_termometro(B):
    hero = B.page_hero([("Termómetro de riesgo laboral", None)], "Herramienta gratuita",
        "Mide en tres minutos dónde está expuesta tu empresa.",
        "Doce preguntas de sí o no sobre orden laboral, talento y cultura. Al terminar ves tu puntaje, el frente por donde conviene empezar y, si quieres, lo revisamos juntos.",
        '<a class="btn btn-wine" href="#termometro">Empezar ahora</a>')
    after = sec("despues", "Y después, ¿qué?", modules([
        ("Ves tu resultado", "Puntaje de 0 a 12, nivel de exposición y el frente con más vacíos."),
        ("Lo revisamos juntos", "Si quieres, nos mandas el resultado por WhatsApp y agendamos la reunión de 45 minutos sin costo."),
        ("Ordenamos prioridades", "Salimos de la reunión con dos o tres prioridades reales."),
        ("Propuesta escrita", "Solo si tiene sentido, te enviamos una propuesta con alcance, plazos e inversión."),
        ("Tú decides", "Sin presión. Si no podemos ayudarte, te lo decimos.")]), paper=True)
    faq = [("¿Mis respuestas se guardan?", "No. El cálculo ocurre en tu navegador y nada se envía a ningún servidor. Solo si tú decides, nos mandas el resultado por WhatsApp."),
           ("¿Reemplaza una auditoría?", "No. Es una primera foto para saber por dónde empezar. Una auditoría revisa documentos y casos reales."),
           ("¿Qué significa “No sé”?", "Cuenta igual que un “No”: si nadie en la empresa sabe la respuesta, ese frente no se está gestionando.")]
    body = hero + termometro(B, title="Termómetro de Riesgo Laboral") + after + B.faq_block(faq) + B.cta_band()
    return B.page("/termometro", "Termómetro de Riesgo Laboral gratis", "Mide en tres minutos la exposición laboral, de talento y de clima de tu empresa con 12 preguntas. Gratis, sin registro y sin guardar tus respuestas.",
                  body, [B.crumbs_ld([("Inicio", "/"), ("Termómetro", "/termometro")]), B.faq_ld(faq),
                         {"@type": "WebApplication", "name": "Termómetro de Riesgo Laboral", "applicationCategory": "BusinessApplication", "operatingSystem": "Web", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "PEN"}, "provider": {"@id": B.SITE + "/#empresa"}, "url": B.SITE + "/termometro"}],
                  scripts=("/static/termometro.js",))

# ======================================================================= NOSOTROS
def p_nosotros(B):
    hero = B.page_hero([("Nosotros", None)], "Quién está detrás",
        "Rigor de empresa grande, para empresas que todavía no tienen un área de RR. HH.",
        "Espinoza T Personas nace en Arequipa de la experiencia de Daniel Espinoza gestionando personas dentro de agroindustria, industria, retail, sector financiero y salud, y como consultor en empresas de distintos rubros.",
        B.wa_btn("Hola Daniel, vi tu perfil en la web y quiero conversar sobre mi empresa.", "Conversar con Daniel"))
    track = '''<div class="track">
  <div><b>Agroindustria e industria</b><span>Agroexportadora de más de 15 000 trabajadores, sedes de Arequipa y Chincha (2021–2023). Satisfacción laboral de 74% a 93%, programas de salud mental que redujeron el estrés y el ausentismo, cultura de comportamiento seguro y team building.</span></div>
  <div><b>Retail y sector financiero</b><span>Una cadena de retail y una cooperativa de ahorro y crédito, más de 2 500 trabajadores (2023–2024). Vacantes cubiertas en menos tiempo que el promedio del sector, plan anual de capacitación, MOF y perfiles de puesto, clima y estrategias de retención.</span></div>
  <div><b>Salud</b><span>Una clínica privada de Arequipa, más de 800 trabajadores (2024–2026). Plan anual de capacitación con 100% de ejecución, onboarding y períodos de prueba, desempeño, sucesión y carrera, y el componente de formación del personal en la acreditación internacional Joint Commission International.</span></div>
  <div><b>Consultoría y capacitación externa</b><span>Desde 2016 en consultoras de RR. HH. y como independiente: capacitación en habilidades directivas y blandas para empresas de distintos rubros, y rediseño de la estrategia de talento humano en empresas de Arequipa.</span></div>
  <div><b>Formación</b><span>Psicología, Universidad Católica de Santa María. Candidato a Magíster en Gerencia del Talento Humano, Universidad Tecnológica del Perú.</span></div>
</div>'''
    about = f'''<section class="band" aria-labelledby="daniel">
  <div class="wrap">
    <div class="about">
      <div>
        <p class="figure-num" aria-label="De 74 por ciento a 93 por ciento">74%<span class="arrow" aria-hidden="true">→</span>93%</p>
        <p class="figure-cap">Satisfacción laboral que logró Daniel en las sedes de Arequipa y Chincha de una agroexportadora de más de 15 000 trabajadores, con los programas que diseñó y condujo durante dos años.</p>
      </div>
      <div class="about-body">
        <h2 class="reveal" id="daniel">Daniel Franco Espinoza Cuadra</h2>
        <p class="role">Gerente General</p>
        <p>Más de cinco años gestionando personas desde dentro de empresas grandes: capacitación de mandos medios, clima laboral, evaluación de desempeño, planes de sucesión e integración de equipos, en operaciones de 800 a más de 15 000 trabajadores.</p>
        <p>Su firma es el diseño de experiencias de aprendizaje con juego serio: dinámicas con propósito que la gente recuerda y aplica, en lugar de diapositivas que se olvidan al salir.</p>
        {track}
      </div>
    </div>
  </div>
</section>'''
    principles = includes_grid([
        ("Cómo trabajamos", "Primero el diagnóstico", "Ningún servicio empieza con una cotización. Empieza con 45 minutos sin costo para entender el problema real."),
        ("Cómo trabajamos", "Todo por escrito", "Alcance, lo que queda fuera, plazos e inversión, antes de firmar. Lo que no está en la propuesta se cotiza aparte."),
        ("Cómo trabajamos", "Lo que no hacemos, lo decimos", "No damos representación legal ni hacemos evaluaciones que exijan colegiatura. Si tu caso necesita otro especialista, te lo decimos en la primera reunión.")])
    red = f'''<section class="band" aria-labelledby="red-t">
  <div class="wrap">
    <div class="plan">
      <div><p class="kicker">Red de especialistas asociados</p><h2 id="red-t">Cuando un proyecto necesita más manos.</h2><p>Para servicios como bienestar, casos sociales o grupos grandes, trabajamos con una red de especialistas asociados. La coordinación y la responsabilidad frente a tu empresa siguen siendo de Daniel.</p><div class="hero-actions"><a class="btn btn-wine" href="/red">Únete a la red</a></div></div>
      <ul><li>Misma metodología y mismos formatos</li><li>Un solo responsable frente a tu empresa</li><li>Confidencialidad firmada</li></ul>
    </div>
  </div>
</section>'''
    results = includes_grid([
        ("Agroindustria", "74% → 93%", "Satisfacción laboral en dos sedes, con programas sostenidos durante dos años."),
        ("Salud", "Acreditación internacional", "Responsable del componente de formación del personal en la acreditación Joint Commission International de una clínica."),
        ("Salud", "100% del plan anual", "Plan anual de capacitación ejecutado completo, con evaluación de aprendizaje e impacto."),
        ("Retail y finanzas", "Vacantes más rápido", "Puestos cubiertos en menos tiempo que el promedio del sector."),
        ("Agroindustria", "Menos estrés y ausentismo", "Programas de salud mental que bajaron ambos indicadores."),
        ("Varios rubros", "Supervisores formados", "Programas de habilidades directivas para líderes y de habilidades blandas para personal operativo.")])
    body = hero + about + sec("resultados", "Resultados reales, con el rubro y sin el nombre.", results, "Por confidencialidad no nombramos a las empresas. Cada cifra es verificable con referencias laborales.", paper=True) + sec("principios", "Tres reglas que no cambian.", principles) + red + B.cta_band()
    person = {"@type": "Person", "@id": B.SITE + "/nosotros#daniel", "name": "Daniel Franco Espinoza Cuadra", "jobTitle": "Gerente General", "worksFor": {"@id": B.SITE + "/#empresa"},
              "alumniOf": [{"@type": "CollegeOrUniversity", "name": "Universidad Católica de Santa María"}, {"@type": "CollegeOrUniversity", "name": "Universidad Tecnológica del Perú"}],
              "knowsAbout": ["Gestión del talento humano", "Clima laboral", "Capacitación de mandos medios", "Evaluación de desempeño"]}
    return B.page("/nosotros", "Nosotros: Daniel Espinoza y Espinoza T Personas", "Daniel Franco Espinoza Cuadra, formado en Psicología y candidato a magíster en Gerencia del Talento Humano, con más de cinco años gestionando personas en agroindustria, retail, finanzas y salud en Arequipa.",
                  body, [B.crumbs_ld([("Inicio", "/"), ("Nosotros", "/nosotros")]), person])

# ======================================================================= EMPRESAS GRANDES
def p_grandes(B):
    hero = B.page_hero([("Empresas grandes", None)], "Para más de 500 trabajadores",
        "También trabajamos con corporaciones.",
        "Daniel se formó dentro de operaciones de 800 a más de 15 000 trabajadores. Con empresas grandes trabajamos por proyecto o por programa, junto a tu equipo de RR. HH.",
        B.wa_btn("Hola Daniel, escribo de una empresa grande y quiero conversar sobre un proyecto.", "Conversar sobre un proyecto") + '<a class="textlink" href="#detalle">Ver qué hacemos</a>')
    cards = '<div class="cards3">' + "".join([
        B.card("/programas/supervisores", "Programa", "Escuela de supervisores por cohortes", "Formación de mandos medios por oleadas, con medición antes y después."),
        B.card("/servicios/clima-y-cultura", "U5", "Clima censal con línea base", "Diagnóstico por sede, área y antigüedad, con plan de mejora y medición de seguimiento."),
        B.card("/servicios/capacitacion-y-desarrollo", "U3", "Desempeño, 9-Box y sucesión", "Sistema de evaluación, mapa de talento y planes para puestos críticos."),
        B.card("/servicios/capacitacion-y-desarrollo", "U3", "Escuela interna", "Mallas por familia de puestos e instructores internos formados."),
        B.card("/servicios/estructura-y-puestos", "U1", "Valoración de puestos y bandas", "Equidad interna con método por puntos y política salarial."),
        B.card("/servicios/capacitacion-y-desarrollo", "U3", "Medición de impacto", "Saber con datos qué programas de formación funcionan y cuáles no.")]) + "</div>"
    how = modules([("Confidencialidad", "Acuerdo firmado desde la primera reunión, si lo necesitas."),
                   ("Propuesta técnica y económica", "Con alcance, cronograma, entregables y equipo."),
                   ("Contraparte única", "Un responsable de tu lado y uno del nuestro."),
                   ("Transferencia", "Todo en editable y tu equipo capacitado para sostenerlo."),
                   ("Verificación", "Revisión a los 30 días, incluida.")])
    body = hero + sec("que", "Lo que más hacemos con empresas grandes.", cards, sid="detalle") + sec("como", "Cómo trabajamos con tu área de compras y de RR. HH.", how, paper=True) + B.cta_band(wa="Hola Daniel, escribo de una empresa grande y quiero conversar sobre un proyecto.")
    return B.page("/empresas-grandes", "Consultoría de RR. HH. para empresas grandes en Arequipa", "Programas de supervisores, clima censal, desempeño, sucesión, escuela interna y valoración de puestos para empresas de más de 500 trabajadores en Arequipa y el sur del Perú.",
                  body, [B.crumbs_ld([("Inicio", "/"), ("Empresas grandes", "/empresas-grandes")])])

# ======================================================================= RECURSOS
CHECK = [
    ("Ingreso y contratos", ["Contrato escrito y firmado cuando la modalidad lo exige (plazo fijo, tiempo parcial)", "Alta del trabajador en el T-Registro al ingresar", "File personal abierto con sus documentos desde el primer día"]),
    ("Pago y jornada", ["Boletas de pago entregadas y con constancia de recepción", "Registro de control de asistencia al día", "Horas extra autorizadas por escrito"]),
    ("Reglas internas", ["Reglamento Interno de Trabajo si tienes más de 100 trabajadores (y recomendable aunque tengas menos)", "Políticas internas difundidas con cargo de conocimiento", "Procedimiento disciplinario escrito"]),
    ("Hostigamiento sexual", ["Política y procedimiento de prevención difundidos", "Canal de denuncia conocido por todos", "Comité de intervención (20 o más trabajadores) o delegado", "Capacitación al ingreso y difusión periódica documentadas"]),
    ("Seguridad y salud en el trabajo", ["Comité de SST (20 o más trabajadores) o supervisor de SST", "Registros obligatorios al día", "Exámenes médicos ocupacionales vigentes"]),
]
FAQ_GENERAL = HOME_FAQ

def p_recursos(B):
    hero = B.page_hero([("Recursos", None)], "Recursos gratuitos", "Herramientas para ordenar la gestión de tu gente.",
        "Una lista de verificación preventiva, el Termómetro de Riesgo Laboral y las preguntas que más nos hacen. Úsalos aunque nunca trabajemos juntos.",
        '<a class="btn btn-wine" href="/termometro">Hacer el Termómetro</a><a class="textlink" href="#checklist">Ver la lista de verificación</a>')
    groups = "".join(f'<div class="card check"><small>{i+1:02d}</small><h3>{t}</h3><ul class="checklist">' + "".join(f"<li>{E(x)}</li>" for x in items) + "</ul></div>" for i, (t, items) in enumerate(CHECK))
    check = f'''<div class="cards3">{groups}<a class="card card-navy" href="/servicios/orden-laboral"><small>¿Te faltan varios?</small><h3>Hagamos una auditoría preventiva</h3><p>Revisamos tus documentos y te entregamos un plan de corrección priorizado.</p><span class="go">Ver el servicio {B.ARROW}</span></a></div>
<p class="note">Lista orientativa y general, preparada con fines preventivos. No reemplaza una asesoría legal ni cubre todas las obligaciones de cada régimen o rubro. Revisada en octubre de 2026.</p>'''
    body = hero + sec("checklist-t", "Lista de verificación preventiva.", check, "Lo mínimo que conviene tener en orden antes de que alguien lo revise.", sid="checklist") + B.faq_block(FAQ_GENERAL, "Preguntas frecuentes", "faq") + B.cta_band()
    return B.page("/recursos", "Recursos gratuitos: checklist laboral preventivo y preguntas frecuentes", "Lista de verificación laboral preventiva para empresas en Perú, Termómetro de Riesgo Laboral gratuito y respuestas a las preguntas más frecuentes sobre gestión de personas.",
                  body, [B.crumbs_ld([("Inicio", "/"), ("Recursos", "/recursos")]), B.faq_ld(FAQ_GENERAL)])

# ======================================================================= CONTACTO
TOPICS = ["Diagnóstico de 45 minutos", "Capacitación o taller", "Programa de supervisores", "Prevención del hostigamiento", "Integración de equipo", "Clima laboral", "Selección o inducción", "Orden laboral", "Plan mensual", "Otro tema"]

def p_contacto(B):
    hero = B.page_hero([("Contacto", None)], "Contacto", "Cuéntanos qué está pasando con tu equipo.",
        "Escríbenos por WhatsApp, llámanos o deja tus datos. Respondemos en el día hábil.")
    opts = "".join(f"<option>{t}</option>" for t in TOPICS)
    sizes = "".join(f"<option>{s}</option>" for s in ["Menos de 20", "20 a 50", "51 a 150", "151 a 500", "Más de 500"])
    form = f'''<section class="band" aria-labelledby="form-t">
  <div class="wrap">
    <div class="cards2 contact-layout">
      <div>
        <h2 class="section-title reveal" id="form-t">Déjanos tus datos.</h2>
        <p class="section-sub">Al enviar se abre WhatsApp o tu correo con el mensaje listo. Tú decides si lo mandas.</p>
        <form id="contact-form" class="form" novalidate style="margin-top:1.75rem">
          <div class="field"><label for="f-nombre">Tu nombre</label><input id="f-nombre" name="nombre" autocomplete="name" required></div>
          <div class="field"><label for="f-empresa">Empresa</label><input id="f-empresa" name="empresa" autocomplete="organization"></div>
          <div class="field"><label for="f-tamano">Número de trabajadores</label><select id="f-tamano" name="tamano"><option value="">Elige una opción</option>{sizes}</select></div>
          <div class="field"><label for="f-tema">Tema</label><select id="f-tema" name="tema"><option value="">Elige una opción</option>{opts}</select></div>
          <div class="field full"><label for="f-mensaje">¿Qué necesitas?</label><textarea id="f-mensaje" name="mensaje" required></textarea></div>
          <div class="form-actions full"><button class="btn btn-wine" type="submit" value="wa">{B.WA_SVG}Enviar por WhatsApp</button><button class="btn btn-outline" type="submit" value="mail">Enviar por correo</button></div>
          <p class="note full" id="form-status" role="status" aria-live="polite">No guardamos tus datos en la web: el mensaje sale de tu propio WhatsApp o correo.</p>
        </form>
      </div>
      <div class="contact-cards">
        <div class="card"><small>WhatsApp y teléfono</small><h3><a href="tel:+51974770954">974 770 954</a></h3><p>Lunes a viernes. Si no contestamos, te devolvemos la llamada.</p></div>
        <div class="card"><small>Correo</small><h3><a href="mailto:gerencia@espinozat.com">gerencia@espinozat.com</a></h3><p>Para propuestas, documentos y solicitudes de empresas grandes.</p></div>
        <div class="card"><small>Dónde trabajamos</small><h3>Arequipa</h3><p>Cusco e Ica por proyecto. Todo el Perú en remoto o híbrido.</p></div>
        <div class="card card-navy"><small>Sin costo</small><h3>Diagnóstico de 45 minutos</h3><p>Aplicamos el Termómetro y sales con tus dos o tres prioridades reales.</p></div>
      </div>
    </div>
  </div>
</section>'''
    body = hero + form
    return B.page("/contacto", "Contacto: agenda tu diagnóstico sin costo", "Contacta a Espinoza T Personas en Arequipa: WhatsApp 974 770 954, gerencia@espinozat.com. Agenda tu diagnóstico de 45 minutos sin costo.",
                  body, [B.crumbs_ld([("Inicio", "/"), ("Contacto", "/contacto")]), {"@type": "ContactPage", "url": B.SITE + "/contacto", "about": {"@id": B.SITE + "/#empresa"}}])

# ======================================================================= RED
def p_red(B):
    hero = B.page_hero([("Red de especialistas", None)], "Red de especialistas asociados", "Trabajemos juntos en proyectos de personas.",
        "Buscamos profesionales independientes de Arequipa y del sur con quienes trabajar por proyecto, con método y con reglas claras.",
        B.wa_btn("Hola Daniel, quiero formar parte de la red de especialistas de Espinoza T Personas.", "Quiero ser parte"))
    areas = '<div class="who">' + "".join(f'<span class="pill-l">{a}</span>' for a in ["Facilitación y capacitación", "Psicología organizacional", "Trabajo social", "Derecho laboral", "Seguridad y salud en el trabajo", "Selección y búsqueda de ejecutivos", "Coaching de líderes", "Diseño instruccional y e-learning", "Comunicación interna", "People analytics y datos", "Nutrición y bienestar", "Finanzas personales para trabajadores", "Producción audiovisual", "Eventos e integración"]) + "</div>"
    how = modules([("Nos escribes", "Con tu CV o tu perfil de LinkedIn y el área en la que trabajas."),
                   ("Conversamos", "Una reunión corta para conocer tu experiencia y tu forma de trabajar."),
                   ("Primer proyecto", "Empezamos con algo acotado, con alcance y pago por escrito."),
                   ("Mismo método", "Trabajamos con los formatos y el estándar de Espinoza T."),
                   ("Confidencialidad", "Firmamos un acuerdo para proteger a los clientes.")])
    body = hero + sec("areas", "Áreas que buscamos.", areas, "Si tu especialidad no está en la lista pero trabaja con personas en empresas, igual escríbenos.") + sec("como", "Cómo funciona.", how, paper=True) + \
        B.cta_band("Escríbenos.", "Mándanos tu CV a gerencia@espinozat.com o escríbenos por WhatsApp.", "Hola Daniel, quiero formar parte de la red de especialistas de Espinoza T Personas.")
    return B.page("/red", "Únete a la red de especialistas", "Red de especialistas asociados de Espinoza T Personas en Arequipa: facilitadores, trabajadores sociales, psicólogos organizacionales y abogados laboralistas que trabajan por proyecto.",
                  body, [B.crumbs_ld([("Inicio", "/"), ("Red de especialistas", "/red")])])

PAGES = [
    ("/programas/supervisores", p_supervisores),
    ("/programas/hostigamiento", p_hostigamiento),
    ("/programas/taller-3-horas", p_taller),
    ("/programas/integracion", p_integracion),
    ("/cierre-2026", p_cierre),
    ("/plan-mensual", p_plan),
    ("/termometro", p_termometro),
    ("/nosotros", p_nosotros),
    ("/empresas-grandes", p_grandes),
    ("/recursos", p_recursos),
    ("/contacto", p_contacto),
    ("/red", p_red),
]

def not_found(B):
    body = '''<section class="page-hero nf"><div class="wrap"><p class="kicker">Error 404</p><h1>Esta página no existe.</h1><p class="lede">Puede que el enlace esté mal escrito o que la página ya no esté. Estas te pueden servir:</p>
<div class="hero-actions"><a class="btn btn-wine" href="/">Ir al inicio</a><a class="textlink" href="/termometro">Hacer el Termómetro</a><a class="textlink" href="/contacto">Contacto</a></div></div></section>'''
    return B.page("/404", "Página no encontrada", "La página que buscas no existe.", body, robots="noindex")

def llms(B):
    lines = ["# Espinoza T Personas", "",
             "> Consultora de gestión de personas con sede en Arequipa, Perú. Capacitación, desarrollo, cultura y clima laboral para empresas desde 20 trabajadores hasta corporaciones. Lema: \"Piensa en personas.\"", "",
             "- Gerente General: Daniel Franco Espinoza Cuadra. Formación en Psicología (Universidad Católica de Santa María). Candidato a Magíster en Gerencia del Talento Humano (Universidad Tecnológica del Perú).",
             "- Experiencia: más de cinco años gestionando personas dentro de empresas de agroindustria, retail, finanzas y salud, en operaciones de 800 a más de 15 000 trabajadores. Satisfacción laboral de 74% a 93% en una agroexportadora de más de 15 000 trabajadores.",
             "- Zona: Arequipa (sede). Cusco e Ica por proyecto. Resto del Perú en remoto o híbrido.",
             "- Contacto: WhatsApp y teléfono +51 974 770 954 · gerencia@espinozat.com",
             "- Primer paso: diagnóstico de 45 minutos sin costo. Precios no públicos: la inversión se calcula según el número de trabajadores y queda por escrito en la propuesta.",
             "- No ofrece: representación legal ni patrocinio, ni evaluaciones que requieran colegiatura.", "",
             "## Servicios"]
    for s in B.ORDER:
        d = B.SERVICES[s]
        lines.append(f"- [{d['nav']} ({d['unit']} · {d['unit_name']})]({B.SITE}{B.svc_url(s)}): {d['nav_desc']}")
    lines += ["", "## Programas"]
    for h, t, dsc in B.PROGRAMS:
        lines.append(f"- [{t}]({B.SITE}{h}): {dsc}")
    lines += ["- [Plan mensual]({0}/plan-mensual): gerente de personas a tiempo parcial con tarifa mensual fija.".format(B.SITE), "",
              "## Más", f"- [Termómetro de Riesgo Laboral]({B.SITE}/termometro): 12 preguntas, gratis, sin guardar respuestas.",
              f"- [Nosotros]({B.SITE}/nosotros)", f"- [Empresas grandes]({B.SITE}/empresas-grandes)", f"- [Recursos]({B.SITE}/recursos)", f"- [Contacto]({B.SITE}/contacto)", ""]
    return "\n".join(lines)
