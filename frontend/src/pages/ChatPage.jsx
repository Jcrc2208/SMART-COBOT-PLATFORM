import { useAuth } from '../hooks/useAuth.jsx'
import ChatInterface from '../components/ChatInterface.jsx'

export default function ChatPage() {
  const { user, logout } = useAuth()
  return (
    <div className="chat-page">
      <header className="chat-header">
        <img src={user?.picture} alt="avatar" className="avatar" />
        <span>{user?.name}</span>
        <button onClick={logout}>Cerrar sesión</button>
      </header>
      <ChatInterface />
    </div>
  )
}