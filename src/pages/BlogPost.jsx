import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BLOG_POSTS } from '../data/content.js'

export default function BlogPost() {
  const { slug } = useParams()
  const artículo = BLOG_POSTS.find((art) => art.slug === slug)

  if (!artículo) {
    return <Navigate to="/404" replace />
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="container-page max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-gold-dark transition-colors duration-200 hover:text-brand-navy"
          >
            <span aria-hidden>←</span> Volver al blog
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8"
        >
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-gold-dark">
              {artículo.categoría}
            </span>
            <span className="text-xs text-brand-ink-soft">{artículo.tiempo_lectura} de lectura</span>
          </div>

          <h1 className="mt-4 text-3xl font-bold leading-tight text-brand-navy sm:text-4xl">
            {artículo.título}
          </h1>

          <div className="mt-4 flex items-center gap-3 text-sm text-brand-ink-soft">
            <span className="font-semibold text-brand-navy">{artículo.autor}</span>
            <span aria-hidden>·</span>
            <span>{artículo.fecha}</span>
          </div>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 space-y-5 rounded-lg bg-white p-6 shadow-card ring-1 ring-brand-navy/5 sm:p-10"
        >
          {artículo.contenido.map((párrafo, idx) => (
            <p key={idx} className="leading-relaxed text-brand-ink">
              {párrafo}
            </p>
          ))}
        </motion.article>

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
              Contáctanos
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
