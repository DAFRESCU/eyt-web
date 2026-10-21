# -*- coding: utf-8 -*-
"""Guías (oct-2026): páginas que responden lo que un gerente de Arequipa busca en Google.
Cada guía: respuesta corta arriba, pasos, preguntas frecuentes, herramienta gratuita y CTA."""
import pages_content as PC

AUTHOR = {"@type": "Person", "name": "Daniel Espinoza C.", "jobTitle": "Fundador y Gerente General",
          "description": "Psicología (UCSM). Candidato a Magíster en Gerencia del Talento Humano (UTP).",
          "worksFor": {"@id": "https://espinozat.com/#empresa"}}
DATE = "2026-10-12"

GUIDES = []  # (path, short title, description) para el índice y llms.txt


def guide(B, path, crumb, kicker, h1, answer, blocks, faq, title, meta, wa_msg, tool=None):
    """answer: respuesta en 2-3 frases (lo que Google o una IA puede citar). blocks: lista de (h2, html)."""
    hero = B.page_hero([("Guías", "/guias"), (crumb, None)], kicker, h1, answer,
                       B.wa_btn(wa_msg, "Conversarlo con la gerencia") + '<a class="textlink" href="#guia">Leer la guía</a>')
    inner = "".join(f'<h2 id="g{i}">{h}</h2>{c}' for i, (h, c) in enumerate(blocks))
    byline = f'<p class="note">Por la gerencia de Espinoza T Personas · Actualizado en octubre de 2026. Guía general y preventiva: no reemplaza una asesoría legal.</p>'
    art = f'<section class="band" id="guia" aria-label="Guía"><div class="wrap"><article class="prose">{inner}{byline}</article></div></section>'
    tool_html = ""
    if tool:
        href, small, h3, p, go = tool
        tool_html = PC.sec("herr-" + crumb[:4].lower().replace(" ", ""), "Hazlo con tus números.",
                           '<div class="cards2">' + B.card(href, small, h3, p, go) +
                           B.card("/contacto", "Sin costo", "Diagnóstico de 45 minutos", "Revisamos tu caso y te decimos con honestidad si podemos ayudarte.", "Agendar") + "</div>", paper=True)
    body = hero + art + tool_html + B.faq_block(faq) + B.cta_band()
    graph = [B.crumbs_ld([("Inicio", "/"), ("Guías", "/guias"), (crumb, path)]), B.faq_ld(faq),
             {"@type": "Article", "headline": h1, "description": meta, "inLanguage": "es-PE", "author": AUTHOR,
              "publisher": {"@id": B.SITE + "/#empresa"}, "datePublished": DATE, "dateModified": DATE,
              "mainEntityOfPage": B.SITE + path, "image": B.SITE + "/og/" + path.strip("/").replace("/", "-") + ".png"}]
    return B.page(path, title, meta, body, graph)


def ul(items): return '<ul class="incl">' + "".join(f"<li>{x}</li>" for x in items) + "</ul>"
def ol(items): return '<ol class="steps-mini mods">' + "".join(f"<li><b>{t}</b>{d}</li>" for t, d in items) + "</ol>"
def p(*xs): return "".join(f"<p>{x}</p>" for x in xs)


# ------------------------------------------------------------------ 1. Hostigamiento
def g_hostigamiento(B):
    return guide(B, "/guias/hostigamiento-sexual-obligaciones-empresa", "Hostigamiento: qué pide la ley",
        "Guía · Cumplimiento",
        "¿Qué le pide la Ley 27942 a tu empresa sobre hostigamiento sexual?",
        "Todo empleador debe prevenir el hostigamiento sexual: capacitar a cada trabajador al ingresar, capacitar cada año al área de RR. HH. y al comité o delegado, difundir información periódicamente y tener un canal de denuncia que funcione. Lo que cambia con el tamaño es si te corresponde comité o delegado.",
        [("Las tres capacitaciones, sin confusiones",
          p("Es común leer que hay que capacitar «a todo el personal una vez al año». El reglamento (D. S. 014-2019-MIMP) en realidad distingue tres momentos:") +
          ol([("Al ingresar", "Cada trabajador nuevo recibe una capacitación sobre hostigamiento sexual al inicio de la relación laboral."),
              ("Cada año, especializada", "Para RR. HH., el comité o delegado de intervención y quienes investigan. Las MYPE acreditadas en el REMYPE están exceptuadas de esta."),
              ("Siempre, difusión", "Información periódica a todo el personal: qué es, cómo denunciar y qué sanciones hay.")])),
         ("¿Comité o delegado?",
          p("Si tu empresa tiene 20 trabajadores o más, corresponde un comité de intervención con representantes de la empresa y de los trabajadores. Con menos de 20, basta un delegado. En ambos casos, alguien debe saber exactamente qué hacer el día que llega una denuncia.")),
         ("Lo que debe existir por escrito",
          ul(["Una política interna de prevención y sanción del hostigamiento sexual",
              "Un canal de denuncia conocido por todos (no solo «hablar con el jefe»)",
              "El comité o delegado designado, con acta",
              "Registros de asistencia firmados de cada capacitación",
              "Evidencia de la difusión periódica (afiches, correos, charlas)"])),
         ("Qué suele fallar en las pymes de Arequipa",
          p("Por lo que vemos en el día a día: la capacitación se hizo una vez y nunca más, el trabajador nuevo entra sin recibirla, nadie guarda la lista firmada y el delegado no sabe que lo es. Ninguno de estos puntos es caro de corregir, pero todos se notan en una fiscalización o, peor, cuando llega un caso real.")),
         ("Por dónde empezar esta semana",
          ol([("Revisa tus registros", "¿Tienes listas firmadas de la última capacitación? ¿Los ingresos de este año la recibieron?"),
              ("Confirma quién es tu comité o delegado", "Que esté designado por escrito y que sepa qué hacer."),
              ("Programa lo que falta", "Una sesión de 2 horas cubre la capacitación con su documentación.")]))],
        [("¿Una MYPE también tiene que capacitar?", "Sí, las obligaciones de prevención aplican a todo empleador. La excepción para MYPE acreditadas en el REMYPE es solo la capacitación especializada anual."),
         ("¿La capacitación puede ser virtual?", "Sí, siempre que quede registro de asistencia y constancia por participante."),
         ("¿Quién puede dictarla?", "La norma no exige una profesión específica para la capacitación general. Lo importante es que el contenido sea correcto y que quede documentada."),
         ("¿Ustedes llevan los casos de denuncia?", "No hacemos representación legal. Capacitamos, ayudamos a ordenar la política y el canal, y si hace falta te derivamos a un abogado laboralista.")],
        "Hostigamiento sexual laboral: qué le pide la Ley 27942 a tu empresa (guía 2026)",
        "Guía clara de las obligaciones de la Ley 27942 y su reglamento para empresas en Perú: capacitación al ingreso, capacitación anual especializada, difusión, comité o delegado y canal de denuncia.",
        "Hola Espinoza T, leí la guía de hostigamiento y quiero revisar si mi empresa cumple.",
        ("/programas/hostigamiento", "Programa", "Capacitación en prevención del hostigamiento", "2 horas, presencial o virtual, con registro firmado y constancias.", "Ver el programa"))


# ------------------------------------------------------------------ 2. Rotación
def g_rotacion(B):
    return guide(B, "/guias/como-calcular-rotacion-de-personal", "Cómo calcular la rotación",
        "Guía · Retención",
        "Cómo calcular la rotación de personal y cuánto te cuesta.",
        "La rotación anual es el número de salidas en 12 meses dividido entre el promedio de trabajadores del periodo, por 100. Si tuviste 9 salidas con 30 trabajadores en promedio, tu rotación es 30 %. El costo de cada salida suma el puesto vacío, la búsqueda e inducción y los meses que el nuevo tarda en rendir.",
        [("La fórmula",
          p("<b>Rotación anual (%) = salidas en 12 meses ÷ promedio de trabajadores × 100.</b>",
            "El promedio de trabajadores puede ser simple: el número de inicio de año más el de fin de año, dividido entre dos. Si tu planilla cambia mucho por temporada, usa el promedio de los 12 meses.")),
         ("Sepárala en dos",
          ul(["<b>Voluntaria:</b> renuncias. Es la que más dice sobre tu gestión.",
              "<b>Involuntaria:</b> despidos y fin de contrato. Habla más de tu selección.",
              "<b>Temprana:</b> salidas en los primeros 90 días. Si es alta, el problema empieza en la inducción."])),
         ("Cuánto cuesta cada salida",
          p("Casi nadie lo calcula y casi siempre es más de lo que se cree. Suma tres partes:") +
          ol([("El puesto vacío", "El trabajo que se deja de hacer o que otros cubren con horas extra mientras buscas."),
              ("Reponer", "Publicar, entrevistar, inducir: tiempo de jefes y de RR. HH."),
              ("Aprender", "Los meses en que el nuevo rinde menos que el que se fue.")]) +
          p("Con un sueldo de S/ 1 500, 30 días para cubrir el puesto y tres meses de aprendizaje, cada salida puede costar más de un sueldo y medio. Pruébalo con tus números en la calculadora.")),
         ("Qué hacer con el número",
          ol([("Pregunta por qué", "Una entrevista de salida corta a cada persona que se va. Suma las causas cada trimestre."),
              ("Mira los primeros 90 días", "Si mucha gente se va pronto, refuerza la inducción con un plan de 30, 60 y 90 días."),
              ("Revisa a los supervisores", "La gente suele irse de su jefe directo antes que de la empresa."),
              ("Mide otra vez en seis meses", "Con la misma fórmula, para ver si mejoró.")]))],
        [("¿Qué rotación es normal?", "Depende mucho del rubro: en agroindustria, retail o contact center es más alta que en oficinas. Más útil que compararte con otros es comparar tu empresa consigo misma cada trimestre."),
         ("¿Cuento a los practicantes y temporales?", "Calcúlalos aparte. Mezclarlos con el personal estable distorsiona el número."),
         ("¿Cada cuánto conviene medirla?", "Cada mes para tenerla a la vista y cada trimestre para analizar causas.")],
        "Cómo calcular la rotación de personal y su costo (fórmula y ejemplo)",
        "Fórmula de la rotación de personal, ejemplo con números, cómo separar rotación voluntaria y temprana, y cómo estimar el costo de cada renuncia. Con calculadora gratuita en soles.",
        "Hola Espinoza T, leí la guía de rotación y quiero entender por qué se va mi gente.",
        ("/calculadora-rotacion", "Gratis", "Calculadora del costo de la rotación", "Cuatro datos de tu empresa y ves cuánto te cuesta la rotación al año.", "Calcular"))


# ------------------------------------------------------------------ 3. Clima
def g_clima(B):
    return guide(B, "/guias/como-medir-clima-laboral-pyme", "Medir el clima laboral",
        "Guía · Cultura y clima",
        "Cómo medir el clima laboral en una pyme, paso a paso.",
        "Medir el clima es preguntarle a tu equipo, de forma anónima, cómo vive el trabajo: su jefe, la comunicación, el reconocimiento, la carga y las condiciones. En una pyme bastan 15 a 25 preguntas, una tasa de respuesta alta y, sobre todo, devolver resultados y hacer algo con ellos.",
        [("Antes de preguntar",
          ul(["Decide qué harás con los resultados. Si no piensas cambiar nada, mejor no preguntes.",
              "Garantiza el anonimato de verdad: con equipos chicos, no muestres resultados de grupos de menos de 5 personas.",
              "Cuenta al equipo para qué es y cuándo verá los resultados."])),
         ("Qué preguntar",
          p("Una encuesta corta y clara funciona mejor que una de 80 preguntas. Cubre estas áreas:") +
          ul(["Relación con el jefe directo", "Comunicación y claridad de lo que se espera", "Reconocimiento", "Carga de trabajo y horarios",
              "Condiciones y herramientas", "Compañerismo", "Oportunidades de aprender y crecer", "Una pregunta abierta: «¿Qué cambiarías primero?»"])),
         ("Cómo aplicarla",
          ol([("Elige el momento", "Lejos de cierres, gratificaciones o despidos recientes, que distorsionan las respuestas."),
              ("Facilita responder", "Celular, papel en planta o ambos. Apunta a que responda al menos el 70 % del equipo."),
              ("Dale una semana", "Con un recordatorio a mitad de semana.")])),
         ("Lo que más importa: devolver",
          p("El error más común es medir y quedarse callado. A las pocas semanas, comparte con el equipo tres cosas que salieron bien, tres que hay que mejorar y qué se va a hacer con cada una. Esa primera medición es tu línea base: la siguiente, en 12 meses, te dirá si mejoraste.")),
         ("Qué no es una encuesta de clima",
          p("No es una evaluación psicológica de las personas ni un test de personalidad. Mide cómo el equipo percibe su trabajo, de forma anónima y agrupada."))],
        [("¿Cada cuánto se mide el clima?", "Una medición completa al año y, si quieres, pulsos cortos de 5 preguntas cada trimestre."),
         ("¿Puedo hacerla yo mismo?", "Sí. Lo difícil no es la encuesta, es que el equipo confíe en el anonimato y que los resultados lleven a acciones. Por eso a veces conviene alguien externo."),
         ("¿Qué hago si salen resultados malos?", "Agradecer la honestidad, priorizar dos o tres temas y contar qué se va a hacer. Un mal resultado bien gestionado mejora la confianza.")],
        "Cómo medir el clima laboral en una pyme: guía paso a paso",
        "Guía práctica para medir el clima laboral en una pequeña o mediana empresa: qué preguntar, cómo garantizar el anonimato, cómo aplicar la encuesta y cómo devolver resultados.",
        "Hola Espinoza T, leí la guía de clima laboral y quiero medir el clima de mi empresa.",
        ("/servicios/clima-y-cultura", "Servicio", "Clima y cultura", "Medición con línea base, devolución al equipo y plan de acción.", "Ver el servicio"))


# ------------------------------------------------------------------ 4. Inducción
def g_induccion(B):
    return guide(B, "/guias/plan-de-induccion-30-60-90-dias", "Inducción 30-60-90",
        "Guía · Ingreso de personal",
        "Plan de inducción de 30, 60 y 90 días para el personal nuevo.",
        "Una buena inducción no es una charla el primer día: es un plan de tres meses con metas claras, un responsable y conversaciones de seguimiento a los 30, 60 y 90 días. Reduce las renuncias tempranas y acorta el tiempo en que el nuevo empieza a rendir.",
        [("Antes del primer día",
          ul(["Puesto, herramientas y accesos listos", "Un compañero «padrino» asignado", "El jefe directo sabe que llega y tiene una hora reservada para recibirlo"])),
         ("Los primeros 30 días: conocer",
          ul(["Bienvenida del jefe directo, no solo de RR. HH.", "Qué se espera de él, por escrito y en palabras simples",
              "Normas, seguridad y capacitaciones obligatorias (incluida la de hostigamiento sexual al ingresar)", "Conversación de seguimiento al día 30: ¿qué te sorprendió? ¿qué te falta?"])),
         ("Del día 31 al 60: hacer",
          ul(["Tareas reales con acompañamiento", "Retroalimentación semanal corta", "Conversación del día 60: avances y ajustes"])),
         ("Del día 61 al 90: rendir",
          ul(["Autonomía en las tareas principales", "Metas del puesto acordadas para los meses siguientes", "Conversación del día 90: ¿se queda? ¿qué necesita para crecer?"])),
         ("Una plantilla para empezar",
          ol([("Escribe el plan una vez por puesto", "Las metas de cada etapa y quién acompaña."),
              ("Agenda las tres conversaciones", "El día que entra, ya deben estar en el calendario del jefe."),
              ("Revisa al trimestre", "¿Cuántos ingresos llegaron al día 90? Ese número te dice si tu inducción funciona.")]))],
        [("¿Sirve en una empresa pequeña?", "Sí, y más: en una pyme cada salida temprana duele más. El plan puede ser de una página."),
         ("¿Quién debe hacer la inducción?", "El jefe directo, con apoyo de RR. HH. Si solo la hace RR. HH., el nuevo no siente que su jefe lo espera."),
         ("¿Y si el nuevo no encaja?", "Las conversaciones de 30 y 60 días te lo dirán a tiempo, mientras todavía hay espacio para corregir.")],
        "Plan de inducción 30-60-90 días para personal nuevo (con plantilla)",
        "Cómo armar un plan de inducción de 30, 60 y 90 días para el personal nuevo: qué hacer antes del primer día, metas por etapa y conversaciones de seguimiento. Para reducir renuncias tempranas.",
        "Hola Espinoza T, leí la guía de inducción y quiero armar el plan para mi empresa.",
        ("/servicios/seleccion-e-induccion", "Servicio", "Selección e inducción", "Perfiles, proceso de ingreso y plan de inducción para tu empresa.", "Ver el servicio"))


# ------------------------------------------------------------------ 5. Supervisores
def g_supervisores(B):
    return guide(B, "/guias/como-formar-supervisores", "Formar supervisores",
        "Guía · Liderazgo",
        "Cómo formar a un supervisor que fue ascendido por ser buen técnico.",
        "La mayoría de supervisores llegan al cargo por ser los mejores en su trabajo técnico, no por saber dirigir gente. Necesitan aprender cuatro cosas concretas: dar instrucciones claras, hacer seguimiento, corregir sin romper la relación y manejar conflictos. Se aprenden practicando, no en una charla.",
        [("Por qué fallan los supervisores nuevos",
          ul(["Siguen haciendo el trabajo técnico en lugar de lograr que el equipo lo haga",
              "No saben corregir a quienes ayer eran sus compañeros",
              "Nadie les dijo qué se espera de ellos como jefes"])),
         ("Las cuatro habilidades básicas",
          ol([("Instrucciones claras", "Qué, para cuándo, con qué calidad, y verificar que se entendió."),
              ("Seguimiento", "Revisar avances sin esperar al final ni estar encima todo el día."),
              ("Retroalimentación", "Corregir la conducta concreta, en privado y a tiempo; reconocer en público."),
              ("Conflictos", "Intervenir temprano, escuchar a ambas partes y cerrar con un acuerdo.")])),
         ("Cómo se aprende de verdad",
          p("Con práctica entre sesiones: una sesión corta por semana, una tarea para aplicar en el turno y revisión de lo que pasó en la siguiente sesión. Los juegos serios y las simulaciones ayudan porque permiten equivocarse sin costo real.")),
         ("Cómo saber si funcionó",
          p("Pregunta al equipo del supervisor antes y 60 a 90 días después: ¿te da instrucciones claras?, ¿te corrige con respeto?, ¿reconoce tu trabajo? Si las respuestas mejoran y la rotación de su equipo baja, funcionó."))],
        [("¿Cuánto dura una formación de supervisores?", "Lo útil es un programa de varias sesiones cortas, separadas una semana, para aplicar entre sesión y sesión."),
         ("¿Sirve un solo taller?", "Para un tema puntual, sí. Para cambiar hábitos de liderazgo, se necesitan varias sesiones con práctica."),
         ("¿Se puede hacer con supervisores de varias empresas?", "Sí, en cohortes abiertas. Compartir casos con otros rubros suele enriquecer la conversación.")],
        "Cómo formar supervisores y mandos medios: guía práctica",
        "Qué necesita aprender un supervisor ascendido por ser buen técnico: instrucciones claras, seguimiento, retroalimentación y manejo de conflictos. Cómo formarlo y cómo medir si funcionó.",
        "Hola Espinoza T, leí la guía de supervisores y quiero formar a los míos.",
        ("/programas/supervisores", "Programa", "Programa de supervisores", "Sesiones prácticas de 3 horas, en tu empresa o en cohorte abierta.", "Ver el programa"))


FUNCS = [g_hostigamiento, g_rotacion, g_clima, g_induccion, g_supervisores]
META = [
    ("/guias/hostigamiento-sexual-obligaciones-empresa", "Qué pide la Ley 27942 sobre hostigamiento sexual", "Las tres capacitaciones, comité o delegado y lo que debe existir por escrito."),
    ("/guias/como-calcular-rotacion-de-personal", "Cómo calcular la rotación de personal y su costo", "La fórmula, un ejemplo y qué hacer con el número."),
    ("/guias/como-medir-clima-laboral-pyme", "Cómo medir el clima laboral en una pyme", "Qué preguntar, cómo cuidar el anonimato y cómo devolver resultados."),
    ("/guias/plan-de-induccion-30-60-90-dias", "Plan de inducción 30-60-90 días", "Qué hacer antes del primer día y en cada etapa."),
    ("/guias/como-formar-supervisores", "Cómo formar supervisores", "Las cuatro habilidades básicas y cómo medir el cambio."),
]


def p_guias(B):
    hero = B.page_hero([("Guías", None)], "Guías gratuitas", "Respuestas claras a lo que más preguntan los gerentes.",
        "Guías cortas y prácticas sobre gestión de personas en empresas peruanas. Sin registro y sin letra chica.",
        '<a class="btn btn-wine" href="#lista">Ver las guías</a><a class="textlink" href="/calculadora-rotacion">Calculadora de rotación</a>')
    cards = '<div class="cards3">' + "".join(B.card(h, "Guía", t, d, "Leer") for h, t, d in META) + \
            B.card("/termometro", "Herramienta", "Termómetro de Riesgo Laboral", "12 preguntas para ver dónde está expuesta tu empresa.", "Hacerlo") + "</div>"
    body = hero + PC.sec("lista-t", "Guías.", cards, sid="lista") + B.cta_band()
    graph = [B.crumbs_ld([("Inicio", "/"), ("Guías", "/guias")]),
             {"@type": "CollectionPage", "name": "Guías de gestión de personas", "url": B.SITE + "/guias", "inLanguage": "es-PE",
              "hasPart": [{"@type": "Article", "headline": t, "url": B.SITE + h} for h, t, _ in META]}]
    return B.page("/guias", "Guías gratuitas de gestión de personas para empresas en Perú",
                  "Guías prácticas sobre hostigamiento sexual laboral, rotación de personal, clima laboral, inducción y formación de supervisores para empresas en Perú.", body, graph)


PAGES = [("/guias", p_guias, True)] + [(h, f, True) for (h, _, _), f in zip(META, FUNCS)]
