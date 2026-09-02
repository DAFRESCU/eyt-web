import { motion } from 'framer-motion'
import { PAIN_POINTS } from '../data/content.js'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function PainPoints() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-page">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-center text-2xl font-bold text-brand-navy sm:text-3xl"
        >
          ¿Tu empresa enfrenta alguno de estos problemas?
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-10 grid gap-6 sm:grid-cols-3"
        >
          {PAIN_POINTS.map((point) => (
            <motion.div
              key={point}
              variants={cardVariant}
              whileHover={{ y: -4 }}
              className="rounded-lg bg-white p-6 shadow-card transition-shadow duration-300 hover:shadow-card-hover"
            >
              <p className="italic text-brand-ink">&ldquo;{point}&rdquo;</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 text-center text-xl font-bold italic text-brand-gold-dark"
        >
          Nosotros lo resolvemos.
        </motion.p>
      </div>
    </section>
  )
}
