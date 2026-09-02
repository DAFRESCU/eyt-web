import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <p className="font-serif text-6xl font-bold text-brand-gold">404</p>
        <h1 className="mt-4 text-2xl font-bold text-brand-navy">
          Esta página no existe
        </h1>
        <p className="mt-2 text-brand-ink-soft">
          Puede que el enlace esté roto o la página se haya movido.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-md bg-brand-gold px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-brand-gold-dark"
        >
          Volver al inicio
        </Link>
      </motion.div>
    </div>
  )
}
