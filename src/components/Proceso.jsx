import { useState } from 'react'
import { motion } from 'framer-motion'
import { PROCESO } from '../data/content.js'

function Counter({ target, color }) {
  const [value, setValue] = useState(0)
  const [done, setDone] = useState(false)

  const start = () => {
    if (done) return
    setDone(true)
    const duration = 700
    const startTime = performance.now()
    const num = parseInt(target, 10)

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      setValue(Math.round(progress * num))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  return (
    <motion.span
      onViewportEnter={start}
      viewport={{ once: true, amount: 0.6 }}
      className="text-3xl font-bold"
      style={{ color }}
    >
      {String(value).padStart(2, '0')}
    </motion.span>
  )
}

export default function Proceso() {
  return (
    <section id="como-trabajamos" className="py-16 sm:py-24">
      <div className="container-page">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-center text-2xl font-bold text-brand-navy sm:text-3xl"
        >
          Cómo trabajamos
        </motion.h2>

        <div className="mt-10 flex gap-5 overflow-x-auto pb-4 sm:grid sm:grid-cols-5 sm:overflow-visible sm:pb-0">
          {PROCESO.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="min-w-[220px] flex-shrink-0 rounded-lg border-t-[3px] bg-white p-6 shadow-card sm:min-w-0"
              style={{ borderTopColor: step.color }}
            >
              <Counter target={step.number} color={step.color} />
              <h3 className="mt-2 text-lg font-bold text-brand-navy">
                {step.title}
              </h3>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 + 0.3 }}
                className="mt-1 text-sm text-brand-ink-soft"
              >
                {step.description}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
