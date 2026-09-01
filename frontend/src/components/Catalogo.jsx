import { useMemo, useState } from 'react'
import './catalogo.css'

const aromaModules = import.meta.glob('../../images/login/*.png', { eager: true })
const florales = aromaModules['../../images/login/florales.png']?.default || ''
const citricos = aromaModules['../../images/login/citricos.png']?.default || ''
const amaderados = aromaModules['../../images/login/amaderados.png']?.default || ''
const verdes = aromaModules['../../images/login/verdes.png']?.default || ''

const IMAGENES = {
  Amaderado: amaderados,
  'Amaderado1': amaderados,
  Acuático: citricos,
  Oriental: amaderados,
  Gourmand: verdes,
  Aromático: verdes,
  Floral: florales,
  Cítrico: citricos,
  Ambarado: amaderados,
}

const CATALOGO = [
  {
    id: 'CAT-0001',
    nombre: 'Noche de Cedro',
    linea: 'Firma',
    familia: 'Amaderado',
    img: 'Amaderado',
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
    img: 'Cítrico',
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
    img: 'Floral',
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
    img: 'Amaderado',
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
    img: 'Cítrico',
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
    img: 'Aromático',
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
    img: 'Aromático',
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
    img: 'Floral',
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
    img: 'Amaderado',
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
    img: 'Amaderado',
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
    img: 'Floral',
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
    img: 'Cítrico',
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
    img: 'Amaderado',
    piramide: {
      salida: ['Enebro', 'Pino'],
      corazon: ['Cedro', 'Abeto'],
      fondo: ['Musgo de roble', 'Vainilla'],
    },
  },
]

function CatalogoCard({ perfume }) {
  const [abierto, setAbierto] = useState(false)

  const img = IMAGENES[perfume.img] || IMAGENES.Amaderado

  return (
    <article className={`cat-card ${abierto ? 'cat-open' : ''}`}>
      <div className="cat-img-wrap">
        <img className="cat-img" src={img} alt={perfume.nombre} />
        <span className="cat-linea">{perfume.linea}</span>
        <span className="cat-familia">{perfume.familia}</span>
      </div>
      <div className="cat-body">
        <h4 className="cat-name">{perfume.nombre}</h4>

        <button
          type="button"
          className={`pyramid-toggle ${abierto ? 'open' : ''}`}
          onClick={() => setAbierto((v) => !v)}
        >
          Pirámide olfativa
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

        <button
          type="button"
          className="btn-buy"
          onClick={() => alert(`Comprar ${perfume.nombre}`)}
        >
          Comprar
        </button>
      </div>
    </article>
  )
}

const ORDEN_CATEGORIAS = [
  'Amaderado',
  'Aromático',
  'Floral',
  'Cítrico',
  'Oriental',
  'Acuático',
  'Gourmand',
  'Ambarado',
]

export default function Catalogo() {
  const [categoria, setCategoria] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')

  const categorias = useMemo(
    () => ['Todas', ...ORDEN_CATEGORIAS.filter((c) => CATALOGO.some((p) => p.familia === c))],
    [],
  )

  const secciones = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    const filtrados = CATALOGO.filter((p) => {
      const cumpleCat = categoria === 'Todas' || p.familia === categoria
      const cumpleBusqueda =
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        p.familia.toLowerCase().includes(q) ||
        Object.values(p.piramide).flat().some((nota) => nota.toLowerCase().includes(q))
      return cumpleCat && cumpleBusqueda
    })
    return categorias
      .filter((c) => c === 'Todas' || filtrados.some((p) => p.familia === c))
      .map((cat) => ({ categoria: cat, items: filtrados.filter((p) => p.familia === cat || cat === 'Todas') }))
  }, [categoria, busqueda, categorias])

  return (
    <main className="catalogo panel">
      <header className="cat-head">
        <h1>Catálogo de la casa</h1>
        <p>Explora nuestras fragancias por familia olfativa</p>
      </header>

      <div className="cat-search">
        <input
          type="search"
          className="cat-search-input"
          placeholder="Buscar por nombre, familia o nota…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="cat-filters">
          {categorias.map((c) => (
            <button
              key={c}
              type="button"
              className={`cat-filter-btn ${categoria === c ? 'active' : ''}`}
              onClick={() => setCategoria(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {secciones.map(({ categoria: cat, items }) =>
        items.length > 0 ? (
          <section key={cat} className="cat-categoria">
            <h2 className="cat-cat-title">{cat}</h2>
            <div className="catalog-grid">
              {items.map((p) => (
                <CatalogoCard key={p.id} perfume={p} />
              ))}
            </div>
          </section>
        ) : null,
      )}

      {secciones.every((s) => s.items.length === 0) && (
        <p className="cat-empty">Sin resultados</p>
      )}
    </main>
  )
}