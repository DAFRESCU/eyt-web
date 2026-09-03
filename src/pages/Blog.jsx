import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Seo from '../components/Seo.jsx'
import { BLOG_POSTS } from '../data/content.js'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export default function Blog() {
  const artículos = BLOG_POSTS

  return (
    <div className="py-16 sm:py-24">
      <Seo
        title="Blog E&T | Insights sobre RR.HH., Liderazgo y Estrategia Organizacional"
        description="Artículos prácticos sobre gestión de personas, rotación de talento, clima organizacional y liderazgo, escritos por el equipo de E&T Estrategia y Talento."
      />
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold-dark">
            Blog E&amp;T
          </p>
          <h1 className="mt-3 text-3xl font-bold text-brand-navy sm:text-4xl">
            Insights sobre personas y estrategia
          </h1>
          <p className="mt-4 text-brand-ink-soft">
            Gestión de personas, liderazgo y estrategia organizacional, con la
            misma mirada práctica que aplicamos en cada consultoría.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-14 grid gap-8 md:grid-cols-3"
        >
          {artículos.map((art) => (
            <motion.article
              key={art.id}
              variants={cardVariant}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-card ring-1 ring-brand-navy/5 transition-shadow duration-300 hover:shadow-card-hover"
            >
              <Link to={`/blog/${art.slug}`} className="flex h-full flex-col">
                <div className="relative h-36 overflow-hidden bg-gradient-to-br from-brand-navy to-brand-gold-dark">
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-[0.08] transition-transform duration-500 ease-out group-hover:scale-110"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                      backgroundSize: '20px 20px',
                    }}
                  />
                  <span className="absolute bottom-4 left-6 font-serif text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                    {art.categoría}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2 text-xs text-brand-ink-soft">
                    <span>{art.fecha}</span>
                    <span aria-hidden>·</span>
                    <span>{art.tiempo_lectura}</span>
                  </div>

                  <h2 className="mt-3 text-lg font-bold text-brand-navy transition-colors duration-300 group-hover:text-brand-gold-dark">
                    {art.título}
                  </h2>

                  <p className="mt-2 flex-1 text-sm text-brand-ink-soft">{art.descripción}</p>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-gold-dark">
                    Leer artículo
                    <motion.span
                      aria-hidden
                      className="inline-block"
                      initial={{ x: 0 }}
                      animate={{ x: 0 }}
                      whileHover={{ x: 3 }}
                    >
                      →
                    </motion.span>
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="mt-16 rounded-lg bg-brand-navy p-8 text-center sm:p-10"
        >
          <p className="text-white/80">
            ¿Tienes una pregunta sobre gestión de personas?
          </p>
          <Link to="/contacto">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 inline-block rounded-md bg-brand-gold px-8 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-brand-gold-dark"
            >
              Agenda tu diagnóstico gratuito de 45 min
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
