import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QuizMadurezRH from '../components/QuizMadurezRH'
import CalculadoraRotacion from '../components/CalculadoraRotacion'
import TestClima from '../components/TestClima'
import EvaluadorRiesgos from '../components/EvaluadorRiesgos'
import TestLiderazgo from '../components/TestLiderazgo'

const herramientas = [
  {
    id: 'madurez',
    icono: '🎯',
    titulo: 'Quiz: Madurez RR.HH.',
    description: 'Evalúa el nivel de madurez de tu área de RR.HH. en 8 preguntas',
    tiempo: '5 min',
    component: QuizMadurezRH,
  },
  {
    id: 'rotacion',
    icono: '💰',
    titulo: 'Calculadora: Costo Rotación',
    description: 'Descubre cuánto te cuesta realmente la rotación de personal',
    tiempo: '3 min',
    component: CalculadoraRotacion,
  },
  {
    id: 'clima',
    icono: '😊',
    titulo: 'Test: Clima Organizacional',
    description: 'Mide cómo se sienten realmente tus colaboradores',
    tiempo: '3 min',
    component: TestClima,
  },
  {
    id: 'riesgos',
    icono: '⚠️',
    titulo: 'Evaluador: Riesgos Laborales',
    description: 'Identifica vulnerabilidades legales en tu empresa',
    tiempo: '5 min',
    component: EvaluadorRiesgos,
  },
  {
    id: 'liderazgo',
    icono: '👥',
    titulo: 'Test: Estilo de Liderazgo',
    description: 'Descubre tu perfil como líder y áreas de desarrollo',
    tiempo: '3 min',
    component: TestLiderazgo,
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Herramientas() {
  const [selected, setSelected] = useState(null)

  if (selected) {
    const tool = herramientas.find((h) => h.id === selected)
    const Component = tool.component
    return (
      <div className="py-16 sm:py-24">
        <div className="container-page max-w-2xl">
          <motion.button
            whileHover={{ x: -3 }}
            onClick={() => setSelected(null)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-gold-dark transition-colors duration-200 hover:text-brand-navy"
          >
            <span aria-hidden>←</span> Volver a herramientas
          </motion.button>
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Component />
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold-dark">
            Herramientas gratuitas
          </p>
          <h1 className="mt-3 text-3xl font-bold text-brand-navy sm:text-4xl">
            Diagnóstico interactivo para tu empresa
          </h1>
          <p className="mt-4 text-brand-ink-soft">
            Evalúa el estado real de tu gestión de personas en minutos. Los
            resultados se envían a tu email junto con recomendaciones.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid gap-6 md:grid-cols-2"
        >
          {herramientas.map((h) => (
            <motion.button
              key={h.id}
              variants={cardVariant}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              onClick={() => setSelected(h.id)}
              className="group flex flex-col rounded-lg bg-white p-7 text-left shadow-card ring-1 ring-brand-navy/5 transition-shadow duration-300 hover:shadow-card-hover"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-cream text-2xl transition-colors duration-300 group-hover:bg-brand-gold/10">
                  {h.icono}
                </span>
                <span className="rounded-full bg-brand-navy/5 px-3 py-1 text-xs font-semibold text-brand-ink-soft">
                  {h.tiempo}
                </span>
              </div>

              <h2 className="mt-4 text-lg font-bold text-brand-navy transition-colors duration-300 group-hover:text-brand-gold-dark">
                {h.titulo}
              </h2>
              <p className="mt-2 text-sm text-brand-ink-soft">{h.description}</p>

              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-gold-dark">
                Comenzar
                <motion.span aria-hidden className="inline-block" whileHover={{ x: 3 }}>
                  →
                </motion.span>
              </span>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="mt-16 rounded-lg bg-brand-navy p-8 text-center sm:p-10"
        >
          <h3 className="text-xl font-bold text-white sm:text-2xl">
            ¿Quieres resultados más profundos?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-white/75">
            Completa cualquiera de nuestras herramientas y nos contactaremos
            para brindarte un análisis personalizado y un plan de acción.
          </p>
          <a href="/contacto">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 inline-block rounded-md bg-brand-gold px-8 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-brand-gold-dark"
            >
              Agendar consulta gratuita
            </motion.span>
          </a>
        </motion.div>
      </div>
    </div>
  )
}
