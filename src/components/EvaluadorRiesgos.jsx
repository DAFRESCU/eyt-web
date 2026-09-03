import { useState } from 'react'
import { motion } from 'framer-motion'

export default function EvaluadorRiesgos() {
  const [step, setStep] = useState('start')
  const [answers, setAnswers] = useState({})
  const [contactData, setContactData] = useState({ nombre: '', email: '', empresa: '' })
  const [loading, setLoading] = useState(false)

  const riesgos = [
    { id: 1, titulo: 'Falta de Reglamento Interno', severidad: 'alta', descripcion: '¿Tienen un Reglamento Interno actualizado y vigente?' },
    { id: 2, titulo: 'Deficiencia en Contratación', severidad: 'alta', descripcion: '¿Todos los colaboradores tienen contratos formales y legales?' },
    { id: 3, titulo: 'Incumplimientos Laborales', severidad: 'alta', descripcion: '¿Cumplen puntualmente con pagos de salarios, AFP, EsSalud?' },
    { id: 4, titulo: 'Falta de Seguridad en el Trabajo', severidad: 'alta', descripcion: '¿Tienen identificados y mitigados los riesgos en el trabajo?' },
    { id: 5, titulo: 'Discriminación o Acoso', severidad: 'media', descripcion: '¿Tiene protocolo de denuncia para discriminación/acoso?' },
    { id: 6, titulo: 'Falta de Capacitación', severidad: 'media', descripcion: '¿Realizan capacitaciones de seguridad y normas laborales?' },
    { id: 7, titulo: 'Jornada Laboral Excesiva', severidad: 'media', descripcion: '¿Respetan las horas máximas de trabajo (8h diarias)?' },
    { id: 8, titulo: 'Problemas de Comunicación', severidad: 'baja', descripcion: '¿Existe comunicación clara de políticas a los colaboradores?' },
    { id: 9, titulo: 'Falta de Motivación', severidad: 'baja', descripcion: '¿Hay iniciativas de reconocimiento o beneficios?' },
    { id: 10, titulo: 'Rotación Alta', severidad: 'baja', descripcion: '¿La rotación de personal está dentro de rangos normales?' }
  ]

  const handleAnswer = (id, value) => {
    setAnswers({ ...answers, [id]: value })
  }

  const calculateRisk = () => {
    let altaCount = 0
    let mediaCount = 0
    let bajaCount = 0

    riesgos.forEach(riesgo => {
      if (answers[riesgo.id] === false) {
        if (riesgo.severidad === 'alta') altaCount++
        else if (riesgo.severidad === 'media') mediaCount++
        else bajaCount++
      }
    })

    const riskScore = (altaCount * 3 + mediaCount * 2 + bajaCount * 1) / 30 * 100
    return { riskScore, altaCount, mediaCount, bajaCount }
  }

  const getRiskLevel = (score) => {
    if (score > 60) return { level: 'CRÍTICO', color: 'text-red-600', bg: 'bg-red-50' }
    if (score > 40) return { level: 'ALTO', color: 'text-orange-600', bg: 'bg-orange-50' }
    if (score > 20) return { level: 'MODERADO', color: 'text-amber-600', bg: 'bg-amber-50' }
    return { level: 'BAJO', color: 'text-emerald-600', bg: 'bg-emerald-50' }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!contactData.nombre || !contactData.email || !contactData.empresa) {
      alert('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    const risk = calculateRisk()
    const riskLevel = getRiskLevel(risk.riskScore)

    const formData = new FormData()
    formData.append('nombre', contactData.nombre)
    formData.append('email', contactData.email)
    formData.append('empresa', contactData.empresa)
    formData.append('herramienta', 'Evaluador Riesgos Laborales')
    formData.append('resultado', `${riskLevel.level} (${risk.riskScore.toFixed(0)}%)`)
    formData.append('_subject', `Nuevo evaluador: Riesgos - ${contactData.empresa}`)

    try {
      await fetch('https://formspree.io/f/myzklpzn', {
        method: 'POST',
        body: formData
      })
      alert('✅ Evaluación enviada. Te contactaremos con un plan de acción.')
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
          <h2 className="text-3xl font-bold text-brand-navy mb-4">⚠️ Evaluador: Riesgos Laborales</h2>
          <p className="text-brand-ink-soft mb-6">
            Identifica vulnerabilidades legales y de cumplimiento en tu empresa.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setStep('quiz')}
            className="px-8 py-3 bg-brand-gold text-white rounded-lg font-semibold shadow-card hover:bg-brand-gold-dark hover:shadow-card-hover transition-colors duration-300"
          >
            Comenzar Evaluación (5 min)
          </motion.button>
        </div>
      </motion.div>
    )
  }

  if (step === 'quiz') {
    const answeredCount = Object.keys(answers).length
    const isComplete = answeredCount === riesgos.length

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-brand-navy">Progreso</span>
            <span className="text-sm text-brand-ink-soft">{answeredCount}/{riesgos.length}</span>
          </div>
          <div className="w-full bg-brand-navy/10 rounded-full h-2">
            <motion.div
              className="bg-brand-gold h-2 rounded-full"
              animate={{ width: `${(answeredCount / riesgos.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            ></motion.div>
          </div>
        </div>

        <div className="space-y-4">
          {riesgos.map((r, idx) => (
            <motion.div
              key={r.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-5 rounded-lg ring-1 ring-brand-navy/5 shadow-card"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-brand-navy">{r.titulo}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  r.severidad === 'alta' ? 'bg-red-100 text-red-700' :
                  r.severidad === 'media' ? 'bg-amber-100 text-amber-700' :
                  'bg-brand-gold/10 text-brand-gold-dark'
                }`}>
                  {r.severidad.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-brand-ink-soft mb-4">{r.descripcion}</p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAnswer(r.id, true)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                    answers[r.id] === true
                      ? 'bg-emerald-600 text-white'
                      : 'bg-brand-cream text-brand-ink hover:bg-brand-navy/10'
                  }`}
                >
                  ✓ Sí
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAnswer(r.id, false)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                    answers[r.id] === false
                      ? 'bg-red-600 text-white'
                      : 'bg-brand-cream text-brand-ink hover:bg-brand-navy/10'
                  }`}
                >
                  ✗ No
                </motion.button>
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
            Ver evaluación
          </motion.button>
        )}
      </motion.div>
    )
  }

  if (step === 'result') {
    const risk = calculateRisk()
    const riskLevel = getRiskLevel(risk.riskScore)

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl mx-auto p-6">
        <div className={`${riskLevel.bg} p-8 rounded-lg mb-8 text-center border-l-4`}>
          <p className="text-brand-ink-soft text-sm mb-2">Nivel de Riesgo:</p>
          <h2 className={`text-4xl font-bold ${riskLevel.color} mb-4`}>{riskLevel.level}</h2>
          <p className="text-2xl font-semibold text-brand-navy">{risk.riskScore.toFixed(0)}%</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-sm text-brand-ink-soft">Riesgos Altos</p>
            <p className="text-3xl font-bold text-red-600">{risk.altaCount}</p>
          </motion.div>
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-amber-50 p-4 rounded-lg text-center">
            <p className="text-sm text-brand-ink-soft">Riesgos Medios</p>
            <p className="text-3xl font-bold text-amber-600">{risk.mediaCount}</p>
          </motion.div>
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-brand-cream p-4 rounded-lg text-center">
            <p className="text-sm text-brand-ink-soft">Riesgos Bajos</p>
            <p className="text-3xl font-bold text-brand-gold-dark">{risk.bajaCount}</p>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} className="bg-brand-cream p-6 rounded-lg">
          <h3 className="font-semibold text-brand-navy mb-4">📩 Recibe auditoría personalizada:</h3>
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
              {loading ? 'Enviando...' : 'Enviar evaluación'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    )
  }
}
