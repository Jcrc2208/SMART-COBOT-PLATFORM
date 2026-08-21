import { useState } from 'react'
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

      {editing ? (
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
      ) : (
        <section className="profile-section">
          <h3>Cuenta</h3>
          <button type="button" className="btn-primary" onClick={startEdit}>Editar perfil</button>
        </section>
      )}
    </main>
  )
}
