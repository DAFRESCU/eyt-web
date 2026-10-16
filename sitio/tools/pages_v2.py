# -*- coding: utf-8 -*-
"""Versión 2 de la portada y de las páginas por público (Empresas, Instituciones, Comunidades) y herramientas gratis.
Cada función recibe el módulo build (B) con los helpers."""
import html, json
from pages_content import sec, HOME_FAQ

E = html.escape
WA_HELLO = "Hola Espinoza T, vi la web de Espinoza T Personas y quiero conversar."

# ======================================================================= HERO EN CARRUSEL
# (foto, palabra tachada, nombre corto, unidad completa, frase)
SLIDES = [
    ("02-construccion", "estructuras", "Estrategia", "Estrategia y diseño organizacional",
     "Antes de crecer, cada puesto necesita sentido: quién decide, quién responde y para qué existe."),
    ("06-hoteleria", "vacantes", "Atracción", "Atracción y gestión del talento",
     "Las personas correctas, en el momento correcto y con una razón para quedarse."),
    ("04-contact-center", "cursos", "Formación", "Formación y desarrollo del talento",
     "Aprender es lo que convierte a alguien capaz en alguien que lidera."),
    ("08-agroindustria", "resultados", "Cultura", "Cultura y experiencia organizacional",
     "La cultura es cómo se logran los resultados, todos los días, cuando nadie mira."),
    ("05-salud", "asistencia", "Bienestar", "Bienestar y gestión social y comunitaria",
     "Más que asistir al trabajo: cuidar a la persona, a su familia y al entorno donde vive."),
    ("10-legal", "multas", "Cumplimiento", "Cumplimiento y auditoría laboral",
     "Hacerlo bien y poder demostrarlo, antes de que alguien lo pregunte."),
]
END_WORD = "rubros"
SCENES = [  # descripción oculta (solo para lectores de pantalla)
    "Un trabajador de construcción con casco y chaleco, sonriendo en una obra de Arequipa con el volcán al fondo.",
    "Una trabajadora de hotel con uniforme, sonriendo en un pasillo con un carro de lencería.",
    "Una operadora de contact center con audífonos, sonriendo en una oficina abierta con equipos trabajando.",
    "Un trabajador de agroindustria con bata y guantes en una planta de procesamiento.",
    "Una médica con estetoscopio, sonriendo en el pasillo de una clínica.",
    "Una abogada con carpeta en un pasillo de oficinas de cristal.",
    "Un mosaico con las seis personas anteriores, de rubros distintos.",
]

def reel(B):
    imgs, caps, dots = [], [], []
    for k, (f, word, short, unit, say) in enumerate(SLIDES):
        if k == 0:
            imgs.append(f'<picture class="reel-slide on" data-word="{word}"><source media="(max-width:760px) and (orientation:portrait)" srcset="/personas/m/{f}.webp" width="540" height="960"><img class="reel-img" src="/personas/{f}.webp" alt="" width="1600" height="900" decoding="async" fetchpriority="high"></picture>')
        else:
            imgs.append(f'<picture class="reel-slide" data-word="{word}"><source media="(max-width:760px) and (orientation:portrait)" data-srcset="/personas/m/{f}.webp" width="540" height="960"><img class="reel-img" data-src="/personas/{f}.webp" alt="" width="1600" height="900" decoding="async"></picture>')
        on = " on" if k == 0 else ""
        caps.append(f'<div class="reel-layer reel-cap{on}" aria-hidden="{"false" if k == 0 else "true"}"><p class="k">{unit}</p><p class="say">{say}</p></div>')
        dots.append(f'<li><button type="button" aria-label="Ir a: {unit}"><span>{short}</span></button></li>')
    # cierre: mosaico con todas las personas
    tiles = "".join(f'<img data-src="/personas/{s[0]}.webp" alt="" width="800" height="450" decoding="async" loading="lazy">' for s in SLIDES)
    imgs.append(f'<div class="reel-slide reel-collage" data-word="{END_WORD}">{tiles}</div>')
    caps.append('<div class="reel-layer reel-cap" aria-hidden="true"><p class="k">Espinoza T Personas</p><p class="say">Cambia el rubro, cambia el puesto, cambia la época. Lo que no cambia es que detrás de cada puesto hay una persona.</p></div>')
    dots.append('<li><button type="button" aria-label="Ir al cierre: Piensa en personas"><span>Personas</span></button></li>')
    scenes = "".join(f"<li>{E(s)}</li>" for s in SCENES)
    return f'''<section class="reel" id="inicio" aria-roledescription="carrusel" aria-label="Seis frentes de la gestión de personas">
  <div class="reel-stage">
    <div class="reel-media" aria-hidden="true">{"".join(imgs)}</div>
    <div class="reel-shade" aria-hidden="true"></div>
    <button class="reel-pause" type="button" aria-pressed="false" aria-label="Pausar el carrusel"><i aria-hidden="true"></i><span>Pausar</span></button>
    <div class="reel-ui">
      <div class="wrap">
        <div class="hero reel-copy">
          <h1 id="claim">
            <span class="claim-no" aria-hidden="true">No pienses solo en <br class="br-m"><span class="struck"><span class="w">{SLIDES[0][1]}</span></span>.</span>
            <span class="claim-yes"><span class="sr">Piensa en personas.</span><span aria-hidden="true">Piensa en <br class="br-m">personas.</span></span>
          </h1>
          <div class="reel-layers" aria-live="off">{"".join(caps)}</div>
          <div class="hero-actions">
            {B.wa_btn("Hola Espinoza T, vi la web de Espinoza T Personas y quiero agendar el diagnóstico de 45 minutos sin costo.", "Agenda tu diagnóstico de 45 minutos sin costo")}
            <a class="textlink" href="#herramientas">Prueba las herramientas gratis</a>
          </div>
        </div>
      </div>
      <div class="wrap reel-foot"><ol class="reel-cycle">{"".join(dots)}</ol></div>
    </div>
    <ul class="sr">{scenes}</ul>
  </div>
</section>'''

# ======================================================================= HERRAMIENTAS (configuración de los motores)
RISK_OPTS = [["Sí", 0], ["No", 1], ["No sé", 1]]

TERMO = {
    "id": "termometro", "mode": "risk", "options": RISK_OPTS, "unknownIndex": 2,
    "reportTitle": "Informe del Termómetro de Riesgo Laboral",
    "groups": [{"name": "Orden laboral"}, {"name": "Talento"}, {"name": "Cultura y bienestar"}],
    "links": ["/servicios/orden-laboral", "/servicios/capacitacion-y-desarrollo", "/servicios/clima-y-cultura"],
    "verdicts": [
        {"max": 0, "t": "Todo en orden", "a": "Respondiste sí a las doce. Aquí el trabajo es sostener lo que funciona, dejar evidencia y revisarlo cada año."},
        {"max": 2, "t": "Gestión ordenada", "a": "Tu empresa tiene lo básico resuelto. Toca cerrar los pocos vacíos que quedan, empezando por {donde}."},
        {"max": 6, "t": "Exposición moderada", "a": "Hay vacíos que todavía no te cuestan dinero, pero pueden costarlo este año. Conviene empezar por {donde}, donde está tu puntaje más alto."},
        {"max": 99, "t": "Exposición alta", "a": "Conviene intervenir ya en {donde}. No hace falta atacar todo a la vez: se empieza por ahí y se avanza desde ese punto."},
    ],
    "note": "Orientación general, preparada con fines preventivos. No es asesoría legal ni reemplaza una auditoría laboral completa. Tus respuestas no se guardaron ni se enviaron a ningún lado.",
    "waIntro": "Hola Espinoza T, hice el Termómetro de Riesgo Laboral en la web.", "waLabel": "Revisar mi resultado por WhatsApp",
    "items": [
        {"g": 0, "q": "¿Todos tus trabajadores están declarados en el T-Registro y tienen contrato firmado vigente?",
         "gap": "Trabajadores sin registro o sin contrato al día",
         "why": "El T-Registro y el contrato son la base del vínculo laboral formal: dicen quién trabaja contigo, desde cuándo y en qué condiciones.",
         "risk": "Multas en una inspección y, ante un reclamo, una empresa sin papeles al día parte en desventaja.",
         "step": "Cruza la planilla con el T-Registro y revisa que cada persona tenga su contrato firmado y vigente."},
        {"g": 0, "q": "¿Tu Reglamento Interno de Trabajo está actualizado y entregado a cada trabajador con cargo firmado?",
         "gap": "Reglamento Interno desactualizado o sin cargos de entrega",
         "why": "Es el documento que fija horarios, faltas y sanciones. Es obligatorio desde 100 trabajadores y recomendable aunque tengas menos.",
         "risk": "Sin reglas escritas y entregadas, sancionar una falta es difícil de sostener.",
         "step": "Revisa la fecha de la última actualización y reúne los cargos de entrega firmados."},
        {"g": 0, "q": "¿Tienes elegido el Comité o Supervisor de SST, con actas, capacitaciones y exámenes médicos documentados?",
         "gap": "Seguridad y salud en el trabajo sin respaldo documentado",
         "why": "La norma de seguridad y salud en el trabajo pide un comité (desde 20 trabajadores) o un supervisor, con registros al día.",
         "risk": "Sanciones y mayor responsabilidad de la empresa si ocurre un accidente.",
         "step": "Confirma que la elección esté vigente y junta actas, capacitaciones y exámenes en una sola carpeta."},
        {"g": 0, "q": "¿Los files del personal están completos: contratos, boletas, constancias y control de asistencia?",
         "gap": "Files del personal incompletos",
         "why": "El file es la memoria de la relación laboral y tu primera defensa ante una inspección.",
         "risk": "Si falta un documento, la empresa no puede demostrar que cumplió.",
         "step": "Toma cinco files al azar y compáralos contra una lista mínima de documentos."},
        {"g": 1, "q": "¿Cada puesto tiene un perfil escrito con funciones y requisitos que se usa al momento de contratar?",
         "gap": "Puestos sin perfil escrito",
         "why": "Sin perfil, cada contratación se decide por intuición y cada persona entiende su puesto a su manera.",
         "risk": "Contrataciones que no encajan, rotación temprana y conflictos por funciones.",
         "step": "Escribe primero el perfil de los tres puestos que más contratas."},
        {"g": 1, "q": "¿El personal nuevo pasa por una inducción formal en sus primeros días?",
         "gap": "Ingreso sin inducción formal",
         "why": "Los primeros días definen si alguien se queda: ahí aprende cómo se trabaja y a quién acudir.",
         "risk": "Más rotación en los primeros meses y errores que se pagan en la operación.",
         "step": "Arma un recorrido de la primera semana, con responsable y lista de verificación."},
        {"g": 1, "q": "¿Tus supervisores y jefes han recibido formación en liderazgo o manejo de equipos en el último año?",
         "gap": "Jefes sin formación para dirigir",
         "why": "Dirigir gente y hacer bien el trabajo son dos oficios distintos, y casi nadie enseña el segundo.",
         "risk": "Mal clima, conflictos y gente que renuncia a su jefe, no a la empresa.",
         "step": "Elige un tema crítico (dar instrucciones, corregir, conflictos) y capacita primero a los jefes con más equipo."},
        {"g": 1, "q": "¿Se evalúa el desempeño del personal al menos una vez al año, con una conversación de resultados?",
         "gap": "Sin evaluación de desempeño ni conversación de resultados",
         "why": "Evaluar y conversar es la forma de que la gente sepa cómo va y qué se espera de ella.",
         "risk": "Ascensos y aumentos sin criterio claro, y talento que se va por no saber dónde está.",
         "step": "Define tres criterios simples por puesto y programa una conversación anual con cada persona."},
        {"g": 2, "q": "¿Sabes cuántos trabajadores se fueron el año pasado y por qué razón?",
         "gap": "Rotación sin medir ni explicar",
         "why": "Si no sabes cuántos se van ni por qué, no puedes decidir qué corregir.",
         "risk": "Cada salida cuesta búsqueda, curva de aprendizaje y trabajo detenido; sin dato, ese costo no se ve.",
         "step": "Cuenta las salidas de los últimos 12 meses, anota el motivo de cada una y calcula su costo con la calculadora de rotación."},
        {"g": 2, "q": "¿Se ha medido el clima laboral o la satisfacción del personal en los últimos doce meses?",
         "gap": "Clima laboral sin medir",
         "why": "El clima se siente en los pasillos mucho antes de verse en los números.",
         "risk": "Problemas que crecen en silencio hasta aparecer como renuncias, quejas o conflictos.",
         "step": "Aplica una encuesta anónima corta y comprométete con una acción visible a partir de lo que salga."},
        {"g": 2, "q": "¿Hay alguien responsable de gestionar descansos médicos, subsidios EsSalud y casos sociales?",
         "gap": "Descansos médicos, subsidios y casos sociales sin responsable",
         "why": "Los descansos médicos y los subsidios tienen trámites y plazos; sin responsable, se pierden.",
         "risk": "Dinero de subsidios que no se recupera y casos delicados atendidos sin criterio.",
         "step": "Designa un responsable y registra cada descanso con su trámite y su fecha límite."},
        {"g": 2, "q": "¿Existe un canal formal y conocido para que un trabajador reporte una queja o un caso de hostigamiento?",
         "gap": "Sin canal formal de quejas y de hostigamiento",
         "why": "Un canal conocido y confiable es la puerta por la que llegan los problemas antes de crecer; en hostigamiento sexual, la norma lo exige.",
         "risk": "Casos que no se reportan, o que llegan directo a una denuncia externa.",
         "step": "Habilita un canal (correo reservado o formulario), difúndelo y define quién lo atiende."},
    ],
}

