import { useEffect, useRef, useState, useCallback } from 'react'
import './crear.css'

const splitIntoSentences = (text) =>
  text
    .split(/(?<=[.!?…])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1)

const pickSpanishVoice = () => {
  const voices = window.speechSynthesis?.getVoices() ?? []
  if (!voices.length) return null

  const score = (v) => {
    const name = (v.name || '').toLowerCase()
    let s = 0
    if (v.lang === 'es-ES') s += 10
    else if (v.lang.startsWith('es')) s += 8
    if (v.default) s += 3
    if (name.includes('natural') || name.includes('neural')) s += 5
    if (name.includes('micr')) s += 2
    return s
  }

  return [...voices].sort((a, b) => score(b) - score(a))[0]
}

const speakQueue = (text, { muted, rate = 0.98 } = {}) => {
  if (muted || !('speechSynthesis' in window)) return
  const synth = window.speechSynthesis
  synth.cancel()

  const voice = pickSpanishVoice()

  const parts = splitIntoSentences(text)
  parts.forEach((part) => {
    const u = new SpeechSynthesisUtterance(part)
    if (voice) u.voice = voice
    u.lang = voice?.lang || 'es-ES'
    u.rate = rate
    u.pitch = 1.02
    synth.speak(u)
  })
}

const newConversation = () => ({
  id: Date.now() + Math.random(),
  title: 'Nueva conversación',
  messages: [],
})

