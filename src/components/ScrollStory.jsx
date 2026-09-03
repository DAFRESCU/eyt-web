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

const SCENES = [
  { id: 'orden', title: 'Orden.', subtitle: 'Estrategia y Organización' },
  { id: 'talento', title: 'Talento.', subtitle: 'Talento y Selección' },
  { id: 'formacion', title: 'Formación.', subtitle: 'Capacitación' },
  { id: 'apoyo', title: 'Apoyo.', subtitle: 'Bienestar y Gestión Social' },
  { id: 'resultado', title: 'Resultado.', subtitle: 'Clima y Cultura' },
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

const HEX_ICONS = ['book', 'search', 'gear', 'bulb', 'target', 'chart']

function HexIcon({ type }) {
  const stroke = '#EFE7DA'
  const common = { stroke, strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (type) {
    case 'book':
      return (
        <g transform="translate(-9,-8)" {...common}>
          <path d="M0 2 h8 a2 2 0 0 1 2 2 v12 h-8 a2 2 0 0 0 -2 2 z" />
          <path d="M18 2 h-8 a2 2 0 0 0 -2 2 v12 a2 2 0 0 1 2 -2 h8 z" />
        </g>
      )
    case 'search':
      return (
        <g transform="translate(-8,-8)" {...common}>
          <circle cx="7" cy="7" r="6" />
          <line x1="11.5" y1="11.5" x2="17" y2="17" />
        </g>
      )
    case 'gear':
      return (
        <g transform="translate(-9,-9)" {...common}>
          <circle cx="9" cy="9" r="3.2" />
          <path d="M9 1v2.4M9 14.6V17M1 9h2.4M14.6 9H17M3.5 3.5l1.7 1.7M12.8 12.8l1.7 1.7M14.5 3.5l-1.7 1.7M5.2 12.8l-1.7 1.7" />
        </g>
      )
    case 'bulb':
      return (
        <g transform="translate(-7,-9)" {...common}>
          <path d="M7 0a6 6 0 0 0-3.2 11.1c.5.35.7.9.7 1.4v1h5v-1c0-.5.2-1.05.7-1.4A6 6 0 0 0 7 0Z" />
          <line x1="4.6" y1="16" x2="9.4" y2="16" />
        </g>
      )
    case 'target':
      return (
        <g transform="translate(-8,-8)" {...common}>
          <circle cx="8" cy="8" r="7" />
          <circle cx="8" cy="8" r="3.5" />
          <circle cx="8" cy="8" r="0.6" fill={stroke} />
        </g>
      )
    case 'chart':
      return (
        <g transform="translate(-9,-8)" {...common}>
          <path d="M0 16h18" />
          <path d="M3 16V9M9 16V4M15 16v-6" />
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
  const ordenTitleRef = useRef(null)

  // Scene 2
  const talentoGlowRef = useRef(null)
  const talentoSilRef = useRef(null)
  const talentoTitleRef = useRef(null)

  // Scene 3
  const formacionSilRef = useRef(null)
  const formacionHexRef = useRef([])
  const formacionTitleRef = useRef(null)

  // Scene 4
  const apoyoSilRef = useRef(null)
  const apoyoHeartRef = useRef(null)
  const apoyoShieldRef = useRef(null)
  const apoyoLineLeftRef = useRef(null)
  const apoyoLineRightRef = useRef(null)
  const apoyoCheckLeftRef = useRef(null)
  const apoyoCheckRightRef = useRef(null)
  const apoyoTitleRef = useRef(null)

  // Scene 5
  const resultadoSilRef = useRef(null)
  const resultadoExtraRef = useRef([])
  const resultadoCurveRef = useRef(null)
  const resultadoCtaRef = useRef(null)
  const resultadoTitleRef = useRef(null)

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

      // --- initial states -------------------------------------------------
      gsap.set(scenes, { autoAlpha: 1 })
      scenes.forEach((el, i) => {
        if (i === 0) {
          gsap.set(el, { clipPath: tornClipPath(1), scale: 1, filter: 'blur(0px)', opacity: 1 })
        } else {
          gsap.set(el, { clipPath: tornClipPath(0), scale: 1.05, filter: 'blur(4px)', opacity: 1 })
        }
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
      gsap.set(ordenTitleRef.current, { y: 24, opacity: 0 })

      // Scene 2: glow + silhouette draw
      gsap.set(talentoGlowRef.current, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' })
      const talentoLen = talentoSilRef.current?.getTotalLength ? talentoSilRef.current.getTotalLength() : 220
      gsap.set(talentoSilRef.current, { strokeDasharray: talentoLen, strokeDashoffset: talentoLen })
      gsap.set(talentoTitleRef.current, { y: 24, opacity: 0 })

      // Scene 3: hexagons fly in
      const hexOrigins = [
        { x: -420, y: -60 },
        { x: 420, y: -80 },
        { x: -380, y: 220 },
        { x: 380, y: 220 },
        { x: 0, y: -320 },
        { x: 0, y: 320 },
      ]
      formacionHexRef.current.forEach((el, i) => {
        const o = hexOrigins[i % hexOrigins.length]
        gsap.set(el, { x: o.x, y: o.y, opacity: 0, rotation: gsap.utils.random(-30, 30), transformOrigin: '50% 50%' })
      })
      gsap.set(formacionTitleRef.current, { y: 24, opacity: 0 })

      // Scene 4: side icons + connectors
      gsap.set([apoyoHeartRef.current, apoyoShieldRef.current], { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' })
      ;[apoyoLineLeftRef.current, apoyoLineRightRef.current].forEach((el) => {
        if (!el) return
        const len = el.getTotalLength ? el.getTotalLength() : 100
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
      })
      gsap.set([apoyoCheckLeftRef.current, apoyoCheckRightRef.current], { scale: 0, transformOrigin: '50% 50%' })
      gsap.set(apoyoTitleRef.current, { y: 24, opacity: 0 })

      // Scene 5: extra silhouettes + curve + CTA
      resultadoExtraRef.current.forEach((el) => {
        gsap.set(el, { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' })
      })
      const curveLen = resultadoCurveRef.current?.getTotalLength ? resultadoCurveRef.current.getTotalLength() : 400
      gsap.set(resultadoCurveRef.current, { strokeDasharray: curveLen, strokeDashoffset: curveLen })
      gsap.set(resultadoCtaRef.current, { y: 16, opacity: 0 })
      gsap.set(resultadoTitleRef.current, { y: 24, opacity: 0 })

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

      for (let i = 0; i < sceneCount; i++) {
        const el = scenes[i]
        const proxy = { p: i === 0 ? 1 : 0 }

        if (i > 0) {
          // outgoing previous scene recedes as this one tears in
          tl.to(scenes[i - 1], { scale: 0.95, opacity: 0.3, duration: 0.15 }, i)
          tl.to(proxy, {
            p: 1,
            duration: 0.15,
            onUpdate: () => {
              el.style.clipPath = tornClipPath(proxy.p)
            },
          }, i)
          tl.to(el, { scale: 1, filter: 'blur(0px)', duration: 0.15 }, i)
        }

        // scene-specific content beats, scheduled inside this scene's 20% slice
        if (i === 0) {
          tl.to(ordenTitleRef.current, { y: 0, opacity: 1, duration: 0.12 }, i)
          tl.to(ordenNodesRef.current, {
            x: 0, y: 0, rotation: 0, scale: 1, duration: 0.45, ease: 'power3.out', stagger: 0.03,
          }, i + 0.12)
          tl.to(ordenLinesRef.current, { opacity: 1, strokeDashoffset: 0, duration: 0.25, stagger: 0.03 }, i + 0.6)
        }

        if (i === 1) {
          tl.to(talentoTitleRef.current, { y: 0, opacity: 1, duration: 0.12 }, i + 0.15)
          tl.to(talentoGlowRef.current, { opacity: 1, scale: 1, duration: 0.12, repeat: 3, yoyo: true }, i + 0.15)
          tl.to(talentoSilRef.current, { strokeDashoffset: 0, duration: 0.35, ease: 'none' }, i + 0.4)
          tl.to(talentoGlowRef.current, { opacity: 0, duration: 0.1 }, i + 0.65)
        }

        if (i === 2) {
          tl.to(formacionTitleRef.current, { y: 0, opacity: 1, duration: 0.12 }, i + 0.15)
          tl.to(formacionHexRef.current, {
            x: 0, y: 0, opacity: 1, rotation: 0, duration: 0.4, ease: 'back.out(1.4)', stagger: 0.07,
          }, i + 0.2)
        }

        if (i === 3) {
          tl.to(apoyoTitleRef.current, { y: 0, opacity: 1, duration: 0.12 }, i + 0.15)
          tl.to([apoyoHeartRef.current, apoyoShieldRef.current], {
            opacity: 1, scale: 1, duration: 0.2, stagger: 0.08, ease: 'back.out(2)',
          }, i + 0.2)
          tl.to([apoyoLineLeftRef.current, apoyoLineRightRef.current], {
            strokeDashoffset: 0, duration: 0.2, stagger: 0.05,
          }, i + 0.45)
          tl.to([apoyoCheckLeftRef.current, apoyoCheckRightRef.current], {
            scale: 1, duration: 0.15, stagger: 0.05, ease: 'back.out(3)',
          }, i + 0.68)
        }

        if (i === 4) {
          tl.to(resultadoTitleRef.current, { y: 0, opacity: 1, duration: 0.12 }, i + 0.15)
          tl.to(resultadoExtraRef.current, {
            opacity: 1, scale: 1, duration: 0.25, stagger: 0.06, ease: 'back.out(1.6)',
          }, i + 0.18)
          tl.to(resultadoCurveRef.current, { strokeDashoffset: 0, duration: 0.3, ease: 'none' }, i + 0.42)
          tl.to(resultadoCtaRef.current, { y: 0, opacity: 1, duration: 0.15 }, i + 0.78)
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

        {/* Scene 1 — Orden */}
        <div ref={(el) => (sceneLayerRefs.current[0] = el)} className="scroll-story__scene">
          <h3 ref={ordenTitleRef} className="scroll-story__title">Orden.<span>Estrategia y Organización</span></h3>
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
          </svg>
        </div>

        {/* Scene 2 — Talento */}
        <div ref={(el) => (sceneLayerRefs.current[1] = el)} className="scroll-story__scene">
          <h3 ref={talentoTitleRef} className="scroll-story__title">Talento.<span>Talento y Selección</span></h3>
          <svg viewBox={VB} className="scroll-story__svg" aria-hidden>
            <circle ref={talentoGlowRef} cx={CENTER.x} cy={CENTER.y - 25} r="34" fill="#6E2438" className="scroll-story__glow" />
            <SilhouettePath innerRef={talentoSilRef} stroke="#E4A6B4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Scene 3 — Formación */}
        <div ref={(el) => (sceneLayerRefs.current[2] = el)} className="scroll-story__scene">
          <h3 ref={formacionTitleRef} className="scroll-story__title">Formación.<span>Capacitación</span></h3>
          <svg viewBox={VB} className="scroll-story__svg" aria-hidden>
            <SilhouettePath innerRef={formacionSilRef} stroke="#E4A6B4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDashoffset="0" />
            {[
              [CENTER.x - 190, CENTER.y - 60],
              [CENTER.x + 190, CENTER.y - 60],
              [CENTER.x - 170, CENTER.y + 120],
              [CENTER.x + 170, CENTER.y + 120],
              [CENTER.x, CENTER.y - 150],
              [CENTER.x, CENTER.y + 170],
            ].map(([cx, cy], i) => (
              <g key={i} ref={(el) => (formacionHexRef.current[i] = el)} transform={`translate(${cx}, ${cy})`}>
                <polygon points={hexPoints(0, 0, 42)} fill="#2A3F66" stroke="#C98A2B" strokeWidth="1.6" />
                <HexIcon type={HEX_ICONS[i % HEX_ICONS.length]} />
              </g>
            ))}
          </svg>
        </div>

        {/* Scene 4 — Apoyo */}
        <div ref={(el) => (sceneLayerRefs.current[3] = el)} className="scroll-story__scene">
          <h3 ref={apoyoTitleRef} className="scroll-story__title">Apoyo.<span>Bienestar y Gestión Social</span></h3>
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
            <text x={CENTER.x - 220} y={CENTER.y + 20} textAnchor="middle" className="scroll-story__caption">Bienestar</text>
            <text x={CENTER.x + 220} y={CENTER.y + 20} textAnchor="middle" className="scroll-story__caption">Cumplimiento SUNAFIL</text>
          </svg>
        </div>

        {/* Scene 5 — Resultado */}
        <div ref={(el) => (sceneLayerRefs.current[4] = el)} className="scroll-story__scene">
          <h3 ref={resultadoTitleRef} className="scroll-story__title">Resultado.<span>Clima y Cultura</span></h3>
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
          <h3 className="scroll-story__title">{s.title}<span>{s.subtitle}</span></h3>
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
              </>
            )}
            {(i === 1 || i === 2 || i === 3 || i === 4) && (
              <SilhouettePath stroke="#E4A6B4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            )}
            {i === 2 && [
              [CENTER.x - 190, CENTER.y - 60], [CENTER.x + 190, CENTER.y - 60],
              [CENTER.x - 170, CENTER.y + 120], [CENTER.x + 170, CENTER.y + 120],
              [CENTER.x, CENTER.y - 150], [CENTER.x, CENTER.y + 170],
            ].map(([cx, cy], idx) => (
              <g key={idx} transform={`translate(${cx}, ${cy})`}>
                <polygon points={hexPoints(0, 0, 42)} fill="#2A3F66" stroke="#C98A2B" strokeWidth="1.6" />
                <HexIcon type={HEX_ICONS[idx % HEX_ICONS.length]} />
              </g>
            ))}
            {i === 3 && (
              <>
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
                <text x={CENTER.x - 220} y={CENTER.y + 20} textAnchor="middle" className="scroll-story__caption">Bienestar</text>
                <text x={CENTER.x + 220} y={CENTER.y + 20} textAnchor="middle" className="scroll-story__caption">Cumplimiento SUNAFIL</text>
              </>
            )}
            {i === 4 && (
              <>
                {[[-95, 15, 0.75], [95, 15, 0.75], [-55, -10, 0.6], [55, -10, 0.6]].map(([dx, dy, scale], idx) => (
                  <g key={idx} transform={`translate(${CENTER.x + dx}, ${CENTER.y + dy}) scale(${scale})`}>
                    <SilhouettePath stroke="#C98A2B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" transform={`translate(${-CENTER.x}, ${-CENTER.y})`} />
                  </g>
                ))}
                <path d="M 60 380 C 200 380, 240 300, 340 280 S 480 200, 560 150 S 680 90, 750 60" fill="none" stroke="#C98A2B" strokeWidth="3" strokeLinecap="round" />
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
