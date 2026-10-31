import { FormEvent, useCallback, useEffect, useId, useRef, useState } from 'react'
import { profile } from '../data/content'
import {
  answerPortfolioGuide,
  guideSuggestedPrompts,
  type GuideContext,
  type GuideLink,
  type GuideReply,
  type GuideTurn,
} from '../guide/portfolioGuide'

type Message = { id: number; role: 'user' | 'guide'; text: string; links?: GuideLink[] }

let nextId = 0

const REPLY_DELAY_MS = { min: 320, max: 520 }

function initialGuideMessage(): Message {
  return {
    id: nextId++,
    role: 'guide',
    text: `Hi — I can help you explore ${profile.name}'s projects, screenshot galleries, skills, and contact details. Pick a quick question below or type your own.`,
  }
}

function delay(ms: number) {
  return new Promise<void>(resolve => window.setTimeout(resolve, ms))
}

function randomReplyDelay() {
  const { min, max } = REPLY_DELAY_MS
  return min + Math.floor(Math.random() * (max - min))
}

function GuideTyping() {
  return (
    <div className="guide-msg guide-msg--guide guide-msg--typing" aria-label="Assistant is typing">
      <div className="guide-bubble guide-bubble--guide">
        <span className="guide-typing-dot" />
        <span className="guide-typing-dot" />
        <span className="guide-typing-dot" />
      </div>
    </div>
  )
}

function BtnSpinner() {
  return <span className="guide-spinner" aria-hidden="true" />
}

export default function PortfolioGuide() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(() => [initialGuideMessage()])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [pendingChip, setPendingChip] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const askLock = useRef(false)

  const pushGuide = useCallback((reply: GuideReply) => {
    setMessages(m => [...m, { id: nextId++, role: 'guide', text: reply.text, links: reply.links }])
  }, [])

  const ask = useCallback(
    async (text: string, fromChip?: string) => {
      const trimmed = text.trim()
      if (!trimmed || askLock.current) return
      askLock.current = true
      setBusy(true)
      if (fromChip) setPendingChip(fromChip)
      const history: GuideTurn[] = messages.map(({ role, text, links }) => ({ role, text, links }))
      const ctx: GuideContext = { history }
      setMessages(m => [...m, { id: nextId++, role: 'user', text: trimmed }])
      setDraft('')
      await delay(randomReplyDelay())
      pushGuide(answerPortfolioGuide(trimmed, ctx))
      setBusy(false)
      setPendingChip(null)
      askLock.current = false
    },
    [pushGuide],
  )

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void ask(draft)
  }

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    inputRef.current?.focus({ preventScroll: true })
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    if (!open || !listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, busy, open])

  const showQuickPicks = messages.length <= 2 && !busy

  return (
    <>
      <button
        type="button"
        className={`guide-fab${open ? ' guide-fab--open' : ''}`}
        aria-expanded={open}
        aria-controls="portfolio-guide-panel"
        onClick={() => setOpen(v => !v)}
      >
        <span className="guide-fab-icon" aria-hidden="true">
          ?
        </span>
        <span className="guide-fab-label">{open ? 'Close' : 'Help'}</span>
      </button>

      {open && <div className="guide-backdrop" aria-hidden="true" onClick={() => setOpen(false)} />}

      <div
        id="portfolio-guide-panel"
        className={`guide-panel${open ? ' guide-panel--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        hidden={!open}
      >
        <div className="guide-sheet-handle" aria-hidden="true" />
        <header className="guide-head">
          <div className="guide-head-text">
            <h2 id={titleId} className="guide-title">
              Site assistant
            </h2>
            <p className="guide-sub">Projects, galleries & contact — from this portfolio only</p>
          </div>
          <button type="button" className="guide-icon-btn" onClick={() => setOpen(false)} aria-label="Close">
            ×
          </button>
        </header>

        <div className="guide-body">
          <div className="guide-messages" ref={listRef} aria-live="polite" aria-relevant="additions">
            {messages.map(msg => (
              <article key={msg.id} className={`guide-msg guide-msg--${msg.role}`}>
                <div className={`guide-bubble guide-bubble--${msg.role}`}>
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i}>{line || '\u00a0'}</p>
                  ))}
                  {msg.links && msg.links.length > 0 && (
                    <ul className="guide-link-list">
                      {msg.links.map(link => (
                        <li key={link.href + link.label}>
                          <a
                            className="guide-link"
                            href={link.href}
                            {...(link.href.startsWith('#') ? {} : { target: '_blank', rel: 'noreferrer' })}
                            onClick={() => {
                              if (link.href.startsWith('#/projects/')) setOpen(false)
                            }}
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
            {busy && <GuideTyping />}
          </div>
        </div>

        <div className="guide-compose">
          {showQuickPicks && (
            <div className="guide-quick" role="group" aria-label="Quick questions">
              <p className="guide-quick-label">Quick questions</p>
              <div className="guide-quick-row">
                {guideSuggestedPrompts.map(p => (
                  <button
                    key={p}
                    type="button"
                    className="guide-chip"
                    disabled={busy}
                    aria-busy={pendingChip === p}
                    onClick={() => void ask(p, p)}
                  >
                    {pendingChip === p ? (
                      <>
                        <BtnSpinner />
                        <span>{p}</span>
                      </>
                    ) : (
                      p
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form className="guide-form" onSubmit={onSubmit}>
            <label className="visually-hidden" htmlFor="guide-input">
              Ask about this portfolio
            </label>
            <input
              id="guide-input"
              ref={inputRef}
              className="guide-input"
              type="text"
              autoComplete="off"
              enterKeyHint="send"
              placeholder="Ask about a project or gallery…"
              value={draft}
              disabled={busy}
              onChange={e => setDraft(e.target.value)}
              maxLength={280}
            />
            <button type="submit" className="guide-send" disabled={busy || !draft.trim()} aria-busy={busy}>
              {busy && !pendingChip ? (
                <>
                  <BtnSpinner />
                  <span>Sending</span>
                </>
              ) : (
                'Send'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