LEY = {
    "id": "ley27942", "mode": "risk", "options": RISK_OPTS, "unknownIndex": 2,
    "reportTitle": "Informe de cumplimiento: hostigamiento sexual laboral",
    "groups": [{"name": "Prevención"}, {"name": "Capacidad interna"}, {"name": "Atención de casos"}],
    "links": ["/programas/hostigamiento", "/programas/hostigamiento", "/programas/hostigamiento"],
    "verdicts": [
        {"max": 0, "t": "Cumples lo esencial", "a": "Respondiste sí a las diez. Lo que sigue es mantener la evidencia al día y repetir la capacitación cada año."},
        {"max": 2, "t": "Vas bien, con vacíos", "a": "La base está. Cierra los pocos vacíos que quedan, empezando por {donde}."},
        {"max": 5, "t": "Cumplimiento parcial", "a": "Hay obligaciones que hoy no podrías demostrar. Conviene empezar por {donde}, donde está tu puntaje más alto."},
        {"max": 99, "t": "Cumplimiento débil", "a": "Hoy, ante una inspección o un caso real, la empresa estaría expuesta. Conviene empezar ya por {donde}."},
    ],
    "note": "Orientación general basada en la Ley 27942 y su reglamento (DS 014-2019-MIMP). No es asesoría legal ni reemplaza la revisión de un abogado. Tus respuestas no se guardaron ni se enviaron a ningún lado.",
    "waIntro": "Hola Espinoza T, hice la prueba de cumplimiento de la Ley 27942 en la web.", "waLabel": "Revisar mi resultado por WhatsApp",
    "items": [
        {"g": 0, "q": "¿Cada trabajador nuevo recibe una capacitación sobre hostigamiento sexual al ingresar, con registro firmado?",
         "gap": "Sin capacitación al ingreso documentada",
         "why": "La norma pide capacitar a cada trabajador al ingresar.",
         "risk": "Sin registro no puedes demostrar que cumpliste, aunque lo hayas hecho.",
         "step": "Incluye la capacitación en tu inducción y guarda la lista de asistencia firmada."},
        {"g": 0, "q": "¿Difundes información de prevención de forma periódica a todo el personal y guardas la evidencia?",
         "gap": "Difusión periódica sin evidencia",
         "why": "La norma pide difundir información de forma periódica, no una sola vez.",
         "risk": "Una difusión sin rastro equivale a no haberla hecho.",
         "step": "Programa piezas simples (afiche, correo, charla corta) en un calendario anual y archívalas."},
        {"g": 0, "q": "¿Tu reglamento o política interna define el hostigamiento sexual como falta y establece su sanción?",
         "gap": "Hostigamiento no definido como falta en la normativa interna",
         "why": "Si las reglas internas no lo mencionan, sancionar se vuelve difícil de sostener.",
         "risk": "Medidas disciplinarias que se pueden cuestionar.",
         "step": "Revisa tu reglamento o política y añade definición, ejemplos y sanciones."},
        {"g": 1, "q": "¿Tienes el Comité de Intervención frente al Hostigamiento Sexual (20 o más trabajadores) o un delegado designado, y todos saben quiénes son?",
         "gap": "Comité o delegado sin constituir o sin difundir",
         "why": "Es la instancia que recibe y atiende los casos: con 20 o más trabajadores corresponde un comité, y con menos, un delegado.",
         "risk": "Sin instancia constituida, los casos no tienen quién los atienda formalmente.",
         "step": "Constituye el comité o designa al delegado y comunica sus nombres a todo el personal."},
        {"g": 1, "q": "¿El área de personas y el comité o delegado reciben capacitación especializada cada año?",
         "gap": "Sin capacitación anual especializada para quienes atienden los casos",
         "why": "Quienes reciben y conducen los casos necesitan formación especializada cada año.",
         "risk": "Casos mal manejados desde el primer día: revictimización, plazos perdidos y evidencia dañada.",
         "step": "Programa la capacitación anual para ese grupo y guarda las constancias."},
        {"g": 1, "q": "¿Tus jefes saben qué hacer, y qué no hacer, cuando alguien les cuenta un caso?",
         "gap": "Jefes sin protocolo de primera respuesta",
         "why": "El primer jefe que escucha un caso suele ser quien lo maneja mejor o peor.",
         "risk": "Que el caso se minimice, se comente en pasillos o se intente resolver informalmente.",
         "step": "Entrega a cada jefe una guía de una página: escuchar, no prometer, derivar al canal."},
        {"g": 2, "q": "¿Hay un canal de denuncia conocido por todos, que permita reservar la identidad de quien denuncia?",
         "gap": "Canal de denuncia inexistente, desconocido o sin reserva",
         "why": "Sin un canal que la gente conozca y en el que confíe, los casos no llegan.",
         "risk": "Casos que no se reportan o que llegan directo a una denuncia externa.",
         "step": "Habilita un canal con reserva, difúndelo y define quién lo atiende."},
        {"g": 2, "q": "¿Existe un procedimiento escrito para recibir, investigar y resolver una queja, con plazos?",
         "gap": "Procedimiento de atención y plazos sin escribir",
         "why": "La norma establece etapas y plazos para atender los casos; escribirlos evita improvisar.",
         "risk": "Improvisar con un caso vivo: plazos perdidos y decisiones que se pueden cuestionar.",
         "step": "Escribe el flujo de punta a punta (recepción, medidas de protección, investigación, resolución) y asigna responsables."},
        {"g": 2, "q": "¿Sabes qué medidas de protección aplicar a quien denuncia desde el primer día?",
         "gap": "Sin medidas de protección definidas",
         "why": "Proteger a quien denuncia desde el inicio es parte de la atención de un caso.",
         "risk": "Represalias, daño a la persona y responsabilidad para la empresa.",
         "step": "Lista las medidas posibles (separación de espacios, cambio de turno, acompañamiento) y quién decide."},
        {"g": 2, "q": "¿Guardas en un solo lugar la evidencia de todo: listas firmadas, actas, comunicaciones y casos atendidos?",
         "gap": "Evidencia dispersa o inexistente",
         "why": "En una inspección o un proceso, lo que no está documentado no se puede demostrar.",
         "risk": "Cumplir en la práctica pero no poder probarlo.",
         "step": "Crea una carpeta única con índice y designa a una persona responsable de mantenerla."},
    ],
}

# Brújula: intereses vocacionales (seis estilos, cuatro afirmaciones cada uno). Instrumento propio de exploración, no una evaluación psicológica.
BRU_TYPES = {
    "R": {"name": "Constructor", "tag": "Hacer con las manos y con las cosas",
          "desc": "Te sientes bien cuando algo funciona gracias a ti. Prefieres lo concreto, lo práctico y lo que se puede tocar.",
          "areas": ["Ingeniería civil, mecánica o industrial", "Agronomía y agroindustria", "Electricidad, electrónica y automatización", "Arquitectura y construcción", "Oficios técnicos especializados"],
          "try": "Ármale una solución a algo real de tu casa o colegio: un mueble, un circuito, un huerto. Observa cuánto disfrutas el proceso."},
    "I": {"name": "Investigador", "tag": "Entender cómo y por qué",
          "desc": "Te nace preguntar y no soltar hasta entender. Disfrutas la lógica, los datos y los problemas difíciles.",
          "areas": ["Ciencias de la salud y biología", "Física, química y matemática", "Ingeniería de sistemas y datos", "Investigación y ciencias sociales", "Psicología y ciencias del comportamiento"],
          "try": "Elige una pregunta que te intrigue y búscale respuesta en tres fuentes distintas. Anota qué descubriste."},
    "A": {"name": "Creador", "tag": "Imaginar y expresar",
          "desc": "Necesitas que lo tuyo tenga voz propia. Valoras la originalidad y la forma en que se ve, se oye o se cuenta lo que haces.",
          "areas": ["Diseño gráfico, de interiores o de moda", "Comunicación, periodismo y audiovisual", "Música, teatro y artes", "Publicidad y creatividad", "Arquitectura y diseño de productos"],
          "try": "Crea una pieza propia (un texto, un afiche, un video corto) y muéstrasela a alguien. Mira cómo te sientes al compartirla."},
    "S": {"name": "Guía", "tag": "Acompañar y hacer crecer a otros",
          "desc": "Lo que más te mueve es el efecto en las personas. Escuchas, explicas y te importa que al otro le vaya bien.",
          "areas": ["Educación y pedagogía", "Psicología, trabajo social y salud", "Recursos humanos y desarrollo de personas", "Voluntariado y gestión comunitaria", "Coaching, deporte formativo y orientación"],
          "try": "Enseña algo que sabes a alguien menor o a un compañero. Fíjate en qué momento sentiste que valió la pena."},
    "E": {"name": "Impulsor", "tag": "Liderar, convencer y emprender",
          "desc": "Te enciende mover cosas: proponer, persuadir, decidir y llevar un proyecto a la meta, aunque haya riesgo.",
          "areas": ["Administración y negocios", "Marketing, ventas y emprendimiento", "Derecho y ciencias políticas", "Gestión pública y liderazgo", "Turismo, hotelería y comercio internacional"],
          "try": "Arma una mini-iniciativa (una venta, una colecta, un evento) con un objetivo claro y una fecha. Observa qué parte disfrutas más."},
    "C": {"name": "Organizador", "tag": "Ordenar, planificar y asegurar que salga bien",
          "desc": "Te sientes cómodo cuando todo está claro: pasos, plazos, cifras y responsables. Cuidas el detalle y la exactitud.",
          "areas": ["Contabilidad, auditoría y finanzas", "Administración y logística", "Gestión de proyectos y operaciones", "Banca y seguros", "Gestión documentaria y calidad"],
          "try": "Organiza algo complejo (un viaje, una agenda del mes, un presupuesto) de punta a punta y revisa qué tan tranquilo te sentiste al lograrlo."},
}
BRU_Q = [
    ("R", "Armar, reparar o hacer funcionar cosas con las manos."), ("I", "Investigar por qué pasan las cosas hasta encontrar la respuesta."),
    ("A", "Dibujar, diseñar, escribir o componer algo propio."), ("S", "Escuchar a alguien que tiene un problema y ayudarlo."),
    ("E", "Convencer a otros de una idea o de un proyecto."), ("C", "Ordenar documentos, datos u horarios hasta que todo cuadre."),
    ("R", "Trabajar al aire libre, con herramientas o maquinaria."), ("I", "Resolver problemas de lógica, matemática o ciencia."),
    ("A", "Inventar ideas originales, aunque nadie las haya hecho antes."), ("S", "Enseñar o explicar algo a otras personas."),
    ("E", "Liderar un grupo y tomar decisiones."), ("C", "Seguir un procedimiento paso a paso sin errores."),
    ("R", "Construir algo que se pueda ver y tocar al final del día."), ("I", "Leer o ver documentales para aprender algo nuevo por gusto."),
    ("A", "Actuar, cantar, tocar o presentarte frente a otros."), ("S", "Trabajar en equipo para que a todos les vaya bien."),
    ("E", "Crear un negocio o vender algo propio."), ("C", "Llevar cuentas, inventarios o registros con exactitud."),
    ("R", "Entender cómo funciona un aparato o una máquina."), ("I", "Analizar datos para descubrir patrones."),
    ("A", "Cuidar cómo se ve y cómo suena lo que creas."), ("S", "Participar en actividades de tu comunidad o en voluntariados."),
    ("E", "Competir para lograr una meta ambiciosa."), ("C", "Planificar con calendarios, listas y plazos claros."),
]
BRUJULA = {
    "id": "brujula", "mode": "likert", "whyLabel": "", "reportTitle": "Tu Brújula vocacional",
    "options": [["No es lo mío", 0], ["Me da igual", 1], ["Me gusta", 2], ["Me encanta", 3]],
    "types": BRU_TYPES,
    "lead": "No es un diagnóstico ni una sentencia. Es un mapa de tus intereses de hoy para empezar a explorar con más claridad.",
    "note": "La Brújula es un ejercicio de exploración de intereses. No es una evaluación psicológica ni define tu futuro: sirve para conversar y probar caminos. Tus respuestas no se guardaron ni se enviaron a ningún lado.",
    "waIntro": "Hola Espinoza T, hice la Brújula vocacional en la web.", "waLabel": "Conversar sobre mi resultado por WhatsApp",
    "items": [{"t": t, "q": q} for t, q in BRU_Q],
}

def jscript(cfg):
    s = json.dumps(cfg, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    return f'<script type="application/json" id="quiz-data">{s}</script>'

def tool_shell(B, kicker, h1, lede, bring, minutes, size=False, start_label=None):
    li = "".join(f"<li>{E(x)}</li>" for x in bring)
    sz = ""
    if size:
        chips = "".join(f'<button type="button" class="chip-btn" data-size="{E(s)}" aria-pressed="false">{E(s[0].upper() + s[1:])}</button>' for s in ["menos de 20", "20 a 50", "51 a 150", "151 a 500", "más de 500"])
        sz = f'<div class="tool-size"><p>¿Cuántos trabajadores tiene tu empresa? <span>Opcional</span></p><div class="chip-row">{chips}</div></div>'
    return f'''<section class="band band-navy tool" id="tool" data-view="intro" aria-labelledby="tool-h">
  <div class="wrap">
    <div class="tool-intro">
      <p class="kicker kicker-light">{kicker}</p>
      <h1 id="tool-h" data-focus>{h1}</h1>
      <p class="tool-lede">{lede}</p>
      <ul class="tool-bring">{li}</ul>
      {sz}
      <div class="tool-go"><button class="btn btn-light btn-big" type="button" data-start>{start_label or "Empezar"} <small>· {minutes}</small></button></div>
      <p class="privacy-note">Gratis, sin registro. Tus respuestas no se guardan ni se envían a ningún lado: todo ocurre en tu teléfono o computadora. Solo si tú decides, compartes el resultado por WhatsApp.</p>
      <noscript><p class="privacy-note">Esta herramienta necesita JavaScript activado.</p></noscript>
    </div>
    <div class="tool-stage" hidden></div>
    <div class="tool-result" hidden></div>
  </div>
</section>'''

def other_tools(B, current):
    cards = []
    for slug, tag, title, p in TOOLS_LIST:
        if slug == current: continue
        cards.append(B.card(slug, tag, title, p, "Abrir"))
    return sec("otras", "Otras herramientas gratis.", '<div class="cards3">' + "".join(cards[:3]) + "</div>", paper=True)

TOOLS_LIST = [
    ("/termometro", "Empresas · 3 minutos", "Termómetro de Riesgo Laboral", "Doce preguntas y un informe que te dice dónde está expuesta tu empresa, por qué y por dónde empezar."),
    ("/cumple-ley-27942", "Empresas e instituciones · 3 minutos", "¿Cumples la Ley 27942?", "Diez preguntas sobre prevención del hostigamiento sexual laboral y un informe de lo que hoy no podrías demostrar."),
    ("/brujula", "Jóvenes y familias · 5 minutos", "Brújula vocacional", "Veinticuatro afirmaciones para descubrir tus estilos de interés y las áreas que conviene explorar."),
    ("/calculadora-rotacion", "Empresas · 2 minutos", "Calculadora del costo de la rotación", "Cuánto te cuesta cada renuncia, en soles, con tus propios números."),
]

def p_termometro2(B):
    shell = tool_shell(B, "Gratis · 3 minutos · para empresas", "¿Dónde está expuesta tu empresa?",
                       "Doce preguntas, una por pantalla. Al final recibes un informe punto por punto: qué significa cada vacío, qué riesgo trae y por dónde empezar.",
                       ["Un puntaje por frente: orden laboral, talento, cultura y bienestar", "Tus puntos críticos explicados en lenguaje claro", "Un primer paso concreto para cada uno", "Un informe que puedes guardar en PDF"], "3 minutos", size=True, start_label="Empezar el Termómetro")
    how = sec("como", "Cómo funciona.", '''<ol class="steps-mini"><li><b>Respondes</b>Sí, No o No sé. «No sé» cuenta como punto de exposición: lo que no puedes comprobar, no te protege.</li><li><b>Ves tu mapa</b>Un puntaje por frente y el frente donde conviene empezar.</li><li><b>Lees tu informe</b>Cada vacío explicado: qué significa, qué riesgo trae y el primer paso.</li><li><b>Decides</b>Lo usas tú mismo, o lo revisamos juntos en una reunión de 45 minutos sin costo.</li></ol>''')
    faq = [("¿Mis respuestas quedan guardadas?", "No. El cálculo ocurre en tu teléfono o computadora; nada se envía ni se guarda en nuestros servidores. Solo si tú decides, compartes el resultado por WhatsApp."),
           ("¿Qué significa «No sé»?", "Cuenta como un punto de exposición. Si no sabes si algo está en regla, tampoco podrías demostrarlo ante una inspección o un reclamo."),
           ("¿Es una auditoría laboral?", "No. Es una revisión rápida y preventiva de doce puntos. Una auditoría revisa documentos reales; el Termómetro te dice por dónde conviene empezar."),
           ("¿Sirve para cualquier tamaño de empresa?", "Sí. Algunas obligaciones cambian con el número de trabajadores (por ejemplo, el Reglamento Interno desde 100), y el informe lo aclara en cada punto.")]
    body = shell + how + B.faq_block(faq, "Preguntas sobre el Termómetro", "faq-t") + other_tools(B, "/termometro") + B.cta_band()
    graph = [B.crumbs_ld([("Inicio", "/"), ("Herramientas gratis", "/herramientas"), ("Termómetro", "/termometro")]), B.faq_ld(faq),
             {"@type": "WebApplication", "name": "Termómetro de Riesgo Laboral", "applicationCategory": "BusinessApplication", "operatingSystem": "Web", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "PEN"}, "provider": {"@id": B.SITE + "/#empresa"}, "url": B.SITE + "/termometro"}]
    out = B.page("/termometro", "Termómetro de Riesgo Laboral gratis", "Mide en tres minutos la exposición laboral, de talento y de clima de tu empresa. Doce preguntas, informe punto por punto y primer paso para cada vacío. Gratis, sin registro.", body, graph, scripts=("/static/quiz.js",))
    return out.replace("</main>", jscript(TERMO) + "\n</main>")

def p_ley(B):
    shell = tool_shell(B, "Gratis · 3 minutos · empresas e instituciones", "¿Cumples la Ley 27942?",
                       "Diez preguntas sobre prevención del hostigamiento sexual laboral. Al final, un informe de lo que hoy podrías demostrar ante una inspección y de lo que no.",
                       ["Tu nivel de cumplimiento en tres frentes: prevención, capacidad interna y atención de casos", "Cada vacío explicado, con su riesgo y su primer paso", "Un informe que puedes guardar en PDF y mostrar a tu gerencia"], "3 minutos", size=True, start_label="Empezar la prueba")
    what = sec("que", "Qué revisa esta prueba.", '''<div class="cards3"><div class="card"><small>01</small><h3>Prevención</h3><p>Capacitación al ingreso, difusión periódica y reglas internas que definan el hostigamiento como falta.</p></div><div class="card"><small>02</small><h3>Capacidad interna</h3><p>Comité o delegado, capacitación anual especializada y jefes que saben qué hacer ante un caso.</p></div><div class="card"><small>03</small><h3>Atención de casos</h3><p>Canal de denuncia, procedimiento con plazos, medidas de protección y evidencia ordenada.</p></div></div>''', "Basada en la Ley 27942 y su reglamento (DS 014-2019-MIMP).")
    faq = [("¿Esto es asesoría legal?", "No. Es una orientación general y preventiva. No reemplaza la revisión de un abogado ni cubre todas las situaciones de cada empresa."),
           ("¿Aplica a mi empresa aunque sea pequeña?", "Sí. La obligación de prevenir existe para todos los empleadores; lo que cambia con el tamaño es la forma: con 20 o más trabajadores corresponde un comité y con menos, un delegado."),
           ("¿Qué hago con el resultado?", "Úsalo como lista de pendientes. Si quieres, lo revisamos juntos y armamos la capacitación y los documentos que falten."),
           ("¿Mis respuestas quedan guardadas?", "No. Todo ocurre en tu dispositivo y no se envía a ningún lado, salvo que tú decidas compartir el resultado por WhatsApp.")]
    body = shell + what + B.faq_block(faq, "Preguntas sobre la prueba", "faq-l") + other_tools(B, "/cumple-ley-27942") + B.cta_band(wa="Hola Espinoza T, quiero revisar el cumplimiento de la Ley 27942 en mi empresa.")
    graph = [B.crumbs_ld([("Inicio", "/"), ("Herramientas gratis", "/herramientas"), ("¿Cumples la Ley 27942?", "/cumple-ley-27942")]), B.faq_ld(faq),
             {"@type": "WebApplication", "name": "Prueba de cumplimiento de la Ley 27942", "applicationCategory": "BusinessApplication", "operatingSystem": "Web", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "PEN"}, "provider": {"@id": B.SITE + "/#empresa"}, "url": B.SITE + "/cumple-ley-27942"}]
    out = B.page("/cumple-ley-27942", "¿Cumples la Ley 27942? Prueba gratis de hostigamiento sexual laboral", "Diez preguntas para saber si tu empresa cumple con la prevención del hostigamiento sexual laboral (Ley 27942). Informe punto por punto, gratis y sin registro.", body, graph, scripts=("/static/quiz.js",))
    return out.replace("</main>", jscript(LEY) + "\n</main>")

def p_brujula(B):
    shell = tool_shell(B, "Gratis · 5 minutos · jóvenes y familias", "Brújula vocacional",
                       "Veinticuatro afirmaciones sobre lo que disfrutas hacer. Al final, tu mapa de estilos de interés y las áreas que vale la pena explorar.",
                       ["Tus tres estilos de interés principales, explicados", "Áreas de estudio y trabajo para explorar", "Una prueba práctica para cada estilo, para hacer esta semana", "Un informe que puedes guardar en PDF y compartir en familia"], "5 minutos", start_label="Empezar mi Brújula")
    how = sec("como", "Cómo usarla bien.", '''<div class="cards3"><div class="card"><small>01</small><h3>Responde con sinceridad</h3><p>Piensa en lo que disfrutas de verdad, no en lo que «conviene» o en lo que esperan los demás.</p></div><div class="card"><small>02</small><h3>Lee tus tres estilos</h3><p>No hay un resultado único: casi todos combinamos varios estilos, y esa mezcla es lo interesante.</p></div><div class="card"><small>03</small><h3>Pruébalo en la vida real</h3><p>Cada estilo trae una actividad corta para esta semana. Explorar con las manos vale más que imaginar.</p></div></div>''', "Es un ejercicio de exploración, no una evaluación psicológica y no decide tu carrera.")
    colegio = f'''<section class="band band-paper" aria-labelledby="col"><div class="wrap"><div class="plan"><div><p class="kicker">Para colegios y familias</p><h2 id="col">¿Quieres llevar esto a tu colegio?</h2><p>Hacemos talleres de exploración vocacional para grupos de último año, junto con liderazgo juvenil, y charlas para madres y padres. La Brújula es el punto de partida; el taller es donde se conversa y se prueba.</p><div class="hero-actions">{B.wa_btn("Hola Espinoza T, quiero información sobre el taller de exploración vocacional para un colegio o grupo.", "Pedir información del taller")}<a class="textlink" href="/comunidades">Ver todo lo que hacemos con comunidades</a></div></div><ul><li>Taller de exploración vocacional para último año</li><li>Liderazgo juvenil previo a la elección de carrera</li><li>Escuela para madres y padres</li></ul></div></div></section>'''
    faq = [("¿Esto es un test psicológico?", "No. Es un ejercicio de exploración de intereses, para conversar y probar caminos. No diagnostica ni predice, y no reemplaza una evaluación psicológica hecha por un profesional colegiado."),
           ("¿Mis respuestas quedan guardadas?", "No. Todo ocurre en tu dispositivo y no se envía a ningún lado, salvo que decidas compartir el resultado por WhatsApp."),
           ("¿Puedo hacerla si soy adulto y quiero cambiar de rumbo?", "Sí. Los intereses ayudan a ordenar ideas a cualquier edad. Si estás en un cambio de carrera, el informe te da áreas para explorar."),
           ("¿Mi colegio puede contratar el taller?", "Sí. Se hace a medida del grupo y del colegio. Escríbenos por WhatsApp y conversamos.")]
    body = shell + how + colegio + B.faq_block(faq, "Preguntas sobre la Brújula", "faq-b") + other_tools(B, "/brujula") + B.cta_band(wa="Hola Espinoza T, hice la Brújula vocacional y quiero conversar.")
    graph = [B.crumbs_ld([("Inicio", "/"), ("Herramientas gratis", "/herramientas"), ("Brújula vocacional", "/brujula")]), B.faq_ld(faq),
             {"@type": "WebApplication", "name": "Brújula vocacional", "applicationCategory": "EducationalApplication", "operatingSystem": "Web", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "PEN"}, "provider": {"@id": B.SITE + "/#empresa"}, "url": B.SITE + "/brujula"}]
    out = B.page("/brujula", "Brújula vocacional gratis: descubre tus intereses y áreas para explorar", "Veinticuatro afirmaciones para descubrir tus estilos de interés y las áreas de estudio y trabajo que conviene explorar. Gratis, sin registro, con informe en PDF.", body, graph, scripts=("/static/quiz.js",))
    return out.replace("</main>", jscript(BRUJULA) + "\n</main>")

def p_herramientas(B):
    hero = B.page_hero([("Herramientas gratis", None)], "Gratis, sin registro",
                       "Herramientas que sirven de verdad.",
                       "Cada una te da un resultado que puedes usar: un informe, un mapa o un número. Úsalas aunque nunca trabajemos juntos.",
                       '<a class="textlink" href="#lista">Ver las herramientas</a>')
    hero = hero.replace('<span aria-current="page">Herramientas gratis</span>', '<span>Herramientas gratis</span>')
    cards = '<div class="cards2">' + "".join(B.card(u, t, h, p, "Abrir") for u, t, h, p in TOOLS_LIST) + "</div>"
    extra = '<p class="note">¿Recibiste una constancia de capacitación de Espinoza T Personas? <a class="textlink" href="/certificado">Verifícala aquí</a>. Y si buscas una lista para revisar tu orden laboral, mira los <a class="textlink" href="/recursos">recursos</a> y las <a class="textlink" href="/guias">guías</a>.</p>'
    body = hero + sec("lista-t", "Elige por dónde empezar.", cards + extra, sid="lista") + B.cta_band()
    return B.page("/herramientas", "Herramientas gratis: Termómetro, Ley 27942, Brújula y rotación", "Herramientas gratuitas de Espinoza T Personas: Termómetro de Riesgo Laboral, prueba de la Ley 27942, Brújula vocacional y calculadora del costo de la rotación.", body, [B.crumbs_ld([("Inicio", "/"), ("Herramientas gratis", "/herramientas")])])

# ======================================================================= INICIO
UNITS = [
    ("estructura-y-puestos", "Estrategia y diseño organizacional", "La estructura que sostiene todo lo demás: puestos, funciones y líneas de mando."),
    ("seleccion-e-induccion", "Atracción y gestión del talento", "Encontrar, elegir e integrar a las personas correctas."),
    ("capacitacion-y-desarrollo", "Formación y desarrollo del talento", "Capacitar, evaluar y hacer crecer a quienes ya están."),
    ("clima-y-cultura", "Cultura y experiencia organizacional", "Clima, valores y la experiencia diaria de trabajar aquí."),
    ("bienestar", "Bienestar y gestión social y comunitaria", "La persona, su familia y su entorno, antes y después del horario."),
    ("orden-laboral", "Cumplimiento y auditoría laboral", "Reglas claras, registros al día y todo demostrable."),
]

def teaser(url, q, opts, label):
    b = "".join(f'<button type="button" data-v="{i}">{E(o)}</button>' for i, o in enumerate(opts))
    return f'<div class="teaser" data-teaser="{url}"><p class="teaser-l">{label}</p><p class="teaser-q">{E(q)}</p><div class="teaser-o">{b}</div></div>'

def tool_cards(B):
    cs = []
    cs.append(f'''<article class="tool-card"><p class="tool-tag">Empresas · 3 minutos</p><h3>Termómetro de Riesgo Laboral</h3><p>Doce preguntas y un informe punto por punto: dónde está expuesta tu empresa, por qué y por dónde empezar.</p>
{teaser("/termometro", "¿Todos tus trabajadores están en el T-Registro y tienen contrato firmado vigente?", ["Sí", "No", "No sé"], "Pregunta 1 de 12")}
<p class="tool-get"><b>Te llevas</b> un informe en PDF</p><a class="textlink" href="/termometro">Empezar desde el principio</a></article>''')
    cs.append(f'''<article class="tool-card"><p class="tool-tag">Empresas e instituciones · 3 minutos</p><h3>¿Cumples la Ley 27942?</h3><p>Diez preguntas sobre prevención del hostigamiento sexual laboral y un informe de lo que hoy podrías demostrar.</p>
{teaser("/cumple-ley-27942", "¿Hay un canal de denuncia conocido por todos, que permita reservar la identidad de quien denuncia?", ["Sí", "No", "No sé"], "Pregunta 1 de 10")}
<p class="tool-get"><b>Te llevas</b> un informe en PDF</p><a class="textlink" href="/cumple-ley-27942">Empezar desde el principio</a></article>''')
    cs.append(f'''<article class="tool-card"><p class="tool-tag">Jóvenes y familias · 5 minutos</p><h3>Brújula vocacional</h3><p>Veinticuatro afirmaciones para descubrir tus estilos de interés y las áreas que conviene explorar.</p>
{teaser("/brujula", "Armar, reparar o hacer funcionar cosas con las manos.", ["No es lo mío", "Me da igual", "Me gusta", "Me encanta"], "Afirmación 1 de 24")}
<p class="tool-get"><b>Te llevas</b> tu mapa de intereses en PDF</p><a class="textlink" href="/brujula">Empezar desde el principio</a></article>''')
    cs.append(f'''<article class="tool-card"><p class="tool-tag">Empresas · 2 minutos</p><h3>Calculadora del costo de la rotación</h3><p>Cuánto te cuesta cada renuncia, en soles, con tus propios números: búsqueda, aprendizaje y trabajo detenido.</p>
<div class="teaser teaser-calc"><p class="teaser-l">Con tus números</p><p class="teaser-q">Pon cuántas personas se fueron el último año y su sueldo promedio. El resultado sale al instante.</p><a class="btn btn-wine btn-small" href="/calculadora-rotacion">Abrir la calculadora</a></div>
<p class="tool-get"><b>Te llevas</b> el costo en soles, listo para WhatsApp</p><a class="textlink" href="/calculadora-rotacion">Ver cómo se calcula</a></article>''')
    return "".join(cs)

