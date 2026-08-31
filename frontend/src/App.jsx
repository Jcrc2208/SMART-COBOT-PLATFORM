import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import Perfil from './components/Perfil.jsx'
import Coleccion from './components/Coleccion.jsx'
import Crear from './components/Crear.jsx'
import Catalogo from './components/Catalogo.jsx'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div>Cargando...</div>
  return user ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/crear" replace />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="coleccion" element={<Coleccion />} />
          <Route path="catalogo" element={<Catalogo />} />
          <Route path="crear" element={<Crear />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
