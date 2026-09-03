import { motion } from 'framer-motion'

const testimonios = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    empresa: 'Industria Textil',
    cargo: 'Gerente General',
    iniciales: 'JP',
    texto: 'E&T nos ayudó a estructurar completamente nuestra área de RR.HH. El MOF y el Reglamento Interno fueron exactamente lo que necesitábamos. La rotación bajó 40% en 6 meses.',
  },
  {
    id: 2,
    nombre: 'María González',
    empresa: 'Servicios Logísticos',
    cargo: 'Directora de Operaciones',
    iniciales: 'MG',
    texto: 'Hicimos el test de clima con E&T. Los resultados fueron claros y propusieron un plan de acción muy práctico. Ahora medimos el clima cada trimestre.',
  },
  {
    id: 3,
    nombre: 'Carlos López',
    empresa: 'Comercio Retail',
    cargo: 'Socio',
    iniciales: 'CL',
    texto: 'La auditoría laboral nos salvó. Identificaron riesgos que no veíamos. Implementamos recomendaciones y pasamos la fiscalización de SUNAFIL sin problemas.',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Testimonios() {
  return (
    <section id="testimonios" className="relative overflow-hidden bg-brand-cream py-16 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-brand-navy/5 blur-3xl"
      />

      <div className="container-page relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold-dark">
            Casos de éxito
          </p>
          <h2 className="mt-3 text-2xl font-bold text-brand-navy sm:text-3xl">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mt-3 text-brand-ink-soft">
            Empresas que transformaron su gestión de personas con E&amp;T
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          {testimonios.map((tst) => (
            <motion.figure
              key={tst.id}
              variants={cardVariant}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="group relative flex flex-col rounded-lg bg-white p-8 shadow-card ring-1 ring-brand-navy/5 transition-shadow duration-300 hover:shadow-card-hover"
            >
              <span
                aria-hidden
                className="font-serif text-6xl leading-none text-brand-gold/15 transition-colors duration-300 group-hover:text-brand-gold/25"
              >
                &ldquo;
              </span>

              <blockquote className="-mt-4 flex-1 text-brand-ink leading-relaxed">
                {tst.texto}
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-brand-navy/10 pt-5">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-navy font-serif text-sm font-bold text-white transition-colors duration-300 group-hover:bg-brand-gold">
                  {tst.iniciales}
                </span>
                <div>
                  <p className="text-sm font-bold text-brand-navy">{tst.nombre}</p>
                  <p className="text-xs text-brand-ink-soft">
                    {tst.cargo} · {tst.empresa}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-brand-ink-soft">
            ¿Quieres ser el próximo caso de éxito?
          </p>
          <a href="/contacto">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 inline-block rounded-md bg-brand-gold px-8 py-3.5 text-sm font-semibold text-white shadow-card transition-colors duration-300 hover:bg-brand-gold-dark hover:shadow-card-hover"
            >
              Agendar consulta gratuita
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
