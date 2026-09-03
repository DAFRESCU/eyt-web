import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import Seo from '../components/Seo.jsx'
import Hero from '../components/Hero.jsx'
import PainPoints from '../components/PainPoints.jsx'
import Stats from '../components/Stats.jsx'
import Services from '../components/Services.jsx'
import Proceso from '../components/Proceso.jsx'
import PorQueET from '../components/PorQueET.jsx'
import Testimonios from '../components/Testimonios.jsx'
import CTASection from '../components/CTASection.jsx'

const ScrollStory = lazy(() => import('../components/ScrollStory.jsx'))

// Only starts fetching the ScrollStory chunk (GSAP included) once the user
// scrolls near it, instead of on Home mount — keeps it out of the network
// entirely for visitors who never scroll this far.
function LazyScrollStory() {
  const placeholderRef = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    if (shouldLoad) return undefined
    const el = placeholderRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true)
      return undefined
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '150px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [shouldLoad])

  if (!shouldLoad) {
    return <div ref={placeholderRef} style={{ height: '100vh', background: '#1B2A4A' }} />
  }

  return (
    <Suspense fallback={<div style={{ height: '100vh', background: '#1B2A4A' }} />}>
      <ScrollStory />
    </Suspense>
  )
}

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
      <LazyScrollStory />
      <Services />
      <Proceso />
      <PorQueET />
      <Testimonios />
      <CTASection />
    </>
  )
}
