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
    text: 'Hablas con nuestra inteligencia artificial sobre tus gustos, estilo de vida y emociones para crear tu perfil olfativo.',
  },
  {
    title: 'Receta única',
    text: 'La  inteligencia artificial procesa tu perfil y diseña una fórmula 100% personalizada e irrepetible.',
  },
  {
    title: 'Mezcla',
    text: 'El cobot dosifica y mezcla cada esencia con precisión milimétrica para lograr la máxima calidad.',
  },
  {
    title: 'Tu aroma listo',
    text: 'Envasamos tu fragancia en una botella, lista para que disfrutes de un perfume hecho solo para ti.',
  },
];

export default function LoginPage() {
  const { user } = useAuth()
  const [active, setActive] = useState('inicio')
   const sceneRef = useRef(null)
  const spaceRef = useRef(null)
  const aromasRef = useRef(null)
  const aromasRowRef = useRef(null)
  const frameRef = useRef(null)
  const stickerRefs = useRef([])
  const loginTitleRef = useRef(null)
  const stepRefs = useRef([])

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        const cards = aromasRowRef.current?.querySelectorAll('.aroma-card')
        cards?.forEach((card, i) => {
          card.style.transitionDelay = `${i * 120}ms`
          card.classList.add('in')
        })
        obs.disconnect()
      },
      { threshold: 0.15 }
    )
    if (aromasRowRef.current) obs.observe(aromasRowRef.current)
    return () => obs.disconnect()
  }, [])

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
        <h3 className="block-tag">Descubre</h3>
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
        <h3 className="block-tag">Aromas</h3>
        <h2 className="how-title">Nuestros Aromas</h2>
        <div className="aromas-row" ref={aromasRowRef}>
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
              <div className="aroma-img-wrap">
                <img className="aroma-img" src={a.img} alt={a.titulo} />
              </div>
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