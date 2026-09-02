import { motion } from 'framer-motion'

export default function Testimonios() {
  const testimonios = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      empresa: 'Industria Textil',
      cargo: 'Gerente General',
      foto: '👨‍💼',
      texto: 'E&T nos ayudó a estructurar completamente nuestra área de RR.HH. El MOF y el Reglamento Interno fueron exactamente lo que necesitábamos. La rotación bajó 40% en 6 meses.',
      rating: 5
    },
    {
      id: 2,
      nombre: 'María González',
      empresa: 'Servicios Logísticos',
      cargo: 'Directora de Operaciones',
      foto: '👩‍💼',
      texto: 'Hicimos el test de clima con E&T. Los resultados fueron claros y propusieron un plan de acción muy práctico. Ahora medimos el clima cada trimestre.',
      rating: 5
    },
    {
      id: 3,
      nombre: 'Carlos López',
      empresa: 'Comercio Retail',
      cargo: 'Socio',
      foto: '👨‍💼',
      texto: 'La auditoría laboral nos salvó. Identificaron riesgos que no veíamos. Implementamos recomendaciones y pasamos la fiscalización de SUNAFIL sin problemas.',
      rating: 5
    }
  ]

  return (
    <section id="testimonios" className="py-20 bg-gray-50">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Lo que dicen nuestros clientes</h2>
          <p className="text-xl text-gray-600">
            Empresas que transformaron su gestión de personas con E&T
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonios.map((tst, idx) => (
            <motion.div
              key={tst.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition"
            >
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">{tst.foto}</div>
                <div>
                  <p className="font-semibold text-gray-900">{tst.nombre}</p>
                  <p className="text-sm text-gray-600">{tst.cargo}</p>
                  <p className="text-xs text-gray-500">{tst.empresa}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(tst.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed">"{tst.texto}"</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16 bg-blue-50 p-8 rounded-lg"
        >
          <p className="text-gray-700 mb-4">
            ¿Quieres ser el próximo caso de éxito? Agendar una consulta gratuita
          </p>
          <a
            href="/contacto"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Agendar ahora
          </a>
        </motion.div>
      </div>
    </section>
  )
}
