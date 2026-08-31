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
  {
    id: 'CAT-0004',
    nombre: 'Medianoche de Ámbar',
    linea: 'Exclusiva',
    familia: 'Oriental',
    piramide: {
      salida: ['Azafrán', 'Mandarina'],
      corazon: ['Ámbar', 'Rosa de Damasco'],
      fondo: ['Vainilla', 'Pachulí', 'Benjuí'],
    },
  },
  {
    id: 'CAT-0005',
    nombre: 'Brisa del Mar',
    linea: 'Clásica',
    familia: 'Acuático',
    piramide: {
      salida: ['Brezos', 'Limón'],
      corazon: ['Jazmín', 'Salvia'],
      fondo: ['Musgo de roble', 'Ámbar gris'],
    },
  },
  {
    id: 'CAT-0006',
    nombre: 'Café Negro',
    linea: 'Exclusiva',
    familia: 'Gourmand',
    piramide: {
      salida: ['Bergamota', 'Café'],
      corazon: ['Cardamomo', 'Cacao'],
      fondo: ['Vainilla', 'Sándalo', 'Almizcle'],
    },
  },
  {
    id: 'CAT-0007',
    nombre: 'Silvestre',
    linea: 'Clásica',
    familia: 'Aromático',
    piramide: {
      salida: ['Lavanda', 'Romero', 'Menta'],
      corazon: ['Geranio', 'Espliego'],
      fondo: ['Musgo de roble', 'Vetiver'],
    },
  },
  {
    id: 'CAT-0008',
    nombre: 'Rosa Velada',
    linea: 'Firma',
    familia: 'Floral',
    piramide: {
      salida: ['Lichi', 'Frutos rojos'],
      corazon: ['Rosa', 'Peonía'],
      fondo: ['Almizcle blanco', 'Ámbar'],
    },
  },
  {
    id: 'CAT-0009',
    nombre: 'Tabaco y Miel',
    linea: 'Exclusiva',
    familia: 'Ambarado',
    piramide: {
      salida: ['Ciruela', 'Canela'],
      corazon: ['Tabaco', 'Miel', 'Jazmín'],
      fondo: ['Cuero', 'Vainilla', 'Musgo'],
    },
  },
  {
    id: 'CAT-0010',
    nombre: 'Incienso Antiguo',
    linea: 'Exclusiva',
    familia: 'Oriental',
    piramide: {
      salida: ['Pimienta rosa', 'Benjuí'],
      corazon: ['Incienso', 'Mirra', 'Pachulí'],
      fondo: ['Ámbar', 'Sándalo', 'Cedro'],
    },
  },
  {
    id: 'CAT-0011',
    nombre: 'Magnolia Blanca',
    linea: 'Clásica',
    familia: 'Floral',
    piramide: {
      salida: ['Neroli', 'Bergamota'],
      corazon: ['Magnolia', 'Azahar'],
      fondo: ['Sándalo', 'Almizcle'],
    },
  },
  {
    id: 'CAT-0012',
    nombre: 'Cítrico Nocturno',
    linea: 'Firma',
    familia: 'Cítrico',
    piramide: {
      salida: ['Naranja amarga', 'Mandarina'],
      corazon: ['Neroli', 'Jazmín'],
      fondo: ['Vetiver', 'Ámbar'],
    },
  },
  {
    id: 'CAT-0013',
    nombre: 'Bosque Boreal',
    linea: 'Exclusiva',
    familia: 'Amaderado',
    piramide: {
      salida: ['Enebro', 'Pino'],
      corazon: ['Cedro', 'Abeto'],
      fondo: ['Musgo de roble', 'Vainilla'],
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
