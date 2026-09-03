import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ScrollStory.css'

gsap.registerPlugin(ScrollTrigger)

// Shared coordinate system reused across scenes so the "figure" reads as the
// same evolving entity from scene to scene (org node -> glow -> silhouette).
const VB = '0 0 800 450'
const CENTER = { x: 400, y: 190 }

// Real E&T service units — content grounded in src/data/content.js (SERVICES
// U1-U5) and in the stats/sources supplied for this scene-by-scene rewrite.
const SCENES = [
  {
    id: 'orden',
    title: 'Estrategia y Organización',
    blurb: 'Ordenamos la estructura de tu empresa: roles claros, jerarquía definida y remuneración justa.',
    statQuote: 'Las empresas en el cuartil superior de salud organizacional generan 3 veces más retorno para accionistas',
    statSource: 'McKinsey, Organizational Health Index',
    icons: [
      { type: 'hierarchy', label: 'Jerarquía', x: 220, y: 50 },
      { type: 'role', label: 'Claridad de roles', x: 730, y: 55 },
      { type: 'salary', label: 'Remuneración', x: 70, y: 400 },
      { type: 'tasks', label: 'Funciones', x: 730, y: 400 },
    ],
  },
  {
    id: 'talento',
    title: 'Talento y Selección',
    blurb: 'Atraemos y evaluamos al talento correcto, con un onboarding que asegura que se quede.',
    statQuote: 'Un onboarding sólido mejora la retención de nuevas contrataciones en 82%',
    statSource: 'SHRM',
    icons: [
      { type: 'recruit', label: 'Reclutamiento', x: 90, y: 90 },
      { type: 'fit', label: 'Ajuste cultural', x: 710, y: 90 },
      { type: 'onboarding', label: 'Onboarding', x: 90, y: 390 },
      { type: 'interview', label: 'Entrevista estructurada', x: 710, y: 390 },
    ],
  },
  {
    id: 'formacion',
    title: 'Capacitación y Desarrollo',
    blurb: 'Formamos habilidades reales, con aplicación práctica y rutas de certificación.',
    statQuote: 'El 94% de los empleados permanecería más tiempo en una empresa que invierte en su desarrollo',
    statSource: 'LinkedIn Learning, Workplace Learning Report',
    icons: [
      { type: 'training', label: 'Formación continua', x: 240, y: 190 },
      { type: 'practice', label: 'Aplicación práctica', x: 560, y: 190 },
      { type: 'growth', label: 'Desarrollo de habilidades', x: 240, y: 340 },
      { type: 'certificate', label: 'Certificación', x: 560, y: 340 },
    ],
  },
  {
    id: 'apoyo',
    title: 'Bienestar y Gestión Social',
    blurb: 'Acompañamos a tu equipo en salud, licencias y cumplimiento normativo, con SUNAFIL como aliado.',
    statQuote: 'Las organizaciones que promueven el bienestar ven un incremento de 21% en productividad',
    statSource: 'Gallup',
    icons: [
      { type: 'calendar', label: 'Licencias y permisos', x: 210, y: 340 },
      { type: 'handshake', label: 'Acompañamiento', x: 590, y: 340 },
    ],
  },
  {
    id: 'resultado',
    title: 'Clima y Cultura',
    blurb: 'Medimos el clima, reconocemos el desempeño y construimos un equipo cohesionado.',
    statQuote: 'Los equipos con bajo compromiso tienen rotación hasta 43% más alta',
    statSource: 'People Element, 2024',
    icons: [
      { type: 'star', label: 'Reconocimiento', x: 90, y: 90 },
      { type: 'feedback', label: 'Feedback continuo', x: 710, y: 90 },
      { type: 'gauge', label: 'Medición de clima', x: 90, y: 300 },
      { type: 'team', label: 'Cohesión de equipo', x: 710, y: 300 },
    ],
  },
]

// Deterministic pseudo-random jitter used for the torn-paper reveal edge —
// fixed so the effect is stable across renders/reduced-motion checks.
const TEAR_SEED = [0.6, -0.85, 1, -0.35, 0.5, -1, 0.75, -0.5, 0.9, -0.25]

