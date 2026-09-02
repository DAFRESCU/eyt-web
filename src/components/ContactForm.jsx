import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CONTACT } from '../data/content.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const initialForm = {
  nombre: '',
  email: '',
  telefono: '',
  empresa: '',
  mensaje: '',
}

function validate(form) {
  const errors = {}
  if (!form.nombre.trim()) errors.nombre = 'Ingresa tu nombre.'
  if (!form.email.trim()) {
    errors.email = 'Ingresa tu email.'
  } else if (!EMAIL_RE.test(form.email.trim())) {
    errors.email = 'Ingresa un email válido.'
  }
  if (!form.mensaje.trim()) errors.mensaje = 'Cuéntanos brevemente qué necesitas.'
  return errors
}

export default function ContactForm() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | sent

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
    setErrors(validate({ ...form }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate(form)
    setErrors(validationErrors)
    setTouched({ nombre: true, email: true, mensaje: true })

    if (Object.keys(validationErrors).length > 0) return

    // eslint-disable-next-line no-console
    console.log('Nuevo lead E&T:', form)

    setStatus('sent')
    setForm(initialForm)
    setTouched({})
    setErrors({})
  }

  const fieldClass = (name) =>
    `w-full rounded-md border bg-white px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink-soft/60 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-colors duration-200 ${
      touched[name] && errors[name] ? 'border-red-400' : 'border-brand-cream'
    }`

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="grid gap-10 lg:grid-cols-5"
    >
      <form onSubmit={handleSubmit} noValidate className="lg:col-span-3">
        <AnimatePresence>
          {status === 'sent' && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden rounded-md bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200"
            >
              ¡Mensaje enviado! Te contactaremos muy pronto.
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="nombre" className="mb-1.5 block text-sm font-semibold text-brand-navy">
              Nombre *
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={form.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Tu nombre completo"
              className={fieldClass('nombre')}
            />
            {touched.nombre && errors.nombre && (
              <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-brand-navy">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="tucorreo@empresa.com"
              className={fieldClass('email')}
            />
            {touched.email && errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="telefono" className="mb-1.5 block text-sm font-semibold text-brand-navy">
              Teléfono
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              value={form.telefono}
              onChange={handleChange}
              placeholder="+51 9XX XXX XXX"
              className={fieldClass('telefono')}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="empresa" className="mb-1.5 block text-sm font-semibold text-brand-navy">
              Empresa
            </label>
            <input
              id="empresa"
              name="empresa"
              type="text"
              value={form.empresa}
              onChange={handleChange}
              placeholder="Nombre de tu empresa"
              className={fieldClass('empresa')}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="mensaje" className="mb-1.5 block text-sm font-semibold text-brand-navy">
              Mensaje *
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={5}
              value={form.mensaje}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Cuéntanos brevemente qué necesita tu empresa"
              className={fieldClass('mensaje')}
            />
            {touched.mensaje && errors.mensaje && (
              <p className="mt-1 text-xs text-red-500">{errors.mensaje}</p>
            )}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="mt-6 w-full rounded-md bg-brand-gold px-6 py-3.5 text-sm font-semibold text-white shadow-card transition-colors duration-300 hover:bg-brand-gold-dark sm:w-auto"
        >
          Solicitar Diagnóstico
        </motion.button>
      </form>

      <div className="lg:col-span-2">
        <div className="rounded-lg bg-brand-navy p-6 text-white sm:p-8">
          <h3 className="font-serif text-xl font-bold">Hablemos directamente</h3>
          <p className="mt-2 text-sm text-white/70">
            Escríbenos hoy y agenda tu reunión exploratoria GRATUITA de 45 minutos.
          </p>

          <div className="mt-6 space-y-4 text-sm">
            <a href={`tel:${CONTACT.phoneHref}`} className="flex items-center gap-3 text-white/90 hover:text-brand-rose">
              <span>📞</span> {CONTACT.phone}
            </a>
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 text-white/90 hover:text-brand-rose">
              <span>✉️</span> {CONTACT.email}
            </a>
            <p className="flex items-center gap-3 text-white/90">
              <span>📍</span> {CONTACT.locations.join(' · ')}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
