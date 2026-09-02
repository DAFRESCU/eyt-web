export const UNIT_COLORS = [
  '#6E2438', // U1 gold/vino
  '#C98A2B', // U2 ocre
  '#3E7A5D', // U3 salvia
  '#B65330', // U4 terracota
  '#1F5C73', // U5 petroleo
  '#6B3557', // U6 ciruela
  '#6B7A3E', // U7 oliva
]

export const SERVICES = [
  {
    id: 'U1',
    name: 'Estrategia y Diseño Organizacional',
    short: 'MOF, organigramas, OKRs y KPIs, planeamiento estratégico',
    price: 'Desde S/ 600',
    color: UNIT_COLORS[0],
    detail:
      'Diseñamos la estructura que tu empresa necesita para crecer con orden: manuales de organización y funciones (MOF), organigramas claros, definición de objetivos y KPIs, y planeamiento estratégico alineado a tu realidad operativa.',
    deliverables: [
      'Manual de Organización y Funciones (MOF)',
      'Organigrama actualizado y validado',
      'Matriz de OKRs y KPIs por área',
      'Plan estratégico a 12-24 meses',
    ],
  },
  {
    id: 'U2',
    name: 'Atracción y Gestión del Talento',
    short: 'Reclutamiento, selección, assessment, onboarding',
    price: 'Desde S/ 400 / plaza',
    color: UNIT_COLORS[1],
    detail:
      'Cubrimos todo el ciclo de atracción de talento: publicación y búsqueda, filtrado, entrevistas, assessment de competencias y un proceso de onboarding que asegura que la persona correcta llegue y se quede.',
    deliverables: [
      'Perfil de puesto y ficha de convocatoria',
      'Terna de candidatos evaluados',
      'Informe de assessment por competencias',
      'Plan de onboarding a 30 días',
    ],
  },
  {
    id: 'U3',
    name: 'Formación y Desarrollo',
    short: 'Liderazgo, comunicación, evaluaciones, planes de sucesión',
    price: 'Desde S/ 500 / taller',
    color: UNIT_COLORS[2],
    detail:
      'Desarrollamos las capacidades de tus equipos con talleres prácticos de liderazgo y comunicación, evaluaciones de desempeño objetivas y planes de sucesión para asegurar la continuidad del negocio.',
    deliverables: [
      'Taller de liderazgo o comunicación (a medida)',
      'Formato y proceso de evaluación de desempeño',
      'Plan de sucesión para posiciones clave',
      'Reporte de resultados y recomendaciones',
    ],
  },
  {
    id: 'U4',
    name: 'Bienestar y Gestión Social y Comunitaria',
    short: 'EsSalud, casos sociales, RSC y sostenibilidad',
    price: '% de éxito o suscripción mensual',
    color: UNIT_COLORS[3],
    detail:
      'Gestionamos el bienestar de tus colaboradores y la relación de tu empresa con su entorno: trámites y casos ante EsSalud, atención de casos sociales, y programas de responsabilidad social y sostenibilidad.',
    deliverables: [
      'Gestión y seguimiento de casos EsSalud',
      'Protocolo de atención de casos sociales',
      'Programa de RSC / sostenibilidad',
      'Reporte mensual de indicadores',
    ],
  },
  {
    id: 'U5',
    name: 'Cultura y Experiencia Organizacional',
    short: 'Diagnóstico de clima, employee experience, reconocimiento',
    price: 'Desde S/ 700',
    color: UNIT_COLORS[4],
    detail:
      'Medimos y transformamos la cultura de tu empresa: diagnóstico de clima laboral, diseño de experiencia del colaborador (employee experience) y programas de reconocimiento que retienen talento.',
    deliverables: [
      'Encuesta y diagnóstico de clima laboral',
      'Mapa de experiencia del colaborador',
      'Programa de reconocimiento',
      'Plan de acción priorizado',
    ],
  },
  {
    id: 'U6',
    name: 'Cumplimiento y Auditoría Laboral',
    short: 'Diagnóstico normativo básico, Reglamento Interno',
    price: 'Desde S/ 700',
    color: UNIT_COLORS[5],
    detail:
      'Reducimos tu riesgo legal: diagnóstico normativo básico de cumplimiento laboral y elaboración o actualización del Reglamento Interno de Trabajo (RIT), listos para fiscalización.',
    deliverables: [
      'Diagnóstico normativo laboral básico',
      'Reglamento Interno de Trabajo (RIT)',
      'Checklist de cumplimiento SUNAFIL',
      'Recomendaciones priorizadas por riesgo',
    ],
  },
  {
    id: 'U7',
    name: 'Programa de Liderazgo Público',
    short: 'Funcionarios y regidores, gestión municipal y gobernanza',
    price: 'Cotización según alcance',
    color: UNIT_COLORS[6],
    detail:
      'Formamos a funcionarios y regidores en gestión municipal y gobernanza pública, con un enfoque práctico orientado a resultados para la gestión del talento en el sector público.',
    deliverables: [
      'Programa de formación a medida',
      'Material y casos aplicados a gestión pública',
      'Sesiones de acompañamiento',
      'Informe de cierre del programa',
    ],
  },
]

