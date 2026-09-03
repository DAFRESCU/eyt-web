import { useState } from 'react'
import { motion } from 'framer-motion'

export default function AnimatedCounter({ target, duration = 900, suffix = '', pad = 0, className = '', style }) {
  const [value, setValue] = useState(0)
  const [done, setDone] = useState(false)

  const start = () => {
    if (done) return
    setDone(true)
    const startTime = performance.now()
    const num = Number(target)

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      setValue(Math.round(progress * num))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  const display = pad ? String(value).padStart(pad, '0') : String(value)

  return (
    <motion.span
      onViewportEnter={start}
      viewport={{ once: true, amount: 0.6 }}
      className={className}
      style={style}
    >
      {display}{suffix}
    </motion.span>
  )
}
