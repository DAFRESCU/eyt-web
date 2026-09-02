import { useState } from 'react'
import { motion } from 'framer-motion'
import QuizMadurezRH from '../components/QuizMadurezRH'
import CalculadoraRotacion from '../components/CalculadoraRotacion'
import TestClima from '../components/TestClima'
import EvaluadorRiesgos from '../components/EvaluadorRiesgos'
import TestLiderazgo from '../components/TestLiderazgo'

export default function Herramientas() {
  const [selected, setSelected] = useState(null)

  const herramientas = [
    {
      id: 'madurez',
      titulo: '🎯 Quiz: Madurez RR.HH.',
      description: 'Evalúa el nivel de madurez de tu área de RR.HH. en 8 preguntas',
      tiempo: '5 min',
      component: QuizMadurezRH
    },
    {
      id: 'rotacion',
      titulo: '💰 Calculadora: Costo Rotación',
      description: 'Descubre cuánto te cuesta realmente la rotación de personal',
      tiempo: '3 min',
      component: CalculadoraRotacion
    },
    {
      id: 'clima',
      titulo: '😊 Test: Clima Organizacional',
      description: 'Mide cómo se sienten realmente tus colaboradores',
      tiempo: '3 min',
      component: TestClima
    },
    {
      id: 'riesgos',
      titulo: '⚠️ Evaluador: Riesgos Laborales',
      description: 'Identifica vulnerabilidades legales en tu empresa',
      tiempo: '5 min',
      component: EvaluadorRiesgos
    },
    {
      id: 'liderazgo',
      titulo: '👥 Test: Estilo de Liderazgo',
      description: 'Descubre tu perfil como líder y áreas de desarrollo',
      tiempo: '3 min',
      component: TestLiderazgo
    }
  ]

  if (selected) {
    const tool = herramientas.find(h => h.id === selected)
    const Component = tool.component
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelected(null)}
            className="mb-6 px-4 py-2 text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2"
          >
            ← Volver a herramientas
          </motion.button>
          <Component />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Herramientas Interactivas de Diagnóstico</h1>
          <p className="text-xl text-gray-600">
            Usa nuestras herramientas gratuitas para evaluar tu empresa. Todos los resultados se envían a tu email.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {herramientas.map((h, idx) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelected(h.id)}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-lg transition cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">{h.titulo}</h2>
                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{h.tiempo}</span>
              </div>
              <p className="text-gray-600 mb-4">{h.description}</p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition">
                Comenzar <span className="group-hover:translate-x-1 transition">→</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-blue-50 p-8 rounded-lg border border-blue-200 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-3">¿Quieres resultados más profundos?</h3>
          <p className="text-gray-700 mb-6">
            Completa cualquiera de nuestras herramientas y nos contactaremos para brindarte un análisis personalizado y un plan de acción.
          </p>
          <a href="/contacto" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
            Agendar consulta gratuita
          </a>
        </motion.div>
      </div>
    </div>
  )
}
