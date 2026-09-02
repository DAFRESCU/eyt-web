import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SERVICES } from '../data/content.js'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Services({ id = 'servicios' }) {
  return (
    <section id={id} className="bg-brand-cream py-16 sm:py-24">
      <div className="container-page">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-center text-2xl font-bold text-brand-navy sm:text-3xl"
        >
          Nuestras 7 unidades de servicio
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-7"
        >
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              variants={cardVariant}
              whileHover={{ y: -6 }}
              className={`group flex flex-col rounded-lg border-t-4 p-5 shadow-card transition-all duration-300 hover:shadow-card-hover ${
                i % 2 === 0 ? 'bg-white' : 'bg-brand-cream'
              }`}
              style={{ borderTopColor: service.color }}
            >
              <span
                className="text-lg font-bold italic"
                style={{ color: service.color }}
              >
                {service.id}
              </span>
              <h3 className="mt-2 text-sm font-bold text-brand-navy">
                {service.name}
              </h3>
              <p className="mt-2 flex-1 text-xs text-brand-ink-soft">
                {service.short}
              </p>
              <p
                className="mt-4 text-sm font-bold"
                style={{ color: service.color }}
              >
                {service.price}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <Link
            to="/servicios"
            className="inline-block rounded-md border-2 border-brand-navy px-6 py-3 text-sm font-semibold text-brand-navy transition-colors duration-300 hover:bg-brand-navy hover:text-white"
          >
            Ver detalle de servicios
          </Link>
        </div>
      </div>
    </section>
  )
}
