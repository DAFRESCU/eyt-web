import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BLOG_POSTS } from '../data/content.js'

export default function Blog() {
  const artículos = BLOG_POSTS

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog E&T</h1>
          <p className="text-xl text-gray-600">
            Insights sobre gestión de personas, liderazgo y estrategia organizacional
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {artículos.map((art, idx) => (
            <motion.div
              key={art.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition group cursor-pointer"
            >
              <div className="h-40 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                <span className="text-6xl">📄</span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{art.categoría}</span>
                  <span className="text-xs text-gray-500">{art.tiempo_lectura}</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                  {art.título}
                </h3>

                <p className="text-gray-600 text-sm mb-4">{art.descripción}</p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{art.fecha}</span>
                  <Link to={`/blog/${art.slug}`} className="text-blue-600 font-semibold hover:underline">
                    Leer →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