function tornClipPath(progress, amplitude = 7) {
  const baseY = progress * 100
  const localAmp = amplitude * (1 - progress)
  const pts = [[0, 0], [100, 0]]
  const M = TEAR_SEED.length
  for (let i = 0; i < M; i++) {
    const t = i / (M - 1)
    const x = 100 - t * 100
    const y = Math.max(0, Math.min(100, baseY + TEAR_SEED[i] * localAmp))
    pts.push([x, y])
  }
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(', ')})`
}

// Simple noise-burst "whoosh" synthesized with Web Audio API — no external
// asset, so it never touches the bundle or the network.
function playWhoosh(ctx) {
  if (!ctx) return
  const duration = 0.35
  const bufferSize = Math.floor(ctx.sampleRate * duration)
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.Q.value = 0.7
  filter.frequency.setValueAtTime(1800, ctx.currentTime)
  filter.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + duration)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)

  noise.connect(filter).connect(gain).connect(ctx.destination)
  noise.start()
  noise.stop(ctx.currentTime + duration)
}

// A minimalist human silhouette (head + shoulders), stroked once via
// stroke-dashoffset so it reads as "drawn by an invisible pencil".
function SilhouettePath({ innerRef, ...props }) {
  return (
    <path
      ref={innerRef}
      d={`M ${CENTER.x} ${CENTER.y - 46}
          m -20 0
          a 20 20 0 1 0 40 0
          a 20 20 0 1 0 -40 0
          M ${CENTER.x - 34} ${CENTER.y + 44}
          C ${CENTER.x - 34} ${CENTER.y - 4}, ${CENTER.x - 20} ${CENTER.y - 20}, ${CENTER.x} ${CENTER.y - 20}
          C ${CENTER.x + 20} ${CENTER.y - 20}, ${CENTER.x + 34} ${CENTER.y - 4}, ${CENTER.x + 34} ${CENTER.y + 44}`}
      fill="none"
      {...props}
    />
  )
}

// Unified line-art icon set for the floating badges + Scene 3's assembling
// pieces — same stroke language (round caps/joins, ~1.6px) as the rest of
// the story.
function Glyph({ type }) {
  const stroke = '#EFE7DA'
  const c = { stroke, strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (type) {
    case 'hierarchy':
      return (
        <g transform="translate(-9,-9)" {...c}>
          <rect x="5" y="0" width="8" height="5" rx="1" />
          <rect x="0" y="12" width="8" height="5" rx="1" />
          <rect x="10" y="12" width="8" height="5" rx="1" />
          <path d="M9 5v3M4 12v-2h10v2" />
        </g>
      )
    case 'role':
      return (
        <g transform="translate(-8,-9)" {...c}>
          <circle cx="8" cy="4" r="3.4" />
          <path d="M2 17c0-4 3-6.5 6-6.5s6 2.5 6 6.5" />
          <path d="M5.5 12.5l1.7 1.7L11 10" />
        </g>
      )
    case 'salary':
      return (
        <g transform="translate(-9,-9)" {...c}>
          <circle cx="9" cy="9" r="8.5" />
          <path d="M9 4.5v9M11.5 6.3c0-1-1-1.8-2.5-1.8s-2.5.8-2.5 1.8 1 1.5 2.5 1.8 2.5.9 2.5 1.9-1 1.8-2.5 1.8-2.5-.8-2.5-1.8" />
        </g>
      )
    case 'tasks':
      return (
        <g transform="translate(-9,-9)" {...c}>
          <path d="M0 2h18M0 9h18M0 16h18" />
        </g>
      )
    case 'recruit':
      return (
        <g transform="translate(-8,-8)" {...c}>
          <circle cx="7" cy="7" r="6" />
          <line x1="11.5" y1="11.5" x2="17" y2="17" />
        </g>
      )
    case 'fit':
      return (
        <g transform="translate(-10,-7)" {...c}>
          <circle cx="7" cy="7" r="6.5" />
          <circle cx="13" cy="7" r="6.5" />
        </g>
      )
    case 'onboarding':
      return (
        <g transform="translate(-9,-9)" {...c}>
          <path d="M2 0h10v18H2z" />
          <path d="M10 9h8M15 5.5l3.5 3.5-3.5 3.5" />
        </g>
      )
    case 'interview':
      return (
        <g transform="translate(-9,-9)" {...c}>
          <path d="M1 1h16v11H8l-4 4v-4H1z" />
          <path d="M4.5 6h9M4.5 9h6" />
        </g>
      )
    case 'training':
      return (
        <g transform="translate(-9,-8)" {...c}>
          <path d="M0 2 h8 a2 2 0 0 1 2 2 v12 h-8 a2 2 0 0 0 -2 2 z" />
          <path d="M18 2 h-8 a2 2 0 0 0 -2 2 v12 a2 2 0 0 1 2 -2 h8 z" />
        </g>
      )
    case 'practice':
      return (
        <g transform="translate(-9,-9)" {...c}>
          <path d="M11 2l5 5-9 9-5 1 1-5z" />
          <path d="M9 4l5 5" />
        </g>
      )
    case 'growth':
      return (
        <g transform="translate(-9,-8)" {...c}>
          <path d="M0 16h18" />
          <path d="M3 16V9M9 16V4M15 16v-6" />
        </g>
      )
    case 'certificate':
      return (
        <g transform="translate(-8,-9)" {...c}>
          <circle cx="8" cy="6" r="6" />
          <path d="M8 2.5l1.2 2.4 2.6.4-1.9 1.8.4 2.6L8 8.5l-2.3 1.2.4-2.6-1.9-1.8 2.6-.4z" />
          <path d="M5.5 11.5L4 18l4-2 4 2-1.5-6.5" />
        </g>
      )
    case 'calendar':
      return (
        <g transform="translate(-9,-9)" {...c}>
          <rect x="0" y="2" width="18" height="16" rx="2" />
          <path d="M0 7h18M5 0v4M13 0v4" />
          <path d="M6 12l2 2 4-4" />
        </g>
      )
    case 'handshake':
      return (
        <g transform="translate(-10,-6)" {...c}>
          <path d="M0 3l5-2 5 3 5-3 5 2-5 6-3-2-2 2-2-2-3 2z" />
        </g>
      )
    case 'star':
      return (
        <g transform="translate(-9,-9)" {...c}>
          <path d="M9 0l2.5 6.2 6.5.5-5 4.3 1.6 6.4L9 14l-5.6 3.4L5 11 0 6.7l6.5-.5z" />
        </g>
      )
    case 'feedback':
      return (
        <g transform="translate(-9,-9)" {...c}>
          <path d="M0 0h12v7H5l-3 3V7H0z" />
          <path d="M9 10h9v7h-2v3l-3-3H9z" />
        </g>
      )
    case 'gauge':
      return (
        <g transform="translate(-9,-9)" {...c}>
          <path d="M1 15a8 8 0 0 1 16 0" />
          <path d="M9 15l4-5" />
          <circle cx="9" cy="15" r="1.2" fill={stroke} stroke="none" />
        </g>
      )
    case 'team':
      return (
        <g transform="translate(-10,-8)" {...c}>
          <circle cx="6" cy="5" r="3.2" />
          <circle cx="14" cy="5" r="3.2" />
          <path d="M1 17c0-3.3 2.2-5.5 5-5.5s5 2.2 5 5.5" />
          <path d="M9 17c0-3.3 2.2-5.5 5-5.5s5 2.2 5 5.5" />
        </g>
      )
    default:
      return null
  }
}

function hexPoints(cx, cy, r) {
  const pts = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2
    pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)])
  }
  return pts.map((p) => p.join(',')).join(' ')
}

// A small floating badge (circle + Glyph + label) used for the 3-4 icons
// that orbit each scene's central visual.
function IconBadge({ x, y, type, label, innerRef, accent = '#C98A2B' }) {
  return (
    <g ref={innerRef} transform={`translate(${x}, ${y})`} className="scroll-story__float-icon">
      <circle r="25" fill="#24365c" stroke={accent} strokeWidth="1.3" />
      <Glyph type={type} />
      <text y="42" textAnchor="middle" className="scroll-story__caption scroll-story__caption--small">
        {label}
      </text>
    </g>
  )
}

// Title + short blurb + cited stat, grouped in one element so it enters and
// exits as a single readable block — this is also the fix for the "titles
// piling up" bug: previously each scene's <h3> only ever animated IN, and
// relied on the parent scene layer's opacity (which recedes to 0.3, not 0)
// to "hide" it, so every past title stayed dimly stacked at the same
// top-left position. Now the copy block gets its own explicit fade/slide
// OUT to opacity 0 the moment the next scene begins.
function SceneCopy({ copyRef, scene, staticMode = false }) {
  return (
    <div ref={copyRef} className={`scroll-story__copy ${staticMode ? 'scroll-story__copy--static' : ''}`}>
      <h3 className="scroll-story__title">{scene.title}</h3>
      <p className="scroll-story__blurb">{scene.blurb}</p>
      <p className="scroll-story__stat">
        &ldquo;{scene.statQuote}&rdquo;
        <span className="scroll-story__stat-source">Fuente: {scene.statSource}</span>
      </p>
    </div>
  )
}

function HeartIcon({ x, y, innerRef }) {
  return (
    <g ref={innerRef} transform={`translate(${x}, ${y})`}>
      <path
        d="M0 8 C -14 -4, -30 6, 0 26 C 30 6, 14 -4, 0 8 Z"
        fill="none"
        stroke="#E4A6B4"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </g>
  )
}

function ShieldIcon({ x, y, innerRef }) {
  return (
    <g ref={innerRef} transform={`translate(${x}, ${y})`}>
      <path
        d="M0 -22 L22 -13 V6 C22 20 11 28 0 32 C-11 28 -22 20 -22 6 V-13 Z"
        fill="none"
        stroke="#C98A2B"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M-9 2 L-2 10 L11 -6" fill="none" stroke="#C98A2B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
}

export default function ScrollStory() {
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const sceneLayerRefs = useRef([])
  const dustRefs = useRef([])
  const audioCtxRef = useRef(null)
  const lastSceneRef = useRef(0)

  const [activeScene, setActiveScene] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [checkedMotionPref, setCheckedMotionPref] = useState(false)
  const [muted, setMuted] = useState(true)

  // Scene 1 — org chart node refs
  const ordenNodesRef = useRef([])
  const ordenLinesRef = useRef([])
  const ordenCopyRef = useRef(null)
  const ordenIconsRef = useRef([])

  // Scene 2
  const talentoGlowRef = useRef(null)
  const talentoSilRef = useRef(null)
  const talentoBoxRef = useRef(null)
  const talentoCopyRef = useRef(null)
  const talentoIconsRef = useRef([])

  // Scene 3
  const formacionSilRef = useRef(null)
  const formacionHexRef = useRef([])
  const formacionCopyRef = useRef(null)

  // Scene 4
  const apoyoSilRef = useRef(null)
  const apoyoHeartRef = useRef(null)
  const apoyoShieldRef = useRef(null)
  const apoyoLineLeftRef = useRef(null)
  const apoyoLineRightRef = useRef(null)
  const apoyoCheckLeftRef = useRef(null)
  const apoyoCheckRightRef = useRef(null)
  const apoyoCopyRef = useRef(null)
  const apoyoIconsRef = useRef([])

  // Scene 5
  const resultadoSilRef = useRef(null)
  const resultadoExtraRef = useRef([])
  const resultadoCurveRef = useRef(null)
  const resultadoCtaRef = useRef(null)
  const resultadoCopyRef = useRef(null)
  const resultadoIconsRef = useRef([])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    setCheckedMotionPref(true)
    const onChange = (e) => setReducedMotion(e.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  useLayoutEffect(() => {
    if (!checkedMotionPref || reducedMotion) return undefined

    let onMouseMove
    let onResize

    const applyPinHeight = () => {
      const isMobile = window.matchMedia('(max-width: 767px)').matches
      if (rootRef.current) rootRef.current.style.height = isMobile ? '350vh' : '500vh'
    }
    applyPinHeight()

    const ctx = gsap.context(() => {
      const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches
      const scenes = sceneLayerRefs.current
      const sceneCount = SCENES.length
      const copyRefs = [ordenCopyRef, talentoCopyRef, formacionCopyRef, apoyoCopyRef, resultadoCopyRef]
      const iconRefs = [ordenIconsRef, talentoIconsRef, formacionHexRef, apoyoIconsRef, resultadoIconsRef]

      // --- initial states -------------------------------------------------
      gsap.set(scenes, { autoAlpha: 1 })
      scenes.forEach((el, i) => {
        if (i === 0) {
          gsap.set(el, { clipPath: tornClipPath(1), scale: 1, filter: 'blur(0px)', opacity: 1 })
        } else {
          gsap.set(el, { clipPath: tornClipPath(0), scale: 1.05, filter: 'blur(4px)', opacity: 1 })
        }
      })

      copyRefs.forEach((ref) => gsap.set(ref.current, { y: 16, opacity: 0 }))
      iconRefs.forEach((ref) => {
        if (ref.current.length) gsap.set(ref.current, { scale: 0, opacity: 0, transformOrigin: '50% 50%' })
      })

      // Scene 1: scattered nodes
      const ordenSeeds = [
        { r: -35, x: -60, y: -30, s: 0.8 },
        { r: 28, x: 90, y: -60, s: 1.2 },
        { r: -18, x: -120, y: 40, s: 0.9 },
        { r: 40, x: 60, y: 90, s: 1.1 },
        { r: -30, x: -80, y: 110, s: 0.85 },
        { r: 20, x: 130, y: 20, s: 1 },
        { r: -45, x: -40, y: -100, s: 1.15 },
        { r: 33, x: 100, y: -20, s: 0.9 },
        { r: -22, x: 20, y: 140, s: 1.05 },
      ]
      ordenNodesRef.current.forEach((el, i) => {
        const seed = ordenSeeds[i % ordenSeeds.length]
        gsap.set(el, { x: seed.x, y: seed.y, rotation: seed.r, scale: seed.s, transformOrigin: '50% 50%' })
      })
      gsap.set(ordenLinesRef.current, { opacity: 0 })
      ordenLinesRef.current.forEach((el) => {
        if (!el) return
        const len = el.getTotalLength ? el.getTotalLength() : 100
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
      })

      // Scene 2: background quadrant + glow + silhouette draw
      gsap.set(talentoBoxRef.current, { opacity: 0, scale: 0.92, transformOrigin: '50% 50%' })
      gsap.set(talentoGlowRef.current, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' })
      const talentoLen = talentoSilRef.current?.getTotalLength ? talentoSilRef.current.getTotalLength() : 220
      gsap.set(talentoSilRef.current, { strokeDasharray: talentoLen, strokeDashoffset: talentoLen })

      // Scene 3: assembling pieces (now doubling as the 4 floating icons).
      // Note: only rotation/scale/opacity are GSAP-driven here, deliberately
      // never x/y — each badge's position comes solely from its JSX
      // transform="translate(...)" attribute. GSAP's x/y setters replace
      // (not add to) an element's translate component, so animating x/y on
      // top of that attribute would discard the intended position the
      // moment gsap.set first ran (this is what caused all 4 hex badges to
      // collapse onto the same spot before this fix).
      formacionHexRef.current.forEach((el) => {
        gsap.set(el, { opacity: 0, rotation: gsap.utils.random(-30, 30), transformOrigin: '50% 50%' })
      })

      // Scene 4: side icons + connectors
      gsap.set([apoyoHeartRef.current, apoyoShieldRef.current], { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' })
      ;[apoyoLineLeftRef.current, apoyoLineRightRef.current].forEach((el) => {
        if (!el) return
        const len = el.getTotalLength ? el.getTotalLength() : 100
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
      })
      gsap.set([apoyoCheckLeftRef.current, apoyoCheckRightRef.current], { scale: 0, transformOrigin: '50% 50%' })

      // Scene 5: extra silhouettes + curve + CTA
      resultadoExtraRef.current.forEach((el) => {
        gsap.set(el, { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' })
      })
      const curveLen = resultadoCurveRef.current?.getTotalLength ? resultadoCurveRef.current.getTotalLength() : 400
      gsap.set(resultadoCurveRef.current, { strokeDasharray: curveLen, strokeDashoffset: curveLen })
      gsap.set(resultadoCtaRef.current, { y: 16, opacity: 0 })

      // --- master timeline --------------------------------------------------
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: stageRef.current,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 1,
          onUpdate(self) {
            const idx = Math.min(sceneCount - 1, Math.floor(self.progress * sceneCount))
            if (idx !== lastSceneRef.current) {
              lastSceneRef.current = idx
              setActiveScene(idx)
              if (!muted && audioCtxRef.current) playWhoosh(audioCtxRef.current)
            }
          },
        },
      })

      const ICON_EASE = 'elastic.out(1, 0.65)'

      for (let i = 0; i < sceneCount; i++) {
        const el = scenes[i]
        const proxy = { p: i === 0 ? 1 : 0 }

        if (i > 0) {
          // outgoing previous scene recedes (graphics dim, don't vanish) —
          // its copy block and its labeled icon badges explicitly fade all
          // the way to 0, though, so text/labels never pile up or bleed
          // through the incoming scene (icon badges across scenes sit at
          // similar "corner" coordinates, so a captioned badge left at 0.3
          // opacity would otherwise peek out wherever the new scene's own
          // icon hasn't entered yet).
          tl.to(scenes[i - 1], { scale: 0.95, opacity: 0.3, duration: 0.15 }, i)
          tl.to(copyRefs[i - 1].current, { y: -16, opacity: 0, duration: 0.12 }, i)
          if (iconRefs[i - 1].current.length) {
            tl.to(iconRefs[i - 1].current, { opacity: 0, scale: 0.85, duration: 0.15 }, i)
          }
          tl.to(proxy, {
            p: 1,
            duration: 0.15,
            onUpdate: () => {
              el.style.clipPath = tornClipPath(proxy.p)
            },
          }, i)
          tl.to(el, { scale: 1, filter: 'blur(0px)', duration: 0.15 }, i)
        }

        // copy block entrance (title + blurb + stat, all together)
        tl.to(copyRefs[i].current, { y: 0, opacity: 1, duration: 0.16 }, i + 0.02)

        // scene-specific content beats, scheduled inside this scene's 20% slice
        if (i === 0) {
          tl.to(ordenNodesRef.current, {
            x: 0, y: 0, rotation: 0, scale: 1, duration: 0.42, ease: 'power3.out', stagger: 0.03,
          }, i + 0.12)
          tl.to(ordenIconsRef.current, {
            scale: 1, opacity: 1, duration: 0.3, stagger: 0.09, ease: ICON_EASE,
          }, i + 0.5)
          tl.to(ordenLinesRef.current, { opacity: 1, strokeDashoffset: 0, duration: 0.25, stagger: 0.03 }, i + 0.62)
        }

        if (i === 1) {
          tl.to(talentoBoxRef.current, { opacity: 1, scale: 1, duration: 0.15 }, i + 0.17)
          tl.to(talentoIconsRef.current, {
            scale: 1, opacity: 1, duration: 0.3, stagger: 0.09, ease: ICON_EASE,
          }, i + 0.35)
          tl.to(talentoGlowRef.current, { opacity: 1, scale: 1, duration: 0.1, repeat: 3, yoyo: true }, i + 0.4)
          tl.to(talentoSilRef.current, { strokeDashoffset: 0, duration: 0.3, ease: 'none' }, i + 0.62)
          tl.to(talentoGlowRef.current, { opacity: 0, duration: 0.08 }, i + 0.9)
        }

        if (i === 2) {
          tl.to(formacionHexRef.current, {
            opacity: 1, rotation: 0, scale: 1, duration: 0.42, ease: ICON_EASE, stagger: 0.09,
          }, i + 0.2)
        }

        if (i === 3) {
          tl.to([apoyoHeartRef.current, apoyoShieldRef.current], {
            opacity: 1, scale: 1, duration: 0.2, stagger: 0.08, ease: 'back.out(2)',
          }, i + 0.2)
          tl.to(apoyoIconsRef.current, {
            scale: 1, opacity: 1, duration: 0.3, stagger: 0.09, ease: ICON_EASE,
          }, i + 0.32)
          tl.to([apoyoLineLeftRef.current, apoyoLineRightRef.current], {
            strokeDashoffset: 0, duration: 0.2, stagger: 0.05,
          }, i + 0.45)
          tl.to([apoyoCheckLeftRef.current, apoyoCheckRightRef.current], {
            scale: 1, duration: 0.15, stagger: 0.05, ease: 'back.out(3)',
          }, i + 0.68)
        }

        if (i === 4) {
          tl.to(resultadoIconsRef.current, {
            scale: 1, opacity: 1, duration: 0.3, stagger: 0.09, ease: ICON_EASE,
          }, i + 0.2)
          tl.to(resultadoExtraRef.current, {
            opacity: 1, scale: 1, duration: 0.25, stagger: 0.06, ease: 'back.out(1.6)',
          }, i + 0.38)
          tl.to(resultadoCurveRef.current, { strokeDashoffset: 0, duration: 0.3, ease: 'none' }, i + 0.55)
          tl.to(resultadoCtaRef.current, { y: 0, opacity: 1, duration: 0.15 }, i + 0.85)
        }
      }

      // --- cursor parallax (skip on touch devices) --------------------------
      if (!isCoarsePointer) {
        const quickSetters = dustRefs.current.map((el) => ({
          x: gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' }),
          y: gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' }),
        }))
        const depths = [0.4, 0.7, 1, 0.55, 0.85, 0.65, 1, 0.5]

        onMouseMove = (e) => {
          const st = tl.scrollTrigger
          if (!st || !st.isActive) return
          const rect = stageRef.current.getBoundingClientRect()
          const nx = (e.clientX - rect.left) / rect.width - 0.5
          const ny = (e.clientY - rect.top) / rect.height - 0.5
          quickSetters.forEach((setter, i) => {
            const depth = depths[i % depths.length]
            setter.x(nx * 18 * depth)
            setter.y(ny * 18 * depth)
          })
        }
        window.addEventListener('mousemove', onMouseMove)
      }

      // --- keep the pinned scroll distance correct across breakpoint changes -
      onResize = () => {
        applyPinHeight()
        ScrollTrigger.refresh()
      }
      window.addEventListener('resize', onResize)
    }, rootRef)

    return () => {
      if (onMouseMove) window.removeEventListener('mousemove', onMouseMove)
      if (onResize) window.removeEventListener('resize', onResize)
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedMotionPref, reducedMotion])

  const toggleMute = () => {
    if (muted) {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext
        if (AudioCtx) audioCtxRef.current = new AudioCtx()
      } else if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume()
      }
    }
    setMuted((m) => !m)
  }

  if (checkedMotionPref && reducedMotion) {
    return <ScrollStoryStatic />
  }

  return (
    <section ref={rootRef} className="scroll-story">
      <div ref={stageRef} className="scroll-story__stage">
        <div className="scroll-story__dust" aria-hidden>
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} ref={(el) => (dustRefs.current[i] = el)} className={`scroll-story__dot scroll-story__dot--${i}`} />
          ))}
        </div>

        <button
          type="button"
          onClick={toggleMute}
          className="scroll-story__mute"
          aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}
          aria-pressed={!muted}
        >
          {muted ? '🔇' : '🔊'}
        </button>

        <div className="scroll-story__progress" role="progressbar" aria-valuenow={activeScene + 1} aria-valuemin={1} aria-valuemax={5}>
          {SCENES.map((s, i) => (
            <span key={s.id} className={`scroll-story__progress-dot ${i === activeScene ? 'is-active' : ''}`} title={s.title} />
          ))}
        </div>

        {/* Scene 1 — Estrategia y Organización */}
        <div ref={(el) => (sceneLayerRefs.current[0] = el)} className="scroll-story__scene">
          <SceneCopy copyRef={ordenCopyRef} scene={SCENES[0]} />
          <svg viewBox={VB} className="scroll-story__svg" aria-hidden>
            {[
              [CENTER.x - 60, 45, 120, 46],
              [166, 165, 108, 44],
              [346, 165, 108, 44],
              [526, 165, 108, 44],
              [82, 285, 96, 42],
              [242, 285, 96, 42],
              [352, 285, 96, 42],
              [462, 285, 96, 42],
              [622, 285, 96, 42],
            ].map(([x, y, w, h], i) => (
              <rect
                key={i}
                ref={(el) => (ordenNodesRef.current[i] = el)}
                x={x} y={y} width={w} height={h} rx="6"
                fill="none" stroke="#E4A6B4" strokeWidth="2"
              />
            ))}
            {[
              [CENTER.x, 91, 220, 165],
              [CENTER.x, 91, 400, 165],
              [CENTER.x, 91, 580, 165],
              [220, 209, 130, 285],
              [220, 209, 290, 285],
              [400, 209, 400, 285],
              [580, 209, 510, 285],
              [580, 209, 670, 285],
            ].map(([x1, y1, x2, y2], i) => (
              <line
                key={i}
                ref={(el) => (ordenLinesRef.current[i] = el)}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#C98A2B" strokeWidth="1.6"
              />
            ))}
            {SCENES[0].icons.map((it, idx) => (
              <IconBadge key={it.label} {...it} innerRef={(el) => (ordenIconsRef.current[idx] = el)} />
            ))}
          </svg>
        </div>

        {/* Scene 2 — Talento y Selección */}
        <div ref={(el) => (sceneLayerRefs.current[1] = el)} className="scroll-story__scene">
          <SceneCopy copyRef={talentoCopyRef} scene={SCENES[1]} />
          <svg viewBox={VB} className="scroll-story__svg" aria-hidden>
            <rect ref={talentoBoxRef} x="150" y="55" width="500" height="340" rx="18" fill="none" stroke="#E4A6B4" strokeOpacity="0.35" strokeWidth="1.4" />
            <circle ref={talentoGlowRef} cx={CENTER.x} cy={CENTER.y - 25} r="34" fill="#6E2438" className="scroll-story__glow" />
            <SilhouettePath innerRef={talentoSilRef} stroke="#E4A6B4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {SCENES[1].icons.map((it, idx) => (
              <IconBadge key={it.label} {...it} innerRef={(el) => (talentoIconsRef.current[idx] = el)} />
            ))}
          </svg>
        </div>

        {/* Scene 3 — Capacitación y Desarrollo */}
        <div ref={(el) => (sceneLayerRefs.current[2] = el)} className="scroll-story__scene">
          <SceneCopy copyRef={formacionCopyRef} scene={SCENES[2]} />
          <svg viewBox={VB} className="scroll-story__svg" aria-hidden>
            <SilhouettePath innerRef={formacionSilRef} stroke="#E4A6B4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {SCENES[2].icons.map((it, i) => (
              <g key={it.label} ref={(el) => (formacionHexRef.current[i] = el)} transform={`translate(${it.x}, ${it.y})`} className="scroll-story__float-icon">
                <polygon points={hexPoints(0, 0, 42)} fill="#2A3F66" stroke="#C98A2B" strokeWidth="1.6" />
                <Glyph type={it.type} />
                <text y="62" textAnchor="middle" className="scroll-story__caption scroll-story__caption--small">
                  {it.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Scene 4 — Bienestar y Gestión Social */}
        <div ref={(el) => (sceneLayerRefs.current[3] = el)} className="scroll-story__scene">
          <SceneCopy copyRef={apoyoCopyRef} scene={SCENES[3]} />
          <svg viewBox={VB} className="scroll-story__svg" aria-hidden>
            <SilhouettePath innerRef={apoyoSilRef} stroke="#E4A6B4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <line ref={apoyoLineLeftRef} x1={CENTER.x - 34} y1={CENTER.y + 10} x2={CENTER.x - 190} y2={CENTER.y - 20} stroke="#E4A6B4" strokeWidth="1.6" />
            <line ref={apoyoLineRightRef} x1={CENTER.x + 34} y1={CENTER.y + 10} x2={CENTER.x + 190} y2={CENTER.y - 20} stroke="#C98A2B" strokeWidth="1.6" />
            <HeartIcon x={CENTER.x - 220} y={CENTER.y - 40} innerRef={apoyoHeartRef} />
            <ShieldIcon x={CENTER.x + 220} y={CENTER.y - 30} innerRef={apoyoShieldRef} />
            <g ref={apoyoCheckLeftRef} transform={`translate(${CENTER.x - 190}, ${CENTER.y - 20})`}>
              <circle r="13" fill="#10B981" />
              <path d="M-5 0 L-1.5 4 L6 -5" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <g ref={apoyoCheckRightRef} transform={`translate(${CENTER.x + 190}, ${CENTER.y - 20})`}>
              <circle r="13" fill="#10B981" />
              <path d="M-5 0 L-1.5 4 L6 -5" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <text x={CENTER.x - 220} y={CENTER.y + 20} textAnchor="middle" className="scroll-story__caption">Salud ocupacional</text>
            <text x={CENTER.x + 220} y={CENTER.y + 20} textAnchor="middle" className="scroll-story__caption">SUNAFIL — aliado</text>
            {SCENES[3].icons.map((it, idx) => (
              <IconBadge key={it.label} {...it} innerRef={(el) => (apoyoIconsRef.current[idx] = el)} />
            ))}
          </svg>
        </div>

        {/* Scene 5 — Clima y Cultura */}
        <div ref={(el) => (sceneLayerRefs.current[4] = el)} className="scroll-story__scene">
          <SceneCopy copyRef={resultadoCopyRef} scene={SCENES[4]} />
          <svg viewBox={VB} className="scroll-story__svg" aria-hidden>
            <SilhouettePath innerRef={resultadoSilRef} stroke="#E4A6B4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {[
              [-95, 15, 0.75],
              [95, 15, 0.75],
              [-55, -10, 0.6],
              [55, -10, 0.6],
            ].map(([dx, dy, scale], i) => (
              <g key={i} ref={(el) => (resultadoExtraRef.current[i] = el)} transform={`translate(${CENTER.x + dx}, ${CENTER.y + dy}) scale(${scale})`}>
                <SilhouettePath stroke="#C98A2B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" transform={`translate(${-CENTER.x}, ${-CENTER.y})`} />
              </g>
            ))}
            <path
              ref={resultadoCurveRef}
              d="M 60 380 C 200 380, 240 300, 340 280 S 480 200, 560 150 S 680 90, 750 60"
              fill="none" stroke="#C98A2B" strokeWidth="3" strokeLinecap="round"
            />
            {SCENES[4].icons.map((it, idx) => (
              <IconBadge key={it.label} {...it} innerRef={(el) => (resultadoIconsRef.current[idx] = el)} />
            ))}
          </svg>
          <div ref={resultadoCtaRef} className="scroll-story__cta">
            <p>¿Listo para ver estos resultados en tu empresa?</p>
            <Link to="/contacto" className="scroll-story__cta-button">
              Agenda tu diagnóstico gratuito de 45 min
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// Static, non-animated fallback for prefers-reduced-motion: reduce — every
// scene is shown at its final/resolved state, stacked as normal sections.
function ScrollStoryStatic() {
  return (
    <section className="scroll-story scroll-story--static">
      {SCENES.map((s, i) => (
        <div key={s.id} className="scroll-story__scene scroll-story__scene--static">
          <SceneCopy scene={s} staticMode />
          <svg viewBox={VB} className="scroll-story__svg" aria-hidden>
            {i === 0 && (
              <>
                {[
                  [CENTER.x - 60, 45, 120, 46],
                  [166, 165, 108, 44],
                  [346, 165, 108, 44],
                  [526, 165, 108, 44],
                  [82, 285, 96, 42],
                  [242, 285, 96, 42],
                  [352, 285, 96, 42],
                  [462, 285, 96, 42],
                  [622, 285, 96, 42],
                ].map(([x, y, w, h], idx) => (
                  <rect key={idx} x={x} y={y} width={w} height={h} rx="6" fill="none" stroke="#E4A6B4" strokeWidth="2" />
                ))}
                {[
                  [CENTER.x, 91, 220, 165], [CENTER.x, 91, 400, 165], [CENTER.x, 91, 580, 165],
                  [220, 209, 130, 285], [220, 209, 290, 285], [400, 209, 400, 285],
                  [580, 209, 510, 285], [580, 209, 670, 285],
                ].map(([x1, y1, x2, y2], idx) => (
                  <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C98A2B" strokeWidth="1.6" />
                ))}
                {s.icons.map((it) => (
                  <IconBadge key={it.label} {...it} />
                ))}
              </>
            )}
            {i === 1 && (
              <>
                <rect x="150" y="55" width="500" height="340" rx="18" fill="none" stroke="#E4A6B4" strokeOpacity="0.35" strokeWidth="1.4" />
                <SilhouettePath stroke="#E4A6B4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                {s.icons.map((it) => (
                  <IconBadge key={it.label} {...it} />
                ))}
              </>
            )}
            {i === 2 && (
              <>
                <SilhouettePath stroke="#E4A6B4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                {s.icons.map((it) => (
                  <g key={it.label} transform={`translate(${it.x}, ${it.y})`} className="scroll-story__float-icon">
                    <polygon points={hexPoints(0, 0, 42)} fill="#2A3F66" stroke="#C98A2B" strokeWidth="1.6" />
                    <Glyph type={it.type} />
                    <text y="62" textAnchor="middle" className="scroll-story__caption scroll-story__caption--small">
                      {it.label}
                    </text>
                  </g>
                ))}
              </>
            )}
            {i === 3 && (
              <>
                <SilhouettePath stroke="#E4A6B4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <line x1={CENTER.x - 34} y1={CENTER.y + 10} x2={CENTER.x - 190} y2={CENTER.y - 20} stroke="#E4A6B4" strokeWidth="1.6" />
                <line x1={CENTER.x + 34} y1={CENTER.y + 10} x2={CENTER.x + 190} y2={CENTER.y - 20} stroke="#C98A2B" strokeWidth="1.6" />
                <HeartIcon x={CENTER.x - 220} y={CENTER.y - 40} />
                <ShieldIcon x={CENTER.x + 220} y={CENTER.y - 30} />
                <g transform={`translate(${CENTER.x - 190}, ${CENTER.y - 20})`}>
                  <circle r="13" fill="#10B981" />
                  <path d="M-5 0 L-1.5 4 L6 -5" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <g transform={`translate(${CENTER.x + 190}, ${CENTER.y - 20})`}>
                  <circle r="13" fill="#10B981" />
                  <path d="M-5 0 L-1.5 4 L6 -5" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <text x={CENTER.x - 220} y={CENTER.y + 20} textAnchor="middle" className="scroll-story__caption">Salud ocupacional</text>
                <text x={CENTER.x + 220} y={CENTER.y + 20} textAnchor="middle" className="scroll-story__caption">SUNAFIL — aliado</text>
                {s.icons.map((it) => (
                  <IconBadge key={it.label} {...it} />
                ))}
              </>
            )}
            {i === 4 && (
              <>
                <SilhouettePath stroke="#E4A6B4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                {[[-95, 15, 0.75], [95, 15, 0.75], [-55, -10, 0.6], [55, -10, 0.6]].map(([dx, dy, scale], idx) => (
                  <g key={idx} transform={`translate(${CENTER.x + dx}, ${CENTER.y + dy}) scale(${scale})`}>
                    <SilhouettePath stroke="#C98A2B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" transform={`translate(${-CENTER.x}, ${-CENTER.y})`} />
                  </g>
                ))}
                <path d="M 60 380 C 200 380, 240 300, 340 280 S 480 200, 560 150 S 680 90, 750 60" fill="none" stroke="#C98A2B" strokeWidth="3" strokeLinecap="round" />
                {s.icons.map((it) => (
                  <IconBadge key={it.label} {...it} />
                ))}
              </>
            )}
          </svg>
          {i === 4 && (
            <div className="scroll-story__cta scroll-story__cta--static">
              <p>¿Listo para ver estos resultados en tu empresa?</p>
              <Link to="/contacto" className="scroll-story__cta-button">
                Agenda tu diagnóstico gratuito de 45 min
              </Link>
            </div>
          )}
        </div>
      ))}
    </section>
  )
}
