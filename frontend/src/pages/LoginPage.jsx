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

const STICKERS = [
  { at: 0 },
  { at: 10 },
  { at: 20 },
  { at: 30 },
  { at: 40 },
]
const STICKER_COUNT = STICKERS.length

const STEPS = [
  { title: 'Diagnóstico', text: 'Platica con el chatbot sobre tus gustos y define tu perfil olfativo.' },
  { title: 'Receta única', text: 'La IA procesa tus datos y crea tu fórmula personalizada.' },
  { title: 'Mezcla ', text: 'El robot colaborativo recibe la fórmula y prepara tu perfume al instante.' },
  { title: 'Tu aroma listo', text: 'Envasamos tu fragancia única y te la entregamos.' },
]

export default function LoginPage() {
  const { user } = useAuth()
  const [active, setActive] = useState('inicio')
   const sceneRef = useRef(null)
  const spaceRef = useRef(null)
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

  return (
    <div className="login-scroll">
      <header className="login-menu">
        <nav className="menu-links">
          <a href="#" className={active === 'inicio' ? 'active' : ''} onClick={scrollToTop}>Inicio</a>
          <a href="#" className={active === 'descubre' ? 'active' : ''} onClick={goDescubre}>Descubre</a>
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

      <section className="login-zone">
        <p className="block-tag">Empecemos</p>
        <h1 ref={loginTitleRef}>{''}</h1>
        <GoogleLoginButton />
        <p className="login-hint">¿Aún no tienes cuenta? Es gratis y tardas segundos.</p>
      </section>
    </div>
  )
}