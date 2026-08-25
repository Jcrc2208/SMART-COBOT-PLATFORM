import { useEffect, useRef, useState } from 'react'
import './crear.css'

const INITIAL_MESSAGES = [
  { from: 'bot', text: '¡Hola! Soy tu asistente de fragancias Fragance Bar. ¿Estas listo para comenzar?' },
]

export default function Crear() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const send = (text) => {
    const msg = text.trim()
    if (!msg) return
    setMessages((m) => [...m, { from: 'user', text: msg }])
    setInput('')
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'bot', text: 'Perfecto, estoy preparando tu fórmula…' }])
    }, 600)
  }

  return (
    <main className="panel chat-panel">
      <div className="chat-window">
        <header className="chat-topbar">
          <div className="chat-bot-avatar">IA</div>
          <div>
            <p className="chat-bot-name">Asistente Fragance Bar</p>
            <p className="chat-bot-status"><span className="dot" /> En línea</p>
          </div>
        </header>

        <div className="chat-messages" ref={listRef}>
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.from === 'bot' ? 'msg-bot' : 'msg-user'}`}>
              {m.text}
            </div>
          ))}
        </div>
        <form
          className="chat-inputbar"
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
        >
          <input
            type="text"
            className="chat-input"
            placeholder="Describe tu aroma ideal…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="chat-send" aria-label="Enviar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 20.5v-6l13-2.5L3 9.5v-6L21 12 3 20.5Z" fill="currentColor" />
            </svg>
          </button>
        </form>
      </div>
    </main>
  )
}
