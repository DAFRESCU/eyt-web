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
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/blog" className="text-blue-600 font-semibold hover:underline">
            ← Volver al blog
          </Link>

          <div className="mt-6 flex items-center gap-2">
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {artículo.categoría}
            </span>
            <span className="text-xs text-gray-500">{artículo.tiempo_lectura}</span>
          </div>

          <h1 className="mt-4 text-4xl font-bold text-gray-900">{artículo.título}</h1>

          <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
            <span>{artículo.autor}</span>
            <span>·</span>
            <span>{artículo.fecha}</span>
          </div>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-10 bg-white rounded-lg border border-gray-200 p-6 sm:p-10 space-y-5"
        >
          {artículo.contenido.map((párrafo, idx) => (
            <p key={idx} className="text-gray-700 leading-relaxed">
              {párrafo}
            </p>
          ))}
        </motion.article>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-16 bg-blue-50 p-8 rounded-lg"
        >
          <p className="text-gray-700 mb-4">
            ¿Tienes una pregunta sobre gestión de personas?
          </p>
          <a
            href="/contacto"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Contáctanos
          </a>
        </motion.div>
      </div>
    </div>
  )
}
