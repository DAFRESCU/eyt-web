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

export const NAV_LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Servicios', to: '/servicios' },
  { label: 'Cómo Trabajamos', to: '/#como-trabajamos' },
  { label: 'Por qué E&T', to: '/#por-que-et' },
  { label: 'Contacto', to: '/contacto' },
]
