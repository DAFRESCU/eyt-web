import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'

export default function Hero() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const dotsY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const orbY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-br from-brand-navy to-brand-navy-soft py-24 text-white sm:py-28"
    >
      <motion.div
        aria-hidden
        style={{ y: dotsY }}
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </motion.div>

      <motion.div
        aria-hidden
        style={{ y: orbY }}
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-gold/20 blur-3xl"
      />
      <motion.div
        aria-hidden
        style={{ y: orbY }}
        className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-brand-rose/10 blur-3xl"
      />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="container-page relative">
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
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link to="/contacto">
            <motion.span
              whileHover={{ scale: 1.05, boxShadow: '0 12px 30px 0 rgba(0,0,0,0.25)' }}
              whileTap={{ scale: 0.95 }}
              className="inline-block rounded-md bg-brand-gold px-8 py-4 text-base font-semibold text-white shadow-card-hover transition-colors duration-300 hover:bg-brand-gold-dark"
            >
              Agendar diagnóstico gratuito
            </motion.span>
          </Link>

          <Link to="/herramientas?tool=radar360">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-4 text-sm font-semibold text-white transition-colors duration-300 hover:border-white/60 hover:bg-white/10"
            >
              📡 Prueba el Radar 360° gratis
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>

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
        whileHover={{ scale: 1.02, y: -2 }}
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
