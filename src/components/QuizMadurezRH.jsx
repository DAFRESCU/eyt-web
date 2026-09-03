import { useState } from 'react'
import { motion } from 'framer-motion'

export default function QuizMadurezRH() {
  const [step, setStep] = useState('start') // start, quiz, result
  const [answers, setAnswers] = useState({})
  const [contactData, setContactData] = useState({ nombre: '', email: '', empresa: '' })
  const [loading, setLoading] = useState(false)

  const questions = [
    {
      id: 1,
      question: '¿Tiene tu empresa un área de RR.HH. dedicada?',
      options: [
        { value: 0, text: 'No existe' },
        { value: 1, text: 'Existe pero es muy básica' },
        { value: 2, text: 'Existe y funciona bien' },
        { value: 3, text: 'Existe, funciona bien y es estratégica' }
      ]
    },
    {
      id: 2,
      question: '¿Tienen documentados los procesos de selección y onboarding?',
      options: [
        { value: 0, text: 'No hay procesos formales' },
        { value: 1, text: 'Hay procesos pero no documentados' },
        { value: 2, text: 'Documentados y ejecutados ocasionalmente' },
        { value: 3, text: 'Documentados, optimizados y siempre se usan' }
      ]
    },
    {
      id: 3,
      question: '¿Realizan evaluaciones de desempeño periódicas?',
      options: [
        { value: 0, text: 'No' },
        { value: 1, text: 'Ocasionalmente' },
        { value: 2, text: 'Anualmente' },
        { value: 3, text: 'Trimestralmente con planes de desarrollo' }
      ]
    },
    {
      id: 4,
      question: '¿Tienen un plan de capacitación y desarrollo para colaboradores?',
      options: [
        { value: 0, text: 'No existe' },
        { value: 1, text: 'Capacitación reactiva (cuando hay problema)' },
        { value: 2, text: 'Plan anual básico' },
        { value: 3, text: 'Plan integral y personalizado por cargo' }
      ]
    },
    {
      id: 5,
      question: '¿Miden el clima organizacional o satisfacción de empleados?',
      options: [
        { value: 0, text: 'No se mide' },
        { value: 1, text: 'Se pregunta informalmente' },
        { value: 2, text: 'Encuesta anual' },
        { value: 3, text: 'Mediciones frecuentes + análisis de resultados' }
      ]
    },
    {
      id: 6,
      question: '¿Tienen un Reglamento Interno actualizado?',
      options: [
        { value: 0, text: 'No existe' },
        { value: 1, text: 'Existe pero está desactualizado' },
        { value: 2, text: 'Actualizado y documentado' },
        { value: 3, text: 'Actualizado, comunicado y auditado regularmente' }
      ]
    },
    {
      id: 7,
      question: '¿Tienen políticas de beneficios y bienestar documentadas?',
      options: [
        { value: 0, text: 'No existen' },
        { value: 1, text: 'Existen informalmente' },
        { value: 2, text: 'Documentadas pero básicas' },
        { value: 3, text: 'Documentadas, integrales y comunicadas' }
      ]
    },
    {
      id: 8,
      question: '¿Qué tan alineados están los colaboradores con la visión de la empresa?',
      options: [
        { value: 0, text: 'Poco alineados' },
        { value: 1, text: 'Medianamente alineados' },
        { value: 2, text: 'Bien alineados' },
        { value: 3, text: 'Totalmente alineados y comprometidos' }
      ]
    }
  ]

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value })
  }

  const calculateScore = () => {
    const total = Object.values(answers).reduce((a, b) => a + b, 0)
    const maxScore = questions.length * 3
    const percentage = (total / maxScore) * 100
    return { total, maxScore, percentage }
  }

  const getLevel = (percentage) => {
    if (percentage < 25) return { level: 'Inicial', color: 'text-red-600', bg: 'bg-red-50' }
    if (percentage < 50) return { level: 'En Desarrollo', color: 'text-amber-600', bg: 'bg-amber-50' }
    if (percentage < 75) return { level: 'Establecida', color: 'text-brand-navy', bg: 'bg-brand-cream' }
    return { level: 'Madura', color: 'text-emerald-600', bg: 'bg-emerald-50' }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!contactData.nombre || !contactData.email || !contactData.empresa) {
      alert('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    const score = calculateScore()
    const levelData = getLevel(score.percentage)

    const formData = new FormData()
    formData.append('nombre', contactData.nombre)
    formData.append('email', contactData.email)
    formData.append('empresa', contactData.empresa)
    formData.append('herramienta', 'Quiz Madurez RR.HH.')
    formData.append('resultado', `${levelData.level} (${score.percentage.toFixed(0)}%)`)
    formData.append('_subject', `Nuevo resultado: Quiz Madurez RR.HH. - ${contactData.empresa}`)

    try {
      await fetch('https://formspree.io/f/myzklpzn', {
        method: 'POST',
        body: formData
      })
      alert('✅ Resultado enviado a tu email. Nos contactaremos pronto.')
      setStep('start')
      setAnswers({})
      setContactData({ nombre: '', email: '', empresa: '' })
    } catch (error) {
      alert('Error enviando el formulario. Intenta de nuevo.')
    }
    setLoading(false)
  }

  if (step === 'start') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-brand-navy mb-4">🎯 Quiz: Madurez de tu área RR.HH.</h2>
          <p className="text-brand-ink-soft mb-6">
            Descubre en qué nivel se encuentra la gestión de personas en tu empresa.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setStep('quiz')}
            className="px-8 py-3 bg-brand-gold text-white rounded-lg font-semibold shadow-card hover:bg-brand-gold-dark hover:shadow-card-hover transition-colors duration-300"
          >
            Comenzar Quiz (5 min)
          </motion.button>
        </div>
        <div className="bg-brand-cream p-6 rounded-lg text-sm text-brand-ink space-y-1">
          <p>✓ 8 preguntas rápidas</p>
          <p>✓ Resultado personalizado</p>
          <p>✓ Recomendaciones específicas</p>
        </div>
      </motion.div>
    )
  }

  if (step === 'quiz') {
    const answeredCount = Object.keys(answers).length
    const isComplete = answeredCount === questions.length

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-brand-navy">Progreso</span>
            <span className="text-sm text-brand-ink-soft">{answeredCount}/{questions.length}</span>
          </div>
          <div className="w-full bg-brand-navy/10 rounded-full h-2">
            <motion.div
              className="bg-brand-gold h-2 rounded-full"
              animate={{ width: `${(answeredCount / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            ></motion.div>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((q, idx) => (
            <motion.div key={q.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: idx * 0.05 }} className="bg-white p-6 rounded-lg ring-1 ring-brand-navy/5 shadow-card">
              <h3 className="font-semibold text-brand-navy mb-4">{q.question}</h3>
              <div className="space-y-2">
                {q.options.map(opt => (
                  <label key={opt.value} className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ring-1 ${
                    answers[q.id] === opt.value ? 'bg-brand-gold/10 ring-brand-gold' : 'ring-brand-navy/10 hover:bg-brand-cream'
                  }`}>
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      value={opt.value}
                      checked={answers[q.id] === opt.value}
                      onChange={() => handleAnswer(q.id, opt.value)}
                      className="mr-3 accent-brand-gold"
                    />
                    <span className="text-brand-ink">{opt.text}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {isComplete && (
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setStep('result')}
            className="w-full mt-8 px-8 py-3 bg-brand-navy text-white rounded-lg font-semibold shadow-card hover:bg-brand-navy-soft hover:shadow-card-hover transition-colors duration-300"
          >
            Ver mi resultado
          </motion.button>
        )}
      </motion.div>
    )
  }

  if (step === 'result') {
    const score = calculateScore()
    const levelData = getLevel(score.percentage)

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl mx-auto p-6">
        <div className={`${levelData.bg} p-8 rounded-lg mb-8 text-center`}>
          <p className="text-brand-ink-soft text-sm mb-2">Tu nivel actual:</p>
          <h2 className={`text-4xl font-bold ${levelData.color} mb-4`}>{levelData.level}</h2>
          <p className="text-2xl font-semibold text-brand-navy">{score.percentage.toFixed(0)}%</p>
          <p className="text-sm text-brand-ink-soft mt-2">({score.total} de {score.maxScore} puntos)</p>
        </div>

        <div className="bg-white p-6 rounded-lg ring-1 ring-brand-navy/5 shadow-card mb-8">
          <h3 className="font-semibold text-brand-navy mb-4">📊 Interpretación:</h3>
          <p className="text-brand-ink mb-4">
            {score.percentage < 25 && 'Tu empresa está en fase inicial. Hay mucho potencial de crecimiento y organización. Necesitas construir bases sólidas en RR.HH.'}
            {score.percentage >= 25 && score.percentage < 50 && 'Tienes avances, pero hay brechas significativas. Es momento de estructurar procesos y documentación.'}
            {score.percentage >= 50 && score.percentage < 75 && 'Tu gestión de personas es sólida. Ahora necesitas optimizar y alinear todo estratégicamente.'}
            {score.percentage >= 75 && 'Excelente nivel de madurez. Mantén la continuidad y considera certificaciones o benchmarking.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-brand-cream p-6 rounded-lg">
          <h3 className="font-semibold text-brand-navy mb-4">📩 Recibe tu reporte completo:</h3>
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
              className="w-full px-4 py-2 bg-brand-gold text-white rounded-lg font-semibold shadow-card hover:bg-brand-gold-dark hover:shadow-card-hover disabled:opacity-50 transition-colors duration-300"
            >
              {loading ? 'Enviando...' : 'Enviar resultado a mi email'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    )
  }
}
