import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import './styles/login.css'

export default function ChatPage() {
  const { user, logout } = useAuth()
  const [active] = useState('inicio')

  return (
    <div className="chat-page">
      <header className="login-menu">
        <nav className="menu-links">
          <a href="#" className={active === 'inicio' ? 'active' : ''}>Inicio</a>
          <a href="#">Contacto</a>
        </nav>
        {user ? (
          <a href="#" className="menu-login" onClick={(e) => { e.preventDefault(); logout() }}>
            Cerrar sesión
          </a>
        ) : (
          <a href="/login" className="menu-login">Iniciar sesión</a>
        )}
      </header>
    </div>
  )
}
