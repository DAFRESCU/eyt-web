import Seo from '../components/Seo.jsx'
import Hero from '../components/Hero.jsx'
import PainPoints from '../components/PainPoints.jsx'
import Stats from '../components/Stats.jsx'
import Services from '../components/Services.jsx'
import Proceso from '../components/Proceso.jsx'
import PorQueET from '../components/PorQueET.jsx'
import Testimonios from '../components/Testimonios.jsx'
import CTASection from '../components/CTASection.jsx'

export default function Home() {
  return (
    <>
      <Seo
        title="E&T Estrategia y Talento | Consultoría de RR.HH. en Perú"
        description="E&T Estrategia y Talento: consultoría de recursos humanos y gestión organizacional en Arequipa, Cusco e Ica. Método propio, resultados medibles. Diagnóstico gratuito de 45 minutos."
      />
      <Hero />
      <PainPoints />
      <Stats />
      <Services />
      <Proceso />
      <PorQueET />
      <Testimonios />
      <CTASection />
    </>
  )
}
