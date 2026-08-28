import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import GoogleLoginButton from '../components/GoogleLoginButton.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { Navigate } from 'react-router-dom'
import './styles/login.css'

gsap.registerPlugin(ScrollTrigger, TextPlugin)

const frameModules = import.meta.glob('../../images/scene*.jpg', { eager: true })
const FRAMES = Object.keys(frameModules)
  .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]))
  .map((k) => frameModules[k].default)
const FRAME_COUNT = FRAMES.length

const aromaModules = import.meta.glob('../../images/login/*.png', { eager: true })
const florales = aromaModules['../../images/login/florales.png'].default
const citricos = aromaModules['../../images/login/citricos.png'].default
const amaderados = aromaModules['../../images/login/amaderados.png'].default
const verdes = aromaModules['../../images/login/verdes.png'].default

const STICKERS = [
  { at: 0 },
  { at: 10 },
  { at: 20 },
  { at: 30 },
  { at: 40 },
]
const STICKER_COUNT = STICKERS.length

const STEPS = [
  {
    title: 'Diagnóstico',
    text: 'Conversa con nuestro asistente inteligente sobre tus gustos y aversiones, tu estilo de vida y las emociones que quieres transmitir. A partir de esta charla se construye tu perfil olfativo personal: el punto de partida para encontrar el aroma que de verdad te representa.',
  },
  {
    title: 'Receta única',
    text: 'Nuestro motor de IA analiza tu perfil y selecciona, entre miles de combinaciones, las notas de salida, corazón y fondo que mejor se ajustan a ti. El resultado es una fórmula 100% personalizada, pensada para que ningún otro perfume del mundo sea igual al tuyo.',
  },
  {
    title: 'Mezcla',
    text: 'El robot colaborativo recibe la fórmula y trabaja con precisión milimétrica: dosifica cada esencia, respeta los tiempos de maduración y agita la mezcla para lograr la integración perfecta de todos los ingredientes, garantizando consistencia y calidad en cada gota.',
  },
  {
    title: 'Tu aroma listo',
    text: 'Cuando la mezcla alcanza su punto óptimo, envasamos tu fragancia en una botella de edición numerada y la preparamos para entregarte. Solo tienes que desenroscar la tapa y dejar que tu aroma único, creado y fabricado solo para ti, hable por sí mismo.',
  },
]

