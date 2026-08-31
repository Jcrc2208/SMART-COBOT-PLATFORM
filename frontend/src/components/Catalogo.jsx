import { useState } from 'react'
import './coleccion.css'

const CATALOGO = [
  {
    id: 'CAT-0001',
    nombre: 'Noche de Cedro',
    linea: 'Firma',
    familia: 'Amaderado',
    piramide: {
      salida: ['Bergamota', 'Pimienta'],
      corazon: ['Cedro', 'Lavanda'],
      fondo: ['Vainilla', 'Ámbar', 'Almizcle'],
    },
  },
  {
    id: 'CAT-0002',
    nombre: 'Amanecer Cítrico',
    linea: 'Clásica',
    familia: 'Cítrico',
    piramide: {
      salida: ['Limón', 'Naranja', 'Menta'],
      corazon: ['Neroli', 'Jazmín'],
      fondo: ['Musgo de roble'],
    },
  },
  {
    id: 'CAT-0003',
    nombre: 'Jardín Secreto',
    linea: 'Firma',
    familia: 'Floral',
    piramide: {
      salida: ['Pera', 'Rocío'],
      corazon: ['Rosa', 'Peonía'],
      fondo: ['Sándalo', 'Almizcle blanco'],
    },
  },
]

function CatalogoCard({ perfume }) {
  const [abierto, setAbierto] = useState(false)

  return (
    <article className="perfume-card">
      <header className="perfume-head">
        <div>
          <h4 className="perfume-name">{perfume.nombre}</h4>
          <p className="perfume-meta">{perfume.linea}</p>
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
    </article>
  )
}

export default function Catalogo() {
  return (
    <main className="panel coleccion">
      <section className="section-card">
        <h3>Catálogo de la casa</h3>
        <div className="catalog-grid">
          {CATALOGO.map((p) => (
            <CatalogoCard key={p.id} perfume={p} />
          ))}
        </div>
      </section>
    </main>
  )
}