export const PAIN_POINTS = [
  'Todos hacen lo que quieren, no hay orden.',
  'Contrato gente y me sale mal cada vez.',
  'Tengo miedo de una fiscalización laboral.',
]

export const PROCESO = [
  {
    number: '01',
    title: 'Diagnóstico',
    description: 'Sin costo, 45 min.',
    color: UNIT_COLORS[0],
  },
  {
    number: '02',
    title: 'Propuesta',
    description: 'En 48 horas.',
    color: UNIT_COLORS[1],
  },
  {
    number: '03',
    title: 'Ejecución',
    description: 'Presencial o remota.',
    color: UNIT_COLORS[4],
  },
  {
    number: '04',
    title: 'Entregables',
    description: 'Documentos editables.',
    color: UNIT_COLORS[3],
  },
  {
    number: '05',
    title: 'Seguimiento',
    description: 'Revisión a 30 días.',
    color: UNIT_COLORS[5],
  },
]

export const POR_QUE_ET = [
  'Trabajamos desde la experiencia real de gestionar personas, no desde la teoría.',
  'Precio referencial claro desde el inicio. Sin sorpresas ni cobros ocultos.',
  'Documentos listos para usar, no plantillas genéricas.',
  'Atendemos en Arequipa, Cusco, Ica y provincias, presencial o remoto.',
]

export const CONTACT = {
  phone: '+51 974 770 954',
  phoneHref: '+51974770954',
  email: 'danielfrancoespinozacuadra@gmail.com',
  locations: ['Arequipa', 'Cusco', 'Ica'],
}

export const BLOG_POSTS = [
  {
    id: 1,
    slug: 'madurez-rrhh',
    título: '5 Señales de que tu área de RR.HH. necesita madurar',
    descripción: 'Identifica si tu gestión de personas es reactiva o estratégica. Descubre cómo evolucionar.',
    fecha: '15 Ago 2026',
    autor: 'E&T Consultores',
    categoría: 'RR.HH.',
    tiempo_lectura: '5 min',
    contenido: [
      'Muchas empresas en crecimiento siguen gestionando a su personal con procesos improvisados: contratos verbales, planillas armadas al último minuto y decisiones de personal que dependen del ánimo del día. Si esto te suena familiar, tu área de RR.HH. probablemente todavía es reactiva en lugar de estratégica.',
      'La primera señal es que apagas incendios en vez de prevenirlos: renuncias sorpresivas, conflictos que escalan sin protocolo y contrataciones urgentes que terminan en malas contrataciones. La segunda es la falta de indicadores: si no sabes tu tasa de rotación, tu costo por contratación o tu clima laboral con datos concretos, estás gestionando a ciegas.',
      'La tercera señal es la ausencia de documentos base como el MOF o un organigrama actualizado, lo que genera confusión sobre roles y responsabilidades. La cuarta es que el líder de RR.HH. (si existe) dedica el 90% de su tiempo a trámites administrativos y no a estrategia. Y la quinta es el riesgo legal acumulado: reglamentos internos desactualizados o inexistentes, y cero preparación ante una fiscalización de SUNAFIL.',
      'La buena noticia es que madurar el área no requiere una transformación de un día para otro. Empieza por levantar un diagnóstico honesto, definir 3 a 5 indicadores clave y ordenar la documentación base. Con esos pasos, tu gestión de personas deja de ser reactiva y empieza a sostener el crecimiento del negocio en vez de frenarlo.',
    ],
  },
  {
    id: 2,
    slug: 'rotacion-talento',
    título: '¿Cuánto te cuesta realmente la rotación de personal?',
    descripción: 'Análisis del costo total de rotación y estrategias para reducirla. Datos y casos reales.',
    fecha: '10 Ago 2026',
    autor: 'E&T Consultores',
    categoría: 'Talento',
    tiempo_lectura: '7 min',
    contenido: [
      'Cuando alguien renuncia, el costo visible es el sueldo de un mes sin producir mientras se busca reemplazo. Pero ese es apenas el 20% del costo real. El costo total de la rotación incluye el tiempo del equipo en el proceso de selección, la curva de aprendizaje del nuevo colaborador, la pérdida de productividad del equipo mientras se cubre la vacante, y en muchos casos, el conocimiento y las relaciones con clientes que se van con la persona que renuncia.',
      'En nuestra experiencia acompañando empresas en Arequipa, Cusco e Ica, el costo total de reemplazar a un colaborador operativo puede equivaler a 3 a 6 meses de su sueldo, y para posiciones de mando puede llegar a 9 o 12 meses. Esto rara vez se mide porque no aparece como una sola línea en el estado de resultados, sino disperso entre horas de gerencia, capacitación y productividad perdida.',
      'Las causas más comunes de rotación evitable que encontramos son: procesos de selección apurados que no validan el ajuste cultural, ausencia de un plan de onboarding estructurado, líderes sin herramientas de gestión de personas, y falta de claridad sobre las expectativas del puesto desde el día uno.',
      'Reducir la rotación no significa retener a todos a toda costa, sino reducir la rotación evitable: la de las personas correctas que se van por razones que la empresa podía haber prevenido. Un buen punto de partida es medir tu tasa de rotación actual, segmentarla por área y antigüedad, y comparar el costo de un buen proceso de selección y onboarding contra el costo de seguir reemplazando gente cada pocos meses.',
    ],
  },
  {
    id: 3,
    slug: 'clima-organizacional',
    título: 'Cómo medir y mejorar el clima organizacional',
    descripción: 'Guía completa para entender el climate laboral de tu empresa y crear plan de acción.',
    fecha: '05 Ago 2026',
    autor: 'E&T Consultores',
    categoría: 'Cultura',
    tiempo_lectura: '8 min',
    contenido: [
      'El clima organizacional es la percepción compartida que tienen los colaboradores sobre su ambiente de trabajo: cómo se sienten tratados, qué tan claras son las reglas, y qué tan cómodos están para expresar ideas o desacuerdos. A diferencia de la cultura (que son los valores y comportamientos de fondo), el clima es más cambiante y se puede medir con relativa facilidad en el corto plazo.',
      'Medir el clima requiere ir más allá de la intuición del gerente o de conversaciones informales de pasillo. Una encuesta anónima y bien diseñada, con preguntas sobre liderazgo, comunicación, reconocimiento, condiciones de trabajo y proyección de carrera, entrega datos concretos que puedes comparar en el tiempo y por área.',
      'Un error común es aplicar la encuesta y no hacer nada con los resultados. Esto genera el efecto contrario: los colaboradores sienten que su opinión no importa y el clima empeora. Por eso, cada medición debe ir seguida de una devolución de resultados al equipo y un plan de acción concreto con responsables y fechas, aunque sea con 2 o 3 iniciativas priorizadas.',
      'Las acciones que más impacto tienen suelen ser las más simples: mejorar la comunicación de las decisiones que afectan al equipo, dar reconocimiento específico y oportuno (no solo en la fiesta de fin de año), y capacitar a los líderes de primera línea, que son quienes más influyen en la experiencia diaria de cada colaborador. Medir el clima una vez al año como trámite no genera cambio; medirlo, actuar y volver a medir sí.',
    ],
  },
]

export const NAV_LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Servicios', to: '/servicios' },
  { label: 'Herramientas', to: '/herramientas' },
  { label: 'Blog', to: '/blog' },
  { label: 'Cómo Trabajamos', to: '/#como-trabajamos' },
  { label: 'Por qué E&T', to: '/#por-que-et' },
  { label: 'Contacto', to: '/contacto' },
]
