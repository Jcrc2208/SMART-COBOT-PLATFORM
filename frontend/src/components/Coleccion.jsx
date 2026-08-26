import { useEffect, useMemo, useRef, useState } from 'react'
import './coleccion.css'

const COLECCION = [
  {
    id: 'PLC-0001',
    nombre: 'Noche de Cedro',
    fecha: '12 feb 2026',
    familia: 'Amaderado',
    piramide: {
      salida: ['Bergamota', 'Pimienta'],
      corazon: ['Cedro', 'Lavanda'],
      fondo: ['Vainilla', 'Ámbar', 'Almizcle'],
    },
  },
  {
    id: 'PLC-0002',
    nombre: 'Amanecer Cítrico',
    fecha: '28 mar 2026',
    familia: 'Cítrico',
    piramide: {
      salida: ['Limón', 'Naranja', 'Menta'],
      corazon: ['Neroli', 'Jazmín'],
      fondo: ['Musgo de roble'],
    },
  },
  {
    id: 'PLC-0003',
    nombre: 'Jardín Secreto',
    fecha: '09 abr 2026',
    familia: 'Floral',
    piramide: {
      salida: ['Pera', 'Rocío'],
      corazon: ['Rosa', 'Peonía'],
      fondo: ['Sándalo', 'Almizcle blanco'],
    },
  },
]

const NOTAS_PERFIL = [
  { nota: 'Frescura', nivel: 85 },
  { nota: 'Dulce', nivel: 55 },
  { nota: 'Especiado', nivel: 40 },
  { nota: 'Amaderado', nivel: 90 },
  { nota: 'Floral', nivel: 70 },
]

const NIVELES = [
  { nombre: 'Novato de Esencias', min: 0 },
  { nombre: 'Alquimista Aprendiz', min: 3 },
  { nombre: 'Perfumista Aficionado', min: 6 },
  { nombre: 'Nariz Experta', min: 10 },
  { nombre: 'Perfumista Maestro', min: 15 },
]

function nivelDe(total) {
  let actual = NIVELES[0]
  let siguiente = null
  for (const n of NIVELES) {
    if (total >= n.min) actual = n
    else if (!siguiente) siguiente = n
  }
  const progreso = siguiente
    ? (total - actual.min) / (siguiente.min - actual.min)
    : 1
  return { ...actual, siguiente, progreso }
}

const TICKS = 28

function PerfilNotas() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setVisible(true), obs.disconnect()),
      { threshold: 0.3 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="perfil-wrap" ref={ref}>
      <p className="perf-sheet-title">Ficha olfativa</p>

      {NOTAS_PERFIL.map((n, i) => {
        const activos = Math.round((n.nivel / 100) * TICKS)
        return (
          <div
            key={n.nota}
            className={`perf-row ${visible ? 'on' : ''}`}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <div className="perf-row-top">
              <span className="perf-name">{n.nota}</span>
              <span className="perf-val">{String(n.nivel).padStart(2, '0')}<em>/100</em></span>
            </div>

            <div className="perf-ticks" role="img" aria-label={`${n.nota}: ${n.nivel} de 100`}>
              {Array.from({ length: TICKS }, (_, t) => (
                <i
                  key={t}
                  className={`tick${t < activos ? ' full' : ''}`}
                  style={{ transitionDelay: `${i * 80 + t * 12}ms` }}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function PerfumeCard({ perfume }) {
  const [abierto, setAbierto] = useState(false)
  const [estado, setEstado] = useState('idle')

  const reordenar = async () => {
    setEstado('enviando')
    await new Promise((r) => setTimeout(r, 1200))
    setEstado('listo')
    setTimeout(() => setEstado('idle'), 2000)
  }

  return (
    <article className="perfume-card">
      <header className="perfume-head">
        <div>
          <h4 className="perfume-name">{perfume.nombre}</h4>
          <p className="perfume-meta">{perfume.fecha}</p>
        </div>
      </header>

      <button
        type="button"
        className={`pyramid-toggle ${abierto ? 'open' : ''}`}
        onClick={() => setAbierto((v) => !v)}
      >
        Pirámide olfativa · {perfume.familia}
        <span className="chevron">▾</span>
      </button>

      {abierto && (
        <div className="pyramid-body">
          {['salida', 'corazon', 'fondo'].map((nivel) => (
            <div key={nivel} className="pyramid-row">
              <span className="pyramid-tier">{nivel}</span>
              <div className="pyramid-notes">
                {perfume.piramide[nivel].map((nota) => (
                  <span key={nota} className="pyramid-chip">{nota}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="perfume-actions">
        <button type="button" className="btn-reorder" onClick={reordenar} disabled={estado === 'enviando'}>
          {estado === 'enviando' ? 'Enviando…' : estado === 'listo' ? '✓ Enviado' : 'Reordenar'}
        </button>
      </div>
    </article>
  )
}

export default function Coleccion() {
  const total = COLECCION.length

  const aromaFirma = useMemo(() => {
    const conteo = {}
    COLECCION.forEach((p) => {
      conteo[p.familia] = (conteo[p.familia] || 0) + 1
    })
    const ordenado = Object.entries(conteo).sort((a, b) => b[1] - a[1])
    if (!ordenado.length) return null
    const [familia, n] = ordenado[0]
    return { familia, pct: Math.round((n / total) * 100) }
  }, [total])

  const nivel = nivelDe(total)

  return (
    <main className="panel coleccion">
      <section className="kpi-grid">
        <article className="kpi-card">
          <span className="kpi-value">{total}</span>
          <span className="kpi-label">Fragancias creadas</span>
        </article>

        <article className="kpi-card">
          <span className="kpi-value">{aromaFirma ? `${aromaFirma.pct}%` : '—'}</span>
          <span className="kpi-label">Aroma firma</span>
          <span className="kpi-extra">{aromaFirma ? aromaFirma.familia : 'Sin datos aún'}</span>
        </article>

        <article className="kpi-card">
          <span className="kpi-value" style={{ fontSize: '1.3rem' }}>{nivel.nombre}</span>
          <span className="kpi-label">Nivel de creador</span>
          <div className="kpi-level-bar">
            <div className="kpi-level-fill" style={{ width: `${Math.round(nivel.progreso * 100)}%` }} />
          </div>
          <span className="kpi-extra">
            {nivel.siguiente ? `Siguiente: ${nivel.siguiente.nombre} (${nivel.siguiente.min})` : 'Nivel máximo alcanzado'}
          </span>
        </article>
      </section>

      <section className="section-card">
        <h3>Mi colección</h3>
        {total ? (
          <div className="catalog-grid">
            {COLECCION.map((p) => (
              <PerfumeCard key={p.id} perfume={p} />
            ))}
          </div>
        ) : (
          <p className="empty-msg">Aún no has fabricado fragancias. Crea tu primera desde el asistente.</p>
        )}
      </section>

      <section className="section-card">
        <h3>Perfil de notas</h3>
        <PerfilNotas />
      </section>
    </main>
  )
}
