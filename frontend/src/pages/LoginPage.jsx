import GoogleLoginButton from '../components/GoogleLoginButton.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { Navigate } from 'react-router-dom'

export default function LoginPage() {
  const { user } = useAuth()
  if (user) return <Navigate to="/" replace />
  return (
    <div className="login">
      <h1>Smart Cobot</h1>
      <p>Inicia sesión para chatear con el asistente</p>
      <GoogleLoginButton />
    </div>
  )
}