import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import './styles/login.css'

const LINKS = [
  { to: '/crear', label: 'Crear' },
  { to: '/coleccion', label: 'Colección' },
  { to: '/perfil', label: 'Perfil' },
]

export default function ChatPage() {
  const { logout } = useAuth()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="chat-page">
      <header className="login-menu">
        <nav className="menu-links">
          {LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {label}
            </NavLink>
          ))}
        </nav>
        <a href="#" className="menu-login" onClick={(e) => { e.preventDefault(); logout() }}>
          Salir
        </a>
      </header>

      <Outlet />
    </div>
  )
}
