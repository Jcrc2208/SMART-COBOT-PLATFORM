import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import './profile.css'

export default function Perfil() {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', picture: '' })

  const startEdit = () => {
    setForm({ name: user?.name ?? '', picture: user?.picture ?? '' })
    setEditing(true)
  }

  const save = (e) => {
    e.preventDefault()
    const patch = {}
    if (form.name.trim()) patch.name = form.name.trim()
    patch.picture = form.picture.trim()
    updateUser(patch)
    setEditing(false)
  }

  return (
    <main className="panel profile align-left">
      <section className="profile-card">
        {user?.picture ? (
          <img src={user.picture} alt="avatar" className="profile-avatar" />
        ) : (
          <div className="profile-avatar profile-avatar-fallback">
            {user?.name?.[0] ?? '?'}
          </div>
        )}
        <div>
          <h2 className="profile-name">{user?.name ?? 'Invitado'}</h2>
          <p className="profile-email">{user?.email ?? '—'}</p>
        </div>
      </section>

      <div className="shortcuts-grid">
        <button type="button" className="shortcut-tile" onClick={startEdit}>
          <svg className="shortcut-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
          <span className="shortcut-label">Editar perfil</span>
          <span className="shortcut-desc">Nombre y foto</span>
        </button>
        <Link to="/coleccion" className="shortcut-tile">
          <svg className="shortcut-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="8" y="8" width="8" height="13" rx="2" />
            <path d="M10 8V4h4v4M9 2h6" />
          </svg>
          <span className="shortcut-label">Mi colección</span>
          <span className="shortcut-desc">Tus fragancias guardadas</span>
        </Link>
        <Link to="/crear" className="shortcut-tile">
          <svg className="shortcut-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4Z" />
            <path d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8Z" />
          </svg>
          <span className="shortcut-label">Crear</span>
          <span className="shortcut-desc">Nueva fragancia con IA</span>
        </Link>
      </div>

      {editing && (
        <form className="profile-section edit-form" onSubmit={save}>
          <h3>Editar perfil</h3>
          <label className="edit-field">
            <span>Nombre</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Tu nombre"
            />
          </label>
          <label className="edit-field">
            <span>Foto (URL)</span>
            <input
              type="url"
              value={form.picture}
              onChange={(e) => setForm({ ...form, picture: e.target.value })}
              placeholder="https://…"
            />
          </label>
          <div className="edit-actions">
            <button type="submit" className="btn-primary">Guardar</button>
            <button type="button" className="btn-ghost" onClick={() => setEditing(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </main>
  )
}
