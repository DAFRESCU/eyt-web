import { useState } from 'react'
import { motion } from 'framer-motion'

export default function TestLiderazgo() {
  const [step, setStep] = useState('start')
  const [answers, setAnswers] = useState({})
  const [contactData, setContactData] = useState({ nombre: '', email: '', empresa: '' })
  const [loading, setLoading] = useState(false)

  const questions = [
    { id: 1, text: 'Comunico claramente mis expectativas al equipo' },
    { id: 2, text: 'Escucho activamente las ideas de mis colaboradores' },
    { id: 3, text: 'Reconozco públicamente los logros del equipo' },
    { id: 4, text: 'Tomo decisiones considerando el bienestar del equipo' },
    { id: 5, text: 'Desarrollo el potencial de mis colaboradores' },
    { id: 6, text: 'Manejo bien los conflictos en el equipo' },
    { id: 7, text: 'Mis acciones son congruentes con mis valores' },
    { id: 8, text: 'Inspiro confianza en mis colaboradores' },
    { id: 9, text: 'Adapto mi estilo según las necesidades del equipo' },
    { id: 10, text: 'Tengo visión clara del futuro de la organización' }
  ]

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value })
  }

  const calculateProfile = () => {
    const total = Object.values(answers).reduce((a, b) => a + b, 0)
    const average = total / questions.length
    return { total, average }
  }

  const getProfile = (average) => {
    if (average < 2) return {
      profile: 'Líder Autocrático',
      color: 'text-red-600',
      bg: 'bg-red-50',
      description: 'Toma decisiones sin consultar. Enfoque en tareas sobre personas.',
      recommendation: 'Desarrollar empatía y escucha activa'
    }
    if (average < 3.5) return {
      profile: 'Líder Directivo',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      description: 'Proporciona dirección clara pero puede mejorar en reconocimiento.',
      recommendation: 'Fortalecer el reconocimiento y desarrollo de equipo'
    }
    if (average < 4.5) return {
      profile: 'Líder Transformacional',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      description: 'Inspiras y desarrollas a tu equipo. Excelente comunicación.',
      recommendation: 'Mantener el nivel y considerações estratégicas'
    }
    return {
      profile: 'Líder Excepcional',
      color: 'text-green-600',
      bg: 'bg-green-50',
      description: 'Modelo a seguir. Combinas dirección clara con desarrollo de personas.',
      recommendation: 'Documentar y compartir tus prácticas con otros líderes'
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!contactData.nombre || !contactData.email || !contactData.empresa) {
      alert('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    const profile = calculateProfile()
    const profileData = getProfile(profile.average)

    const formData = new FormData()
    formData.append('nombre', contactData.nombre)
    formData.append('email', contactData.email)
    formData.append('empresa', contactData.empresa)
    formData.append('herramienta', 'Test Liderazgo')
    formData.append('resultado', `${profileData.profile} (${profile.average.toFixed(1)}/5)`)
    formData.append('_subject', `Nuevo test: Liderazgo - ${contactData.empresa}`)

    try {
      await fetch('https://formspree.io/f/myzklpzn', {
        method: 'POST',
        body: formData
      })
      alert('✅ Resultado enviado. Te enviaremos recomendaciones personalizadas.')
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">👥 Test: Estilo de Liderazgo</h2>
          <p className="text-gray-600 mb-6">
            Descubre tu perfil como líder y obtén recomendaciones de desarrollo.
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
                <span>Totalmente en desacuerdo</span>
                <span>Totalmente de acuerdo</span>
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
            Ver mi perfil
          </motion.button>
        )}
      </motion.div>
    )
  }

  if (step === 'result') {
    const profile = calculateProfile()
    const profileData = getProfile(profile.average)

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl mx-auto p-6">
        <div className={`${profileData.bg} p-8 rounded-lg mb-8 text-center border-l-4`}>
          <p className="text-gray-600 text-sm mb-2">Tu perfil de liderazgo:</p>
          <h2 className={`text-3xl font-bold ${profileData.color} mb-4`}>{profileData.profile}</h2>
          <p className="text-xl font-semibold text-gray-900">{profile.average.toFixed(1)} / 5.0</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">📊 Interpretación:</h3>
          <p className="text-gray-700 mb-4">{profileData.description}</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-blue-900">💡 Recomendación:</p>
            <p className="text-sm text-blue-800 mt-1">{profileData.recommendation}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4">📩 Recibe plan de desarrollo:</h3>
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
