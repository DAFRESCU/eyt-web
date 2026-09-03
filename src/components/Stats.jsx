import { motion } from 'framer-motion'
import AnimatedCounter from './AnimatedCounter.jsx'

const STATS = [
  { value: 9, suffix: '+', label: 'Años de experiencia en RR.HH. y psicología organizacional' },
  { value: 7, suffix: '', label: 'Unidades de especialización, un solo equipo' },
  { value: 3, suffix: '', label: 'Regiones de cobertura: Arequipa, Cusco e Ica' },
  { value: 45, suffix: '', label: 'Minutos de diagnóstico inicial, sin costo' },
]

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-brand-navy py-16 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="container-page relative">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <p className="font-serif text-4xl font-bold text-brand-rose sm:text-5xl">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm text-white/70">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
