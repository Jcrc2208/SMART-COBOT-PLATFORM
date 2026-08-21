import './profile.css'

const STATS = [
  { label: 'Perfumes creados', value: '0' },
  { label: 'Favoritos', value: '0' },
]

const NOTAS = ['Cítricos', 'Madera', 'Vainilla', 'Lavanda']

export default function Coleccion() {
  return (
    <main className="panel profile">
      <section className="profile-stats">
        {STATS.map(({ label, value }) => (
          <article key={label} className="stat-card">
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
          </article>
        ))}
      </section>

      <section className="profile-section">
        <h3>Perfil olfativo</h3>
        <div className="chip-row">
          {NOTAS.map((n) => (
            <span key={n} className="chip">{n}</span>
          ))}
        </div>
      </section>
    </main>
  )
}
