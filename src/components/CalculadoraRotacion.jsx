import { useState } from 'react'
import { motion } from 'framer-motion'

export default function CalculadoraRotacion() {
  const [step, setStep] = useState('inputs') // inputs, result
  const [contactData, setContactData] = useState({ nombre: '', email: '', empresa: '' })
  const [loading, setLoading] = useState(false)
  const [inputs, setInputs] = useState({
    colaboradores: 10,
    salarioPromedio: 2000,
    rotacionAnual: 2,
    costosReclutamiento: 1000,
    costosCapacitacion: 500,
    diasProductividad: 30
  })

  const handleInputChange = (field, value) => {
    setInputs({ ...inputs, [field]: parseFloat(value) || 0 })
  }

  const calculateImpact = () => {
    const colaboradoresRotados = (inputs.colaboradores * inputs.rotacionAnual) / 100
    const costosDirectos = colaboradoresRotados * (inputs.costosReclutamiento + inputs.costosCapacitacion)
    const costosPerdidaProductividad = colaboradoresRotados * inputs.salarioPromedio * (inputs.diasProductividad / 30)
    const costoTotal = costosDirectos + costosPerdidaProductividad
    const costoAnualPorEmpleado = inputs.colaboradores > 0 ? costoTotal / inputs.colaboradores : 0

    return {
      colaboradoresRotados: colaboradoresRotados.toFixed(1),
      costosDirectos: costosDirectos.toFixed(2),
      costosPerdidaProductividad: costosPerdidaProductividad.toFixed(2),
      costoTotal: costoTotal.toFixed(2),
      costoAnualPorEmpleado: costoAnualPorEmpleado.toFixed(2)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!contactData.nombre || !contactData.email || !contactData.empresa) {
      alert('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    const impact = calculateImpact()

    const formData = new FormData()
    formData.append('nombre', contactData.nombre)
    formData.append('email', contactData.email)
    formData.append('empresa', contactData.empresa)
    formData.append('herramienta', 'Calculadora Rotación')
    formData.append('costo_anual', `$${parseFloat(impact.costoTotal).toLocaleString()}`)
    formData.append('_subject', `Nuevo cálculo: Rotación - ${contactData.empresa}`)

    try {
      await fetch('https://formspree.io/f/myzklpzn', {
        method: 'POST',
        body: formData
      })
      alert('✅ Cálculo enviado. Te enviaremos más información.')
      setStep('inputs')
      setContactData({ nombre: '', email: '', empresa: '' })
    } catch (error) {
      alert('Error enviando. Intenta de nuevo.')
    }
    setLoading(false)
  }

  const impact = calculateImpact()

  if (step === 'inputs') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">💰 Calculadora de Costo por Rotación</h2>
          <p className="text-gray-600 mb-6">
            Descubre cuánto te cuesta realmente la rotación de personal en tu empresa.
          </p>
        </div>

        <motion.div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Cantidad de colaboradores
            </label>
            <input
              type="number"
              value={inputs.colaboradores}
              onChange={(e) => handleInputChange('colaboradores', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Salario promedio mensual (S/)
            </label>
            <input
              type="number"
              value={inputs.salarioPromedio}
              onChange={(e) => handleInputChange('salarioPromedio', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Porcentaje de rotación anual (%)
            </label>
            <input
              type="number"
              value={inputs.rotacionAnual}
              onChange={(e) => handleInputChange('rotacionAnual', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Referencia: 20% es normal, 30%+ es alto</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Costo de reclutamiento por persona (S/)
            </label>
            <input
              type="number"
              value={inputs.costosReclutamiento}
              onChange={(e) => handleInputChange('costosReclutamiento', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Costo de capacitación (S/)
            </label>
            <input
              type="number"
              value={inputs.costosCapacitacion}
              onChange={(e) => handleInputChange('costosCapacitacion', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Días de pérdida de productividad (nuevo empleado)
            </label>
            <input
              type="number"
              value={inputs.diasProductividad}
              onChange={(e) => handleInputChange('diasProductividad', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setStep('result')}
            className="w-full px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold"
          >
            Ver mi costo de rotación
          </motion.button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-red-50 p-8 rounded-lg mb-8 border-l-4 border-red-600">
        <p className="text-gray-600 text-sm mb-2">Costo anual por rotación:</p>
        <h2 className="text-4xl font-bold text-red-600 mb-4">S/ {parseFloat(impact.costoTotal).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</h2>
        <p className="text-sm text-gray-600">Por año en tu empresa</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600">Empleados rotados/año</p>
          <p className="text-2xl font-bold text-gray-900">{impact.colaboradoresRotados}</p>
        </motion.div>
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600">Por empleado</p>
          <p className="text-2xl font-bold text-gray-900">S/ {parseFloat(impact.costoAnualPorEmpleado).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</p>
        </motion.div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">📊 Desglose de costos:</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">Costos directos (reclutamiento + capacitación)</span>
            <span className="font-semibold">S/ {parseFloat(impact.costosDirectos).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Pérdida de productividad</span>
            <span className="font-semibold">S/ {parseFloat(impact.costosPerdidaProductividad).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="border-t pt-3 flex justify-between">
            <span className="text-gray-900 font-semibold">Total anual</span>
            <span className="font-bold text-red-600">S/ {parseFloat(impact.costoTotal).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">📩 Recibe un plan de acción:</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Tu nombre"
            value={contactData.nombre}
            onChange={(e) => setContactData({ ...contactData, nombre: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Tu email"
            value={contactData.email}
            onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Nombre de tu empresa"
            value={contactData.empresa}
            onChange={(e) => setContactData({ ...contactData, empresa: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar análisis a mi email'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}
