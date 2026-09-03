import { motion } from 'framer-motion'
import Seo from '../components/Seo.jsx'
import ContactForm from '../components/ContactForm.jsx'

export default function Contacto() {
  return (
    <div className="py-16 sm:py-24">
      <Seo
        title="Contacto | Agenda tu Diagnóstico Gratuito de 45 min — E&T"
        description="Solicita tu diagnóstico gratuito de RR.HH. en E&T Estrategia y Talento. Te respondemos en menos de 48 horas. Arequipa, Cusco e Ica, presencial o remoto."
      />
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Contacto
          </p>
          <h1 className="mt-3 text-3xl font-bold text-brand-navy sm:text-4xl">
            Solicita tu diagnóstico gratuito
          </h1>
          <p className="mt-4 text-brand-ink-soft">
            Cuéntanos qué está pasando en tu empresa. Te respondemos en menos
            de 48 horas con una propuesta clara.
          </p>
        </motion.div>

        <div className="mt-12">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
