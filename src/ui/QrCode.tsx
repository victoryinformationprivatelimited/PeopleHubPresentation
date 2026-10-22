import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

/** QR code rendered offline (no external service). */
export function QrCode({ value, size = 220 }: { value: string; size?: number }) {
  const [src, setSrc] = useState('')
  useEffect(() => {
    let live = true
    QRCode.toDataURL(value, { margin: 1, width: size * 2, color: { dark: '#0f172a', light: '#ffffff' }, errorCorrectionLevel: 'M' })
      .then(u => { if (live) setSrc(u) })
      .catch(() => { if (live) setSrc('') })
    return () => { live = false }
  }, [value, size])
  if (!src) return <div style={{ width: size, height: size }} className="rounded-xl bg-white" />
  return <img src={src} width={size} height={size} alt="QR code" className="rounded-xl bg-white p-2" style={{ width: size, height: size, imageRendering: 'pixelated' }} />
}
