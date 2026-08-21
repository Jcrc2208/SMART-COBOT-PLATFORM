import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, VITE_GOOGLE_CLIENT_ID } from '../hooks/useAuth.jsx'

export default function GoogleLoginButton() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const ref = useRef(null)

  useEffect(() => {
    const src = 'https://accounts.google.com/gsi/client'
    const existing = document.querySelector(`script[src="${src}"]`)
    const onLoad = () => {
      window.google.accounts.id.initialize({
        client_id: VITE_GOOGLE_CLIENT_ID,
        callback: handleCredential,
      })
      window.google.accounts.id.renderButton(ref.current, {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
      })
    }

    const handleCredential = async (response) => {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      })
      if (!res.ok) throw new Error('Login fallido')
      const { user, token } = await res.json()
      login(user, token)
      navigate('/')
    }

    if (existing) {
      existing.addEventListener('load', onLoad)
    } else {
      const script = document.createElement('script')
      script.src = src
      script.async = true
      script.addEventListener('load', onLoad)
      document.head.appendChild(script)
    }
  }, [])

  const handleDevLogin = () => {
    login({ name: 'Dev User', email: 'dev@local.test', picture: '' }, 'dev-token')
    navigate('/')
  }

  return (
    <>
      <div ref={ref} />
      {import.meta.env.DEV && (
        <button className="dev-login-btn" onClick={handleDevLogin}>
          Entrar en modo dev
        </button>
      )}
    </>
  )
}