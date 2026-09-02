import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SERVICES } from '../data/content.js'

export default function Servicios() {
  return (
    <div className="py-16 sm:py-24">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Nuestros servicios
          </p>
          <h1 className="mt-3 text-3xl font-bold text-brand-navy sm:text-4xl">
            7 unidades de servicio, un solo equipo
          </h1>
          <p className="mt-4 text-brand-ink-soft">
            Cada unidad puede contratarse por separado o combinada, según el
            diagnóstico de tu empresa. Precios referenciales, sin sorpresas.
          </p>
        </motion.div>

        <div className="mt-14 space-y-8">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
              className="grid gap-6 rounded-lg border-t-4 bg-white p-6 shadow-card sm:grid-cols-4 sm:p-8"
              style={{ borderTopColor: service.color }}
            >
              <div className="sm:col-span-1">
                <span
                  className="text-2xl font-bold italic"
                  style={{ color: service.color }}
                >
                  {service.id}
                </span>
                <p
                  className="mt-2 text-sm font-bold"
                  style={{ color: service.color }}
                >
                  {service.price}
                </p>
              </div>

              <div className="sm:col-span-3">
                <h2 className="text-xl font-bold text-brand-navy">
                  {service.name}
                </h2>
                <p className="mt-2 text-sm text-brand-ink-soft">
                  {service.detail}
                </p>

                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {service.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm text-brand-ink">
                      <span className="mt-0.5 font-bold" style={{ color: service.color }}>
                        ✔
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contacto"
                  className="mt-5 inline-block rounded-md px-5 py-2.5 text-sm font-semibold text-white transition-opacity duration-300 hover:opacity-90"
                  style={{ backgroundColor: service.color }}
                >
                  Solicitar diagnóstico para {service.id}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
