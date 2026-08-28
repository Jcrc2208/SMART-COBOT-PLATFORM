import { useEffect, useRef, useState } from 'react'
import './crear.css'

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
  const listRef = useRef(null)

  const active = convs.find((c) => c.id === activeId) ?? convs[0]

  useEffect(() => {
    if (active.messages.length > 0) {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [active.messages.length])

  const send = () => {
    const msg = input.trim()
    if (!msg) return

    setInput('')

    setConvs((cs) =>
      cs.map((c) =>
        c.id === active.id
          ? {
              ...c,
              title:
                c.messages.length === 0
                  ? msg.slice(0, 32)
                  : c.title,
              messages: [
                ...c.messages,
                {
                  from: 'user',
                  text: msg,
                },
              ],
            }
          : c
      )
    )

    setTimeout(() => {
      setConvs((cs) =>
        cs.map((c) =>
          c.id === active.id
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  {
                    from: 'bot',
                    text: 'Perfecto, estoy preparando tu fórmula…',
                  },
                ],
              }
            : c
        )
      )
    }, 600)
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
          placeholder="Describe tu aroma ideal..."
          value={input}
          autoFocus
          onChange={(e) =>
            setInput(e.target.value)
          }
        />

        <button
          type="submit"
          className={`chat-send ${
            input.trim() ? 'active' : ''
          }`}
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
            </div>
          ))}
        </div>

        {hasMessages && renderInput()}

      </section>
    </main>
  )
}