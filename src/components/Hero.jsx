import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy to-brand-navy-soft py-24 text-white sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="container-page relative">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-rose"
        >
          Consultoría de RR.HH. y gestión organizacional
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-6xl"
        >
          E&amp;T ESTRATEGIA Y TALENTO
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-5 max-w-2xl text-xl font-semibold text-white/90 sm:text-2xl"
        >
          Método propio, resultados medibles
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-3 max-w-2xl text-base text-white/70 sm:text-lg"
        >
          Construimos la fuerza humana de cada empresa · Arequipa, Perú
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10"
        >
          <Link to="/contacto">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block rounded-md bg-brand-gold px-8 py-4 text-base font-semibold text-white shadow-card-hover transition-colors duration-300 hover:bg-brand-gold-dark"
            >
              Agendar diagnóstico gratuito
            </motion.span>
          </Link>
        </motion.div>
      </div>

      <HeroCtaBox />
    </section>
  )
}

function HeroCtaBox() {
  return (
    <div className="container-page relative mt-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
        className="rounded-xl bg-brand-navy/60 p-6 backdrop-blur-sm ring-1 ring-white/10 transition-colors duration-300 hover:bg-brand-navy/80 sm:p-8"
      >
        <p className="text-sm font-bold uppercase tracking-[0.15em] text-brand-rose">
          Primer servicio sin costo
        </p>
        <p className="mt-2 text-lg font-medium text-white sm:text-xl">
          Diagnóstico exploratorio gratuito de 45 minutos.
        </p>
      </motion.div>
    </div>
  )
}
