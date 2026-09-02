import { useState } from 'react'
import { motion } from 'framer-motion'

export default function TestClima() {
  const [step, setStep] = useState('start')
  const [answers, setAnswers] = useState({})
  const [contactData, setContactData] = useState({ nombre: '', email: '', empresa: '' })
  const [loading, setLoading] = useState(false)

  const questions = [
    { id: 1, text: 'Conozco claramente mis funciones y responsabilidades' },
    { id: 2, text: 'Tengo oportunidades de crecimiento profesional' },
    { id: 3, text: 'Mi jefe reconoce mi trabajo' },
    { id: 4, text: 'Recibo retroalimentación constructiva regularmente' },
    { id: 5, text: 'Los beneficios y compensación son justos' },
    { id: 6, text: 'Tengo un buen balance trabajo-vida personal' },
    { id: 7, text: 'Me siento parte del equipo' },
    { id: 8, text: 'La comunicación interna es clara' },
    { id: 9, text: 'Confío en la dirección de la empresa' },
    { id: 10, text: 'Recomendaría trabajar aquí a un amigo' }
  ]

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value })
  }

  const calculateScores = () => {
    const total = Object.values(answers).reduce((a, b) => a + b, 0)
    const average = total / questions.length
    return { total, average }
  }

  const getLevelInfo = (average) => {
    if (average < 2) return { level: 'Crítico', color: 'text-red-600', bg: 'bg-red-50', recommendation: 'Requiere intervención urgente' }
    if (average < 3) return { level: 'Bajo', color: 'text-orange-600', bg: 'bg-orange-50', recommendation: 'Hay problemas significativos' }
    if (average < 4) return { level: 'Moderado', color: 'text-yellow-600', bg: 'bg-yellow-50', recommendation: 'Hay oportunidades de mejora' }
    return { level: 'Alto', color: 'text-green-600', bg: 'bg-green-50', recommendation: 'Buen clima organizacional' }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!contactData.nombre || !contactData.email || !contactData.empresa) {
      alert('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    const scores = calculateScores()
    const levelInfo = getLevelInfo(scores.average)

    const formData = new FormData()
    formData.append('nombre', contactData.nombre)
    formData.append('email', contactData.email)
    formData.append('empresa', contactData.empresa)
    formData.append('herramienta', 'Test Clima Organizacional')
    formData.append('resultado', `${levelInfo.level} (${scores.average.toFixed(1)}/5)`)
    formData.append('_subject', `Nuevo test: Clima - ${contactData.empresa}`)

    try {
      await fetch('https://formspree.io/f/myzklpzn', {
        method: 'POST',
        body: formData
      })
      alert('✅ Resultado enviado. Nos contactaremos para brindarte soluciones.')
      setStep('start')
      setAnswers({})
      setContactData({ nombre: '', email: '', empresa: '' })
    } catch (error) {
      alert('Error. Intenta de nuevo.')
    }
    setLoading(false)
  }

  if (step === 'start') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">😊 Test: Clima Organizacional</h2>
          <p className="text-gray-600 mb-6">
            Mide cómo se sienten tus colaboradores en la empresa. 10 preguntas simples.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setStep('quiz')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold"
          >
            Hacer Test (3 min)
          </motion.button>
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
            <span className="text-sm font-semibold text-gray-700">Progreso</span>
            <span className="text-sm text-gray-600">{answeredCount}/{questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${(answeredCount / questions.length) * 100}%` }}></div>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((q, idx) => (
            <motion.div key={q.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: idx * 0.05 }} className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">{q.text}</h3>
              <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5].map(val => (
                  <motion.button
                    key={val}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleAnswer(q.id, val)}
                    className={`flex-1 py-2 rounded-lg font-semibold transition ${
                      answers[q.id] === val
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {val}
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Muy en desacuerdo</span>
                <span>Muy de acuerdo</span>
              </div>
            </motion.div>
          ))}
        </div>

        {isComplete && (
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={() => setStep('result')}
            className="w-full mt-8 px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
          >
            Ver resultado
          </motion.button>
        )}
      </motion.div>
    )
  }

  if (step === 'result') {
    const scores = calculateScores()
    const levelInfo = getLevelInfo(scores.average)

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl mx-auto p-6">
        <div className={`${levelInfo.bg} p-8 rounded-lg mb-8 text-center border-l-4 border-opacity-50`} style={{ borderColor: levelInfo.color.replace('text-', '') }}>
          <p className="text-gray-600 text-sm mb-2">Índice de Clima Organizacional:</p>
          <h2 className={`text-4xl font-bold ${levelInfo.color} mb-4`}>{levelInfo.level}</h2>
          <p className="text-2xl font-semibold text-gray-900">{scores.average.toFixed(1)} / 5.0</p>
          <p className="text-sm text-gray-600 mt-2">{levelInfo.recommendation}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {questions.map((q, idx) => (
            <motion.div
              key={q.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-4 rounded-lg border border-gray-200"
            >
              <p className="text-xs text-gray-600 mb-2">Pregunta {q.id}</p>
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{ width: `${(answers[q.id] / 5) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm font-semibold text-gray-900 mt-2">{answers[q.id]}/5</p>
            </motion.div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4">📩 Recibe plan de mejora:</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Tu nombre"
              value={contactData.nombre}
              onChange={(e) => setContactData({ ...contactData, nombre: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Tu email"
              value={contactData.email}
              onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Nombre de tu empresa"
              value={contactData.empresa}
              onChange={(e) => setContactData({ ...contactData, empresa: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar resultado'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    )
  }
}
