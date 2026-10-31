import { useCallback, useState } from 'react'

type Props = { text: string; label: string }

export function CopyButton({ text, label }: Props) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked — mailto/tel links still work */
    }
  }, [text])

  return (
    <button type="button" className="copy-btn mono" onClick={copy} aria-label={copied ? `${label} copied` : `Copy ${label}`}>
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