def home(B):
    proof = '''<section class="proof" id="despues" aria-label="Trayectoria">
  <div class="wrap">
    <div class="hero-meta">
      <p><strong>74% → 93%</strong>de satisfacción laboral en la medición de clima 2023 de una agroindustria de Arequipa (casi 1 000 trabajadores). La midió la propia empresa; la gerencia estuvo a cargo del clima laboral de la zona sur.</p>
      <p><strong>+200 capacitaciones</strong>desde sesiones individuales hasta auditorios de 100 a 200 personas o más.</p>
      <p><strong>+10 años</strong>de experiencia de la dirección en gestión de personas, en agroindustria, retail, sector financiero, salud, restauración, minería, construcción, hotelería, educación, metalmecánica e industria.</p>
    </div>
  </div>
</section>'''

    who = f'''<section class="band" id="para-quien" aria-labelledby="quien-hoy">
  <div class="wrap">
    <div class="head"><h2 class="reveal" id="quien-hoy">¿Quién eres hoy?</h2><p>Cambia el público, no el criterio: pensar en las personas primero. Elige tu puerta.</p></div>
    <div class="who-grid">
      <a class="who-card" href="/empresas"><small>01</small><h3>Empresas</h3><p>Equipos que rinden, jefes que saben dirigir y una gestión laboral en regla, desde 20 trabajadores hasta corporaciones.</p><ul><li>Capacitación y supervisores</li><li>Clima, cultura y bienestar</li><li>Selección y orden laboral</li></ul><span class="go">Ver lo que hacemos {B.ARROW}</span></a>
      <a class="who-card" href="/instituciones"><small>02</small><h3>Instituciones</h3><p>Municipalidades, gobiernos regionales, universidades, gremios y organizaciones que trabajan con y para personas.</p><ul><li>Liderazgo para equipos directivos</li><li>Capacitación a servidores y socios</li><li>Cultura y cumplimiento institucional</li></ul><span class="go">Ver lo que hacemos {B.ARROW}</span></a>
      <a class="who-card" href="/comunidades"><small>03</small><h3>Comunidades</h3><p>Colegios, equipos deportivos, grupos, familias y personas que quieren crecer, decidir mejor o jugar en equipo.</p><ul><li>Liderazgo juvenil y orientación vocacional</li><li>Escuela de padres y jornadas en familia</li><li>Dinámicas de juego serio para equipos</li></ul><span class="go">Ver lo que hacemos {B.ARROW}</span></a>
    </div>
  </div>
</section>'''

    tools = f'''<section class="band band-navy" id="herramientas" aria-labelledby="regalo">
  <div class="wrap">
    <div class="head tools-head">
      <div><p class="kicker kicker-light">De regalo</p><h2 class="reveal" id="regalo">Empieza ahora, sin pedirnos nada.</h2><p>Responde la primera pregunta aquí mismo y sigue en la herramienta. Cada una termina en un resultado que puedes usar.</p></div>
      <div class="rail-btns" aria-label="Mover las herramientas"><button type="button" data-rail-prev aria-label="Anterior">←</button><button type="button" data-rail-next aria-label="Siguiente">→</button></div>
    </div>
    <div class="tool-rail" data-rail tabindex="0" aria-label="Herramientas gratis">{tool_cards(B)}</div>
    <p class="rail-more"><a class="textlink" href="/herramientas">Ver todas las herramientas gratis</a></p>
  </div>
</section>'''

    units = "".join(B.card(B.svc_url(s), f"{i+1:02d}", name, desc, "Ver los servicios") for i, (s, name, desc) in enumerate(UNITS))
    services = f'''<section class="band" id="servicios" aria-labelledby="frentes">
  <div class="wrap">
    <div class="head">
      <h2 class="reveal" id="frentes">Seis unidades. Todo el ciclo de vida de una persona en la organización.</h2>
      <p>Desde que se diseña el puesto hasta que todo queda demostrado. Cada página dice qué incluye cada servicio, qué no, qué te entregamos y en cuánto tiempo.</p>
    </div>
    <div class="fronts-grid">{units}</div>
    <p class="u7-line">¿Eres una entidad pública? Mira el <a href="/instituciones">Programa de Liderazgo Público</a> para equipos directivos.</p>
  </div>
</section>'''

    method = '''<section class="band band-paper" id="metodo" aria-labelledby="metodo-title">
  <div class="wrap">
    <div class="head"><h2 class="reveal" id="metodo-title">Cómo trabajamos.</h2><p>Cinco pasos, siempre los mismos. Sabes qué vas a recibir antes de pagar un sol.</p></div>
    <div class="steps-line" aria-hidden="true"><span></span></div>
    <ol class="steps">
      <li class="step"><h3>Diagnóstico</h3><p>45 minutos sin costo. Ubicamos las prioridades reales, con las herramientas gratis como punto de partida.</p></li>
      <li class="step"><h3>Propuesta escrita</h3><p>Alcance, lo que queda fuera, plazos e inversión. Vigente por 15 días.</p></li>
      <li class="step paid"><h3>Ejecución</h3><p>Empieza con la firma del acuerdo. En tu local, en remoto o híbrido.</p></li>
      <li class="step paid"><h3>Entrega</h3><p>Documentos en editable y un equipo interno capacitado para sostenerlo.</p></li>
      <li class="step paid"><h3>Verificación</h3><p>A los 30 días revisamos que lo implementado siga funcionando.</p></li>
    </ol>
    <p class="steps-note">Los dos primeros pasos no tienen costo. La inversión se calcula según el número de personas y el alcance, y siempre queda por escrito en la propuesta.</p>
  </div>
</section>'''

    about = '''<section class="band" id="quien" aria-labelledby="quien-title">
  <div class="wrap">
    <div class="about">
      <div>
        <p class="figure-num" aria-label="De 74 por ciento a 93 por ciento">74%<span class="arrow" aria-hidden="true">→</span>93%</p>
        <p class="figure-cap">Satisfacción laboral en la medición de clima 2023 de una agroindustria de Arequipa (casi 1 000 trabajadores activos). La midió la propia empresa; la gerencia estuvo a cargo del clima laboral de la zona sur.</p>
      </div>
      <div class="about-body">
        <h2 class="reveal" id="quien-title">Quién está detrás.</h2>
        <p class="role">Gerencia General · Bachiller en Psicología (UCSM) · Candidato a Magíster en Gerencia del Talento Humano (UTP)</p>
        <p>Ha trabajado dentro de empresas y como consultor en agroindustria, retail, sector financiero, salud, restauración, minería, construcción, hotelería, educación, metalmecánica e industria.</p>
        <p>En el clima laboral de una agroindustria aplicó la medición, tabuló, presentó el informe y coordinó con jefaturas y áreas el seguimiento para que lo medido se convirtiera en acciones. Ha conducido más de 200 capacitaciones.</p>
        <p>Espinoza T Personas nace en Arequipa para llevar ese rigor a empresas, instituciones y comunidades que lo necesitan, con una firma propia: aprender jugando en serio.</p>
        <p><a class="textlink" href="/nosotros">Conocer la trayectoria completa</a></p>
      </div>
    </div>
  </div>
</section>'''

    cierre = f'''<section class="band band-paper" id="cierre" aria-labelledby="cierre-t">
  <div class="wrap">
    <div class="combo">
      <p id="cierre-t"><strong>Cierre 2026.</strong>Cierra el año con tu equipo: capacitación, integración y reconocimiento en una sola visita, con entregables claros. Los cupos de diciembre se llenan por orden de consulta.</p>
      <a class="btn btn-light" href="/cierre-2026">Ver cómo funciona</a>
    </div>
  </div>
</section>'''

    close = f'''<section class="band band-navy close" id="contacto" aria-labelledby="close-title">
  <div class="wrap">
    <h2 class="reveal" id="close-title">Conversemos 45 minutos.</h2>
    <p class="close-lede">Cuéntanos qué está pasando con tu equipo, tu institución o tu comunidad. Si no podemos ayudarte, te lo diremos en la primera reunión.</p>
    <div class="close-actions">
      {B.wa_btn("Hola Espinoza T, quiero agendar el diagnóstico de 45 minutos sin costo.", "Agenda tu diagnóstico sin costo")}
      <a class="textlink" href="/contacto">Prefiero dejar mis datos</a>
    </div>
    <div class="contact-grid">
      <p><b>WhatsApp y teléfono</b><a href="tel:+51974770954">974 770 954</a></p>
      <p><b>Correo</b><a href="mailto:gerencia@espinozat.com">gerencia@espinozat.com</a></p>
      <p><b>Dónde trabajamos</b><span>Sede en Arequipa. Cusco e Ica por proyecto. Todo el Perú en remoto o híbrido.</span></p>
    </div>
  </div>
</section>'''

    body = reel(B) + proof + who + tools + services + method + about + cierre + B.faq_block(HOME_FAQ, "Lo que más nos preguntan", "faq") + close
    graph = [B.faq_ld(HOME_FAQ), {"@type": "WebSite", "@id": B.SITE + "/#web", "url": B.SITE + "/", "name": "Espinoza T Personas", "inLanguage": "es-PE", "publisher": {"@id": B.SITE + "/#empresa"}}]
    out = B.page("/", "Espinoza T Personas | Capacitación, desarrollo, cultura y clima laboral en Arequipa",
                 "Consultora de gestión de personas en Arequipa: capacitación, desarrollo, cultura y clima para empresas, instituciones y comunidades. Herramientas gratis y diagnóstico de 45 minutos sin costo.",
                 body, graph, scripts=("/static/reel.js", "/static/quiz.js"), body_class="home", og_title="Piensa en personas. | Espinoza T Personas")
    pre = ('<link rel="preload" as="image" href="/personas/m/02-construccion.webp" media="(max-width:760px) and (orientation:portrait)" fetchpriority="high">\n'
           '<link rel="preload" as="image" href="/personas/02-construccion.webp" media="not all and (max-width:760px) and (orientation:portrait)" fetchpriority="high">\n')
    return out.replace('<link rel="stylesheet"', pre + '<link rel="stylesheet"', 1)

# ======================================================================= PÁGINAS POR PÚBLICO
def offer_cards(B, items):
    return '<div class="cards3">' + "".join(items) + "</div>"

def p_empresas(B):
    hero = B.page_hero([("Empresas", None)], "Para empresas",
        "Personas que funcionan, en cualquier rubro.",
        "Capacitación, desarrollo, cultura y clima para empresas de Arequipa y del sur, desde 20 trabajadores hasta corporaciones. Con método, por escrito y con tu equipo adentro.",
        B.wa_btn("Hola Espinoza T, soy de una empresa y quiero conversar sobre mi equipo.", "Agenda tu diagnóstico sin costo") + '<a class="textlink" href="#entradas">Por dónde empezar</a>')
    hero = hero.replace('<span aria-current="page">Empresas</span>', '<span>Empresas</span>')
    entradas = offer_cards(B, [
        B.card("/programas/hostigamiento", "Cumplimiento", "Prevención del hostigamiento sexual", "La capacitación que pide la norma, con todo documentado.", "Ver el programa"),
        B.card("/programas/supervisores", "Liderazgo", "Programa de supervisores", "De buen técnico a buen jefe, en sesiones prácticas.", "Ver el programa"),
        B.card("/programas/taller-3-horas", "Un solo problema", "Taller de tres horas", "Un tema puntual, bien trabajado con situaciones reales.", "Ver los temas"),
        B.card("/programas/integracion", "Equipos", "Integración de equipos", "Dinámicas con método y compromisos por escrito.", "Ver el programa"),
        B.card("/cierre-2026", "Temporada", "Cierre 2026", "Capacitación, integración y reconocimiento en una sola visita.", "Ver cómo funciona"),
        B.card("/plan-mensual", "Continuo", "Plan mensual", "Un gerente de personas a tiempo parcial, con tarifa fija y alcance escrito.", "Ver qué incluye")])
    unidades = '<div class="fronts-grid">' + "".join(B.card(B.svc_url(s), f"{i+1:02d}", n, d, "Ver los servicios") for i, (s, n, d) in enumerate(UNITS)) + "</div>"
    herr = offer_cards(B, [B.card(u, t, h, p, "Abrir") for u, t, h, p in TOOLS_LIST if u != "/brujula"])
    body = (hero + sec("entradas-t", "Para empezar, algo concreto.", entradas, "Cada entrada resuelve un problema puntual, con duración y entregables claros.", sid="entradas")
            + sec("unidades-t", "Y cuando hay confianza, el trabajo de fondo.", unidades, "Las seis unidades cubren todo el ciclo de vida de una persona en tu organización.", paper=True)
            + sec("herr-t", "Mide antes de decidir.", herr, "Herramientas gratis que te dicen dónde estás parado.")
            + B.cta_band(wa="Hola Espinoza T, soy de una empresa y quiero conversar sobre mi equipo."))
    return B.page("/empresas", "Consultoría de personas para empresas en Arequipa", "Capacitación, supervisores, clima, cultura, selección y orden laboral para empresas de Arequipa y el sur del Perú, desde 20 trabajadores hasta corporaciones.", body, [B.crumbs_ld([("Inicio", "/"), ("Empresas", "/empresas")])])

