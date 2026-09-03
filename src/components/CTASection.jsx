import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function CTASection() {
  return (
    <section className="bg-brand-navy py-16 sm:py-24">
      <div className="container-page text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold text-white sm:text-4xl"
        >
          ¿Listo para transformar tu equipo?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-4 max-w-xl text-base text-white/75 sm:text-lg"
        >
          Sin costo, sin compromiso: una reunión exploratoria de 45 minutos
          para identificar por dónde empezar.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8"
        >
          <Link to="/contacto">
            <motion.span
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(110, 36, 56, 0.5)',
                  '0 0 0 16px rgba(110, 36, 56, 0)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block rounded-md bg-brand-gold px-10 py-4 text-lg font-semibold text-white transition-colors duration-300 hover:bg-brand-gold-dark"
            >
              Agenda tu diagnóstico gratuito de 45 min
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
