import { motion } from 'framer-motion'
import { POR_QUE_ET } from '../data/content.js'

export default function PorQueET() {
  return (
    <section id="por-que-et" className="bg-brand-cream py-16 sm:py-24">
      <div className="container-page">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-center text-2xl font-bold text-brand-navy sm:text-3xl"
        >
          ¿Por qué E&amp;T?
        </motion.h2>

        <div className="mx-auto mt-10 grid max-w-4xl gap-x-10 gap-y-6 sm:grid-cols-2">
          {POR_QUE_ET.map((reason, i) => (
            <motion.div
              key={reason}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-start gap-3"
            >
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 12, delay: i * 0.1 + 0.15 }}
                className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-gold text-sm font-bold text-white"
              >
                ✔
              </motion.span>
              <p className="text-brand-ink">{reason}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