export default function LoginPage() {
  const { user } = useAuth()
  const [active, setActive] = useState('inicio')
   const sceneRef = useRef(null)
  const spaceRef = useRef(null)
  const aromasRef = useRef(null)
  const frameRef = useRef(null)
  const stickerRefs = useRef([])
  const loginTitleRef = useRef(null)
  const stepRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      stepRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.fromTo(
          el,
          { x: i % 2 ? 80 : -80, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              end: 'top 55%',
              scrub: true,
            },
          }
        )
      })
    })
    const t = setTimeout(() => ScrollTrigger.refresh(), 300)
    return () => {
      ctx.revert()
      clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    const tween = gsap.to(loginTitleRef.current, {
      text: 'Crea tu aroma, único como tú.',
      duration: 2,
      ease: 'power1.out',
      paused: true,
    })
    const st = ScrollTrigger.create({
      trigger: loginTitleRef.current,
      start: 'top 85%',
      onEnter: () => tween.restart(),
      onEnterBack: () => tween.restart(),
    })
    return () => {
      st.kill()
      tween.kill()
    }
  }, [])

  useEffect(() => {
    const zones = [
      { trigger: spaceRef.current, name: 'inicio', start: 'top top', end: 'bottom 50%' },
      { trigger: '.how-zone', name: 'descubre', start: 'top 50%', end: 'bottom 50%' },
      { trigger: aromasRef.current, name: 'aromas', start: 'top 50%', end: 'bottom 50%' },
      { trigger: '.login-zone', name: 'login', start: 'top 50%', end: 'bottom top' },
    ]
    const sts = zones.map(({ trigger, name, start, end }) =>
      ScrollTrigger.create({
        trigger,
        start,
        end,
        onToggle: (self) => self.isActive && setActive(name),
      })
    )
    return () => sts.forEach((st) => st.kill())
  }, [])

  useEffect(() => {
    let lastIdx = 0
    frameRef.current.src = FRAMES[0]
    const st = ScrollTrigger.create({
      trigger: spaceRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress
        const idx = Math.min(FRAME_COUNT - 1, Math.round(p * (FRAME_COUNT - 1)))
        if (idx !== lastIdx) {
          lastIdx = idx
          frameRef.current.src = FRAMES[idx]
        }
STICKERS.forEach((s, i) => {
          const el = stickerRefs.current[i]
          if (!el) return
          const target = s.at / Math.max(1, FRAME_COUNT - 1)
          const o = Math.max(0, Math.min(1, 1 - Math.abs(p - target) * 8))
          gsap.set(el, { autoAlpha: o, y: (1 - o) * 48 })
        })
      },
    })

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)
    return () => {
      st.kill()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  if (user) return <Navigate to="/" replace />

  const scrollToLogin = (e) => {
    e.preventDefault()
    setActive('login')
    document.querySelector('.login-zone')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToTop = (e) => {
    e.preventDefault()
    setActive('inicio')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goDescubre = (e) => {
    e.preventDefault()
    setActive('descubre')
    document.querySelector('.how-zone')?.scrollIntoView({ behavior: 'smooth' })
  }

  const goAromas = (e) => {
    e.preventDefault()
    setActive('aromas')
    aromasRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="login-scroll">
      <header className="login-menu">
        <nav className="menu-links">
          <a href="#" className={active === 'inicio' ? 'active' : ''} onClick={scrollToTop}>Inicio</a>
          <a href="#" className={active === 'descubre' ? 'active' : ''} onClick={goDescubre}>Descubre</a>
          <a href="#" className={active === 'aromas' ? 'active' : ''} onClick={goAromas}>Aromas</a>
        </nav>
        <a href="#" className={active === 'login' ? 'menu-login active' : 'menu-login'} onClick={scrollToLogin}>
          Empecemos
        </a>
      </header>
      <div className="scroll-space" ref={spaceRef}>
        <div className="scene" ref={sceneRef}>
          <img className="frame-img" ref={frameRef} alt="" />
          <div className="sticker-stack">
            {STICKERS.map((s, i) => (
              <div key={i} className="sticker" ref={(el) => (stickerRefs.current[i] = el)} />
            ))}
          </div>
        </div>
      </div>

      <section className="how-zone">
        <p className="block-tag">Descubre</p>
        <h2 className="how-title">¿Cómo funciona?</h2>
        <div className="how-steps">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`step ${i % 2 ? 'right' : 'left'}`}
              ref={(el) => (stepRefs.current[i] = el)}
            >
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="aromas-zone" ref={aromasRef}>
        <p className="block-tag">Aromas</p>
        <h2 className="how-title">Nuestras fragancias</h2>
        <div className="aromas-row">
          {[
            {
              img: florales,
              titulo: 'Florales',
              text: 'La familia más popular. Incluye notas como rosa, jazmín, lavanda, neroli, flor de azahar y peonía.',
            },
            {
              img: citricos,
              titulo: 'Cítricos y Frescos',
              text: 'Aportan energía y vitalidad en las notas de salida. Destacan la bergamota, limón, mandarina, pomelo y notas acuáticas o marinas.',
            },
            {
              img: amaderados,
              titulo: 'Amaderados',
              text: 'Dan estructura, carácter y durabilidad. Los más recurrentes son sándalo, cedro, vetiver y patchouli.',
            },
            {
              img: verdes,
              titulo: 'Aromáticos y Verdes',
              text: 'Frecuentes en perfumería masculina y unisex. Incorporan romero, salvia, menta, albahaca y césped recién cortado.',
            },
          ].map((a) => (
            <div key={a.titulo} className="aroma-card">
              <img className="aroma-img" src={a.img} alt={a.titulo} />
              <h4>{a.titulo}</h4>
              <p>{a.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="login-zone">
        <p className="block-tag">Empecemos</p>
        <h1 ref={loginTitleRef}>{''}</h1>
        <GoogleLoginButton />
        <p className="login-hint">¿Aún no tienes cuenta? Es gratis y tardas segundos.</p>
      </section>
    </div>
  )
}