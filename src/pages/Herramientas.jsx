import { lazy, Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import QuizMadurezRH from '../components/QuizMadurezRH'
import CalculadoraRotacion from '../components/CalculadoraRotacion'
import TestClima from '../components/TestClima'
import EvaluadorRiesgos from '../components/EvaluadorRiesgos'
import TestLiderazgo from '../components/TestLiderazgo'

const RadarMadurez = lazy(() => import('../components/RadarMadurez'))

const featured = {
  id: 'radar360',
  icono: '📡',
  titulo: 'Radar 360°: Diagnóstico de Madurez Organizacional',
  description:
    'Nuestra herramienta más completa: 14 preguntas en 6 dimensiones clave, con un mapa visual tipo radar de tu empresa y recomendaciones específicas para tu punto más débil.',
  tiempo: '8 min',
  component: RadarMadurez,
}

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

const allTools = [featured, ...herramientas]

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
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const requested = searchParams.get('tool')
    if (requested && allTools.some((h) => h.id === requested)) {
      setSelected(requested)
    }
  }, [searchParams])

  if (selected) {
    const tool = allTools.find((h) => h.id === selected)
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
            <Suspense
              fallback={
                <div className="flex justify-center py-16">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" />
                </div>
              }
            >
              <Component />
            </Suspense>
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

        <motion.button
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          whileHover={{ y: -4 }}
          onClick={() => setSelected(featured.id)}
          className="group relative mt-14 flex w-full flex-col overflow-hidden rounded-xl bg-gradient-to-br from-brand-navy to-brand-gold-dark p-8 text-left shadow-card-hover ring-1 ring-brand-navy/10 sm:flex-row sm:items-center sm:gap-8 sm:p-10"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              ⭐ Herramienta insignia
            </span>
            <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
              {featured.titulo}
            </h2>
            <p className="mt-3 max-w-xl text-white/80">{featured.description}</p>
            <span className="mt-6 inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-brand-navy shadow-card transition-transform duration-300 group-hover:scale-105">
              Comenzar Radar 360° ({featured.tiempo})
              <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </div>

          <div className="relative mt-6 flex flex-shrink-0 items-center justify-center sm:mt-0">
            <span className="text-8xl opacity-90 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
              {featured.icono}
            </span>
          </div>
        </motion.button>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-8 grid gap-6 md:grid-cols-2"
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