export default function Crear() {
  const [convs, setConvs] = useState(() => [newConversation()])
  const [activeId, setActiveId] = useState(convs[0].id)
  const [input, setInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [muted, setMuted] = useState(false)
  const listRef = useRef(null)

  const active = convs.find((c) => c.id === activeId) ?? convs[0]

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices()
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  const playMessage = useCallback(
    (text) => {
      speakQueue(text, { muted })
    },
    [muted]
  )

  useEffect(() => {
    const last = active.messages[active.messages.length - 1]
    if (last && last.from === 'bot' && last.speaking !== false) {
      speakQueue(last.text, { muted })
    }
  }, [active.messages.length, muted, playMessage])

  useEffect(() => {
    if (active.messages.length > 0) {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [active.messages.length])

  const send = async () => {
    const msg = input.trim()
    if (!msg || loading) return

    setInput('')

    const userMsg = { from: 'user', text: msg }

    setConvs((cs) =>
      cs.map((c) =>
        c.id === active.id
          ? {
              ...c,
              title: c.messages.length === 0 ? msg.slice(0, 32) : c.title,
              messages: [...c.messages, userMsg],
            }
          : c
      )
    )

    setLoading(true)

    try {
      const currentConvs = [...convs]
      const current = currentConvs.find((c) => c.id === active.id)
      const history = (current?.messages ?? []).map((m) => ({
        role: m.from === 'user' ? 'user' : 'assistant',
        content: m.text,
      }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history }),
      })

      const data = await res.json()
      const reply = data.reply || 'No pude generar una respuesta. Intenta de nuevo.'

      setConvs((cs) =>
        cs.map((c) =>
          c.id === active.id
            ? {
                ...c,
                messages: [...c.messages, { from: 'bot', text: reply }],
              }
            : c
        )
      )
    } catch {
      setConvs((cs) =>
        cs.map((c) =>
          c.id === active.id
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { from: 'bot', text: 'Error de conexión con el servidor. Intenta de nuevo.' },
                ],
              }
            : c
        )
      )
    }

    setLoading(false)
  }

  const startNewChat = () => {
    const c = newConversation()

    setConvs((cs) => [c, ...cs])
    setActiveId(c.id)
    setInput('')
    setSidebarOpen(false)
  }

  const selectConversation = (id) => {
    setActiveId(id)
    setSidebarOpen(false)
  }

  const hasMessages = active.messages.length > 0

  const renderInput = () => (
    <div className="input-container">
      <form
        className="chat-inputbar"
        onSubmit={(e) => {
          e.preventDefault()
          send()
        }}
      >

        <button
          type="button"
          className="input-add"
          aria-label="Agregar"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <input
          type="text"
          className="chat-input"
          placeholder={loading ? 'Esperando respuesta...' : 'Describe tu aroma ideal...'}
          value={input}
          autoFocus
          disabled={loading}
          onChange={(e) =>
            setInput(e.target.value)
          }
        />

        <button
          type="submit"
          className={`chat-send ${
            input.trim() && !loading ? 'active' : ''
          }`}
          disabled={loading || !input.trim()}
          aria-label="Enviar"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 19V5M6 11l6-6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

      </form>
    </div>
  )

  return (
    <main className="crear-page">

      {/* Botón menú (móvil) */}
      <button
        type="button"
        className={`sidebar-fab ${
          sidebarOpen ? 'is-hidden' : ''
        }`}
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir menú"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M4 6h16M4 12h16M4 18h16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Overlay para móvil */}
      <div
        className={`sidebar-overlay ${
          sidebarOpen ? 'visible' : ''
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* SIDEBAR */}
      <aside
        className={`chat-sidebar ${
          sidebarOpen ? 'sidebar-open' : ''
        }`}
      >

        {/* Botón principal */}
        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Abrir menú"
        >
          <span className="toggle-icon">
            <span />
            <span />
            <span />
          </span>

          {sidebarOpen && (
            <span className="toggle-text">
              Fragance Bar
            </span>
          )}
        </button>

        {/* Nueva conversación */}
        <button
          type="button"
          className="new-chat-btn"
          onClick={startNewChat}
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {sidebarOpen && (
            <span>Nueva conversación</span>
          )}
        </button>

        {/* Historial */}
        {sidebarOpen && (
          <>
            <p className="sidebar-label">
              Historial
            </p>

            <div className="history-list">
              {convs.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`history-item ${
                    c.id === activeId ? 'active' : ''
                  }`}
                  onClick={() =>
                    selectConversation(c.id)
                  }
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v10a2.5 2.5 0 0 1-2.5 2.5H10l-5 3v-3.5a2.5 2.5 0 0 1-1-2V5.5Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                  </svg>

                  <span>{c.title}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </aside>

      {/* CHAT */}
      <section className="chat-window">

        {/* Control de voz */}
        <button
          type="button"
          className={`voice-toggle ${muted ? 'muted' : ''}`}
          onClick={() => {
            setMuted((m) => !m)
            stopSpeech()
          }}
          aria-label={muted ? 'Activar voz' : 'Silenciar voz'}
          title={muted ? 'Activar voz' : 'Silenciar voz'}
        >
          {muted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M11 5 6 9H3v6h3l5 4V5Z"
                fill="currentColor"
              />
              <path
                d="m16 9 4 6M20 9l-4 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M11 5 6 9H3v6h3l5 4V5Z"
                fill="currentColor"
              />
              <path
                d="M15 9a4 4 0 0 1 0 6M17.5 6.5a8 8 0 0 1 0 11"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        {/* Mensajes */}
        <div
          className={`chat-messages ${
            hasMessages ? 'has-messages' : 'empty-chat'
          }`}
          ref={listRef}
        >

          {!hasMessages && (
            <div className="welcome-container">
              <h1 className="chat-hero">
                Descubramos tu esencia
              </h1>

              <p className="chat-subtitle">
                Cuéntame tus gustos y crearé una fragancia
                única para ti.
              </p>

              {renderInput()}
            </div>
          )}

          {active.messages.map((m, i) => (
            <div
              key={i}
              className={`msg ${
                m.from === 'bot'
                  ? 'msg-bot'
                  : 'msg-user'
              }`}
            >
              {m.text}

              {m.from === 'bot' && (
                <button
                  type="button"
                  className="msg-voice"
                  aria-label="Reproducir mensaje"
                  onClick={() => playMessage(m.text)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M11 5 6 9H3v6h3l5 4V5Z"
                      fill="currentColor"
                    />
                    <path
                      d="M15 9a4 4 0 0 1 0 6M17.5 6.5a8 8 0 0 1 0 11"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}

          {loading && (
            <div className="msg msg-bot typing">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          )}
        </div>

        {hasMessages && renderInput()}

      </section>
    </main>
  )
}