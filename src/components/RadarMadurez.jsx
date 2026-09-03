import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import { UNIT_COLORS } from '../data/content.js'

const DIMENSIONS = [
  {
    id: 'seleccion',
    label: 'Selección y Onboarding',
    short: 'Selección',
    icon: '🎯',
    color: UNIT_COLORS[1],
    questions: [
      { id: 's1', text: 'Nuestro proceso de selección identifica consistentemente al candidato correcto para cada puesto.' },
      { id: 's2', text: 'Los nuevos colaboradores cuentan con un plan de onboarding estructurado durante su primer mes.' },
    ],
  },
  {
    id: 'desarrollo',
    label: 'Desarrollo y Capacitación',
    short: 'Desarrollo',
    icon: '📈',
    color: UNIT_COLORS[2],
    questions: [
      { id: 'd1', text: 'Existe un plan de capacitación anual alineado a las necesidades de cada puesto.' },
      { id: 'd2', text: 'Los colaboradores tienen visibilidad clara de su ruta de crecimiento dentro de la empresa.' },
    ],
  },
  {
    id: 'clima',
    label: 'Clima y Cultura',
    short: 'Clima',
    icon: '🤝',
    color: UNIT_COLORS[4],
    questions: [
      { id: 'c1', text: 'Medimos el clima organizacional de forma periódica y actuamos sobre los resultados.' },
      { id: 'c2', text: 'Los colaboradores se sienten cómodos expresando ideas o desacuerdos sin temor.' },
      { id: 'c3', text: 'Existe un sentido de pertenencia y orgullo genuino por trabajar en la empresa.' },
    ],
  },
  {
    id: 'liderazgo',
    label: 'Liderazgo',
    short: 'Liderazgo',
    icon: '🧭',
    color: UNIT_COLORS[5],
    questions: [
      { id: 'l1', text: 'Los líderes de equipo reciben formación en habilidades de gestión de personas.' },
      { id: 'l2', text: 'Los colaboradores confían en las decisiones de sus jefes directos.' },
    ],
  },
  {
    id: 'compliance',
    label: 'Compliance y Normativa Laboral',
    short: 'Compliance',
    icon: '⚖️',
    color: UNIT_COLORS[3],
    questions: [
      { id: 'co1', text: 'Contamos con un Reglamento Interno de Trabajo actualizado y comunicado a todos.' },
      { id: 'co2', text: 'Estamos preparados para una fiscalización de SUNAFIL en cualquier momento.' },
      { id: 'co3', text: 'Los pagos y obligaciones de planilla (AFP, EsSalud, gratificaciones) están 100% al día.' },
    ],
  },
  {
    id: 'retencion',
    label: 'Retención de Talento',
    short: 'Retención',
    icon: '💎',
    color: UNIT_COLORS[6],
    questions: [
      { id: 'r1', text: 'Nuestra tasa de rotación está dentro de rangos saludables para nuestro sector.' },
      { id: 'r2', text: 'Tenemos estrategias claras para retener a los colaboradores de alto desempeño.' },
    ],
  },
]

const TOTAL_QUESTIONS = DIMENSIONS.reduce((sum, d) => sum + d.questions.length, 0)

const RECOMENDACIONES = {
  seleccion: 'Estandariza tu proceso con una ficha de perfil de puesto y una guía de entrevista por competencias, y estructura un plan de onboarding a 30 días.',
  desarrollo: 'Diseña un plan de capacitación anual básico por área y comunica a cada colaborador su posible ruta de crecimiento.',
  clima: 'Implementa una encuesta de clima trimestral corta y comparte los resultados junto con al menos una acción concreta por área.',
  liderazgo: 'Forma a tus líderes de primera línea en comunicación y feedback: son quienes más influyen en la experiencia diaria del equipo.',
  compliance: 'Actualiza tu Reglamento Interno de Trabajo y revisa el estado de tus obligaciones laborales antes de que llegue una fiscalización.',
  retencion: 'Identifica a tus colaboradores clave y diseña al menos un incentivo o ruta de desarrollo pensado específicamente para ellos.',
}

const LIKERT = [
  { value: 1, label: 'Muy en desacuerdo' },
  { value: 2, label: 'En desacuerdo' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'De acuerdo' },
  { value: 5, label: 'Totalmente de acuerdo' },
]

function calculateScores(answers) {
  return DIMENSIONS.map((d) => {
    const values = d.questions.map((q) => answers[q.id])
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    return {
      id: d.id,
      dimension: d.label,
      shortLabel: d.short,
      color: d.color,
      score: Math.round((avg / 5) * 100),
    }
  })
}

function getOverallLevel(overall) {
  if (overall < 40) return { level: 'Inicial', color: 'text-red-600' }
  if (overall < 60) return { level: 'En Desarrollo', color: 'text-amber-600' }
  if (overall < 80) return { level: 'Establecida', color: 'text-brand-navy' }
  return { level: 'Madura', color: 'text-emerald-600' }
}

export default function RadarMadurez() {
  const [step, setStep] = useState('start') // start, quiz, result
  const [dimIndex, setDimIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [contactData, setContactData] = useState({ nombre: '', email: '', empresa: '' })
  const [loading, setLoading] = useState(false)
  const [unlocked, setUnlocked] = useState(false)

  const handleAnswer = (questionId, value) => {
    setAnswers((a) => ({ ...a, [questionId]: value }))
  }

  const answeredCount = Object.keys(answers).length
  const dimension = DIMENSIONS[dimIndex]
  const dimAnswered = dimension?.questions.every((q) => answers[q.id] !== undefined)

  const goNext = () => {
    if (dimIndex < DIMENSIONS.length - 1) {
      setDimIndex((i) => i + 1)
    } else {
      setStep('result')
    }
  }

  const goBack = () => {
    if (dimIndex > 0) setDimIndex((i) => i - 1)
  }

  const scores = step === 'result' ? calculateScores(answers) : []
  const overall = scores.length ? Math.round(scores.reduce((a, s) => a + s.score, 0) / scores.length) : 0
  const overallLevel = getOverallLevel(overall)
  const weakest = scores.length ? [...scores].sort((a, b) => a.score - b.score)[0] : null
  const strongest = scores.length ? [...scores].sort((a, b) => b.score - a.score)[0] : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!contactData.nombre || !contactData.email || !contactData.empresa) {
      alert('Por favor completa todos los campos')
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append('nombre', contactData.nombre)
    formData.append('email', contactData.email)
    formData.append('empresa', contactData.empresa)
    formData.append('herramienta', 'Radar 360° - Diagnóstico de Madurez Organizacional')
    formData.append('indice_general', `${overallLevel.level} (${overall}%)`)
    scores.forEach((s) => formData.append(`dimension_${s.id}`, `${s.dimension}: ${s.score}%`))
    formData.append('_subject', `Nuevo Radar 360°: ${contactData.empresa}`)

    try {
      await fetch('https://formspree.io/f/myzklpzn', {
        method: 'POST',
        body: formData,
      })
      setUnlocked(true)
    } catch (error) {
      alert('Error enviando el formulario. Intenta de nuevo.')
    }
    setLoading(false)
  }

  const restart = () => {
    setStep('start')
    setDimIndex(0)
    setAnswers({})
    setContactData({ nombre: '', email: '', empresa: '' })
    setUnlocked(false)
  }

  if (step === 'start') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <span className="inline-block rounded-full bg-brand-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-brand-gold-dark">
            Herramienta insignia
          </span>
          <h2 className="mt-4 text-3xl font-bold text-brand-navy sm:text-4xl">
            📡 Radar 360°: Diagnóstico de Madurez Organizacional
          </h2>
          <p className="mt-4 text-brand-ink-soft">
            14 preguntas, 6 dimensiones clave de la gestión de personas. Al final
            verás un mapa visual de tu empresa y sabrás exactamente dónde enfocar
            tus próximos pasos.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {DIMENSIONS.map((d) => (
            <div
              key={d.id}
              className="flex flex-col items-center gap-1.5 rounded-lg bg-white p-4 text-center ring-1 ring-brand-navy/5 shadow-card"
            >
              <span className="text-2xl">{d.icon}</span>
              <span className="text-xs font-semibold text-brand-navy">{d.short}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setStep('quiz')}
            className="px-10 py-4 bg-brand-gold text-white rounded-lg font-semibold shadow-card-hover hover:bg-brand-gold-dark transition-colors duration-300"
          >
            Comenzar diagnóstico (8 min)
          </motion.button>
          <p className="mt-3 text-xs text-brand-ink-soft">
            Recibirás un reporte visual completo con recomendaciones.
          </p>
        </div>
      </motion.div>
    )
  }

  if (step === 'quiz') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-brand-navy">Progreso general</span>
            <span className="text-sm text-brand-ink-soft">{answeredCount}/{TOTAL_QUESTIONS}</span>
          </div>
          <div className="w-full bg-brand-navy/10 rounded-full h-2">
            <motion.div
              className="bg-brand-gold h-2 rounded-full"
              animate={{ width: `${(answeredCount / TOTAL_QUESTIONS) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            {DIMENSIONS.map((d, i) => (
              <span
                key={d.id}
                className="h-2 w-2 rounded-full transition-colors duration-300"
                style={{ backgroundColor: i <= dimIndex ? d.color : '#1B2A4A1A' }}
                title={d.label}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={dimension.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-5 flex items-center gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-lg text-2xl"
                style={{ backgroundColor: `${dimension.color}1A` }}
              >
                {dimension.icon}
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink-soft">
                  Dimensión {dimIndex + 1} de {DIMENSIONS.length}
                </p>
                <h3 className="text-lg font-bold text-brand-navy">{dimension.label}</h3>
              </div>
            </div>

            <div className="space-y-5">
              {dimension.questions.map((q) => (
                <div key={q.id} className="bg-white p-6 rounded-lg ring-1 ring-brand-navy/5 shadow-card">
                  <h4 className="font-semibold text-brand-navy mb-4">{q.text}</h4>
                  <div className="flex justify-between gap-2">
                    {LIKERT.map((opt) => (
                      <motion.button
                        key={opt.value}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAnswer(q.id, opt.value)}
                        title={opt.label}
                        className={`flex-1 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                          answers[q.id] === opt.value
                            ? 'text-white'
                            : 'bg-brand-cream text-brand-ink hover:bg-brand-navy/10'
                        }`}
                        style={answers[q.id] === opt.value ? { backgroundColor: dimension.color } : undefined}
                      >
                        {opt.value}
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-brand-ink-soft mt-2">
                    <span>Muy en desacuerdo</span>
                    <span>Totalmente de acuerdo</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex gap-3">
          {dimIndex > 0 && (
            <motion.button
              whileHover={{ x: -3 }}
              onClick={goBack}
              className="px-6 py-3 rounded-lg font-semibold text-brand-navy ring-1 ring-brand-navy/15 hover:bg-brand-navy/5 transition-colors duration-200"
            >
              ← Anterior
            </motion.button>
          )}
          <motion.button
            whileHover={dimAnswered ? { scale: 1.02 } : {}}
            whileTap={dimAnswered ? { scale: 0.98 } : {}}
            onClick={goNext}
            disabled={!dimAnswered}
            className="flex-1 px-8 py-3 bg-brand-navy text-white rounded-lg font-semibold shadow-card hover:bg-brand-navy-soft hover:shadow-card-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-300"
          >
            {dimIndex < DIMENSIONS.length - 1 ? 'Siguiente dimensión →' : 'Ver mi Radar 360°'}
          </motion.button>
        </div>
      </motion.div>
    )
  }

  // step === 'result'
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl mx-auto p-6">
      <div className="text-center mb-6">
        <p className="text-brand-ink-soft text-sm mb-2">Tu Índice General de Madurez:</p>
        <h2 className={`text-5xl font-bold ${overallLevel.color}`}>{overall}%</h2>
        <p className={`mt-1 text-lg font-semibold ${overallLevel.color}`}>{overallLevel.level}</p>
      </div>

      <div className="relative">
        <div className={unlocked ? '' : 'pointer-events-none select-none blur-md'}>
          <div className="bg-white p-4 rounded-lg ring-1 ring-brand-navy/5 shadow-card sm:p-6">
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={scores} outerRadius="72%">
                <PolarGrid stroke="#1B2A4A22" />
                <PolarAngleAxis dataKey="shortLabel" tick={{ fill: '#5B5347', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#5B534799', fontSize: 10 }} tickCount={5} />
                <Radar dataKey="score" stroke="#6E2438" fill="#6E2438" fillOpacity={0.35} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {scores.map((s) => (
              <div key={s.id} className="rounded-lg bg-white p-3 text-center ring-1 ring-brand-navy/5 shadow-card">
                <p className="text-xs text-brand-ink-soft">{s.shortLabel}</p>
                <p className="text-xl font-bold" style={{ color: s.color }}>{s.score}%</p>
              </div>
            ))}
          </div>

          {weakest && strongest && (
            <div className="mt-6 space-y-3">
              <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-5">
                <p className="text-sm font-bold text-red-700">
                  📉 Tu área con mayor oportunidad de mejora: {weakest.dimension} ({weakest.score}%)
                </p>
                <p className="mt-1.5 text-sm text-brand-ink">{RECOMENDACIONES[weakest.id]}</p>
              </div>
              <div className="rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-5">
                <p className="text-sm font-bold text-emerald-700">
                  📈 Tu mayor fortaleza: {strongest.dimension} ({strongest.score}%)
                </p>
                <p className="mt-1.5 text-sm text-brand-ink">
                  Sigue documentando y sosteniendo lo que haces bien aquí: es una base sobre la que puedes construir las demás dimensiones.
                </p>
              </div>
            </div>
          )}
        </div>

        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="max-w-xs rounded-lg bg-white/95 p-6 text-center shadow-card-hover ring-1 ring-brand-navy/10">
              <span className="text-3xl">🔒</span>
              <p className="mt-2 text-sm font-bold text-brand-navy">
                Completa tus datos para desbloquear tu Radar 360° completo
              </p>
              <p className="mt-1 text-xs text-brand-ink-soft">
                Con el detalle por dimensión y tus recomendaciones.
              </p>
            </div>
          </div>
        )}
      </div>

      {!unlocked ? (
        <form onSubmit={handleSubmit} className="mt-8 bg-brand-cream p-6 rounded-lg">
          <h3 className="font-semibold text-brand-navy mb-4">📩 Desbloquea tu reporte completo:</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Tu nombre"
              value={contactData.nombre}
              onChange={(e) => setContactData({ ...contactData, nombre: e.target.value })}
              className="w-full px-4 py-2 border border-brand-navy/15 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold transition-shadow"
            />
            <input
              type="email"
              placeholder="Tu email"
              value={contactData.email}
              onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
              className="w-full px-4 py-2 border border-brand-navy/15 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold transition-shadow"
            />
            <input
              type="text"
              placeholder="Nombre de tu empresa"
              value={contactData.empresa}
              onChange={(e) => setContactData({ ...contactData, empresa: e.target.value })}
              className="w-full px-4 py-2 border border-brand-navy/15 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold transition-shadow"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-brand-gold text-white rounded-lg font-semibold shadow-card hover:bg-brand-gold-dark hover:shadow-card-hover disabled:opacity-50 transition-colors duration-300"
            >
              {loading ? 'Generando reporte...' : '🔓 Desbloquear mi Radar 360°'}
            </motion.button>
          </div>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-lg bg-emerald-50 p-5 text-center ring-1 ring-emerald-200"
        >
          <p className="text-sm font-semibold text-emerald-700">
            ✅ Reporte desbloqueado. También lo enviamos a tu email.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={restart}
            className="mt-4 text-sm font-semibold text-brand-gold-dark hover:text-brand-navy transition-colors duration-200"
          >
            ↺ Repetir diagnóstico
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}