def p_instituciones(B):
    hero = B.page_hero([("Instituciones", None)], "Para instituciones",
        "Instituciones que trabajan con personas necesitan equipos que trabajen bien juntos.",
        "Municipalidades, gobiernos regionales, universidades e institutos, gremios, asociaciones y organizaciones sociales. Programas a medida, con objetivos claros y entregables por escrito.",
        B.wa_btn("Hola Espinoza T, represento a una institución y quiero conversar sobre un programa.", "Conversar sobre un programa") + '<a class="textlink" href="#que">Ver lo que hacemos</a>')
    hero = hero.replace('<span aria-current="page">Instituciones</span>', '<span>Instituciones</span>')
    que = offer_cards(B, [
        B.card("/contacto", "Liderazgo", "Liderazgo público para equipos directivos", "Gerentes, jefes de área y regidores: decidir mejor, comunicar y conducir equipos bajo presión.", "Conversar"),
        B.card("/servicios/capacitacion-y-desarrollo", "Formación", "Capacitación a servidores y socios", "Talleres y programas a medida: atención al ciudadano, trabajo en equipo, comunicación y ética.", "Ver formación"),
        B.card("/servicios/clima-y-cultura", "Cultura", "Clima y cultura institucional", "Diagnóstico, plan de mejora y comunicación interna para que lo medido se convierta en acciones.", "Ver clima y cultura"),
        B.card("/servicios/bienestar", "Bienestar", "Bienestar, trabajo social y comunidad", "Programas de bienestar y relacionamiento con la comunidad, con enfoque social.", "Ver bienestar"),
        B.card("/cumple-ley-27942", "Cumplimiento", "Prevención del hostigamiento sexual", "La capacitación y los procedimientos que pide la norma, también para entidades.", "Hacer la prueba"),
        B.card("/comunidades", "Jóvenes", "Programas para jóvenes de tu jurisdicción", "Liderazgo juvenil y exploración vocacional para colegios y organizaciones de tu zona.", "Ver comunidades")])
    como = sec("como", "Cómo trabajamos con instituciones.", '''<ol class="steps-mini"><li><b>Conversación</b>45 minutos para entender el objetivo, el público y el contexto de tu institución.</li><li><b>Propuesta escrita</b>Objetivos, contenidos, plazos, entregables e inversión, con los términos de referencia que tu institución necesite.</li><li class="paid"><b>Ejecución</b>Con una contraparte de tu institución y listas de asistencia firmadas.</li><li class="paid"><b>Informe</b>Resultados, evidencias y recomendaciones por escrito.</li><li class="paid"><b>Verificación</b>A los 30 días revisamos que lo trabajado se esté usando.</li></ol>''', "Si eres una entidad pública, conversamos primero: te explicamos cómo se puede formalizar la capacitación según la normativa que te corresponde.", paper=True)
    body = hero + sec("que-t", "Lo que hacemos.", que, "A medida de cada institución. Cada programa se arma con tu equipo.", sid="que") + como + B.cta_band(wa="Hola Espinoza T, represento a una institución y quiero conversar sobre un programa.")
    return B.page("/instituciones", "Capacitación y liderazgo para instituciones y entidades públicas", "Liderazgo, capacitación, clima, bienestar y cumplimiento para municipalidades, gobiernos regionales, universidades, gremios y organizaciones sociales en Arequipa y el sur del Perú.", body, [B.crumbs_ld([("Inicio", "/"), ("Instituciones", "/instituciones")])])

def p_comunidades(B):
    hero = B.page_hero([("Comunidades", None)], "Para comunidades",
        "Colegios, equipos, grupos, familias y personas.",
        "Programas que se juegan en serio: aprender haciendo, con dinámicas que se recuerdan. Los contrata una institución, una empresa o un grupo, y participan las personas.",
        B.wa_btn("Hola Espinoza T, quiero conversar sobre un programa para mi colegio, equipo, grupo o familia.", "Conversar sobre un programa") + '<a class="textlink" href="/brujula">Probar la Brújula vocacional</a>')
    hero = hero.replace('<span aria-current="page">Comunidades</span>', '<span>Comunidades</span>')
    colegios = offer_cards(B, [
        B.card("/brujula", "Colegios", "Liderazgo juvenil y exploración vocacional", "Para el último año, antes de elegir carrera: se conversa, se prueba y se decide con más claridad.", "Probar la Brújula"),
        B.card("/contacto", "Familias", "Escuela de padres y madres", "Jornadas para acompañar mejor: comunicación, límites, adolescencia y proyecto de vida.", "Conversar"),
        B.card("/contacto", "Equipos y grupos", "Dinámicas de juego serio", "Cohesión, comunicación y liderazgo para equipos deportivos, clubes y grupos, con piezas y retos.", "Conversar")])
    otros = offer_cards(B, [
        B.card("/contacto", "Empresas para sus familias", "Jornadas interfamilias y de parejas", "Las contrata la empresa para sus trabajadores: un día para fortalecer los vínculos que sostienen el trabajo.", "Conversar"),
        B.card("/contacto", "Jóvenes y comunidad", "Oratoria y mente sana", "Hablar en público con confianza y herramientas simples para cuidar la salud mental, en grupos.", "Conversar"),
        B.card("/contacto", "Personas", "Cursos para ti, pronto", "Estamos preparando cursos en línea. Escríbenos y te avisamos cuando abra la lista.", "Pedir aviso")])
    nota = '<p class="note">La exploración vocacional que hacemos es un taller de orientación y conversación. No es una evaluación psicológica y no reemplaza la atención de un profesional colegiado.</p>'
    body = (hero + sec("col-t", "Para colegios, familias y grupos.", colegios, "Programas a medida, con dinámicas y entregables claros.", sid="colegios")
            + sec("otros-t", "Y más.", otros + nota, "Los contratan empresas, instituciones y grupos; participan las personas.", paper=True)
            + B.cta_band(wa="Hola Espinoza T, quiero conversar sobre un programa para mi colegio, equipo, grupo o familia."))
    return B.page("/comunidades", "Programas para colegios, equipos, familias y jóvenes en Arequipa", "Liderazgo juvenil, exploración vocacional, escuela de padres, jornadas en familia y dinámicas de juego serio para colegios, equipos deportivos, grupos y comunidades en Arequipa.", body, [B.crumbs_ld([("Inicio", "/"), ("Comunidades", "/comunidades")])])

NEW_PAGES = [
    ("/empresas", p_empresas), ("/instituciones", p_instituciones), ("/comunidades", p_comunidades),
    ("/herramientas", p_herramientas), ("/termometro", p_termometro2), ("/cumple-ley-27942", p_ley), ("/brujula", p_brujula),
]
