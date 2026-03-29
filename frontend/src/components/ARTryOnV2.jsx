import { useEffect, useRef, useState, useCallback } from 'react'
import { AREngine } from '../ar/AREngine.js'

const STATUS_MESSAGES = {
  loading:     { text: 'Loading AR...', icon: '⚡', color: '#a78bfa' },
  positioning: { text: 'Show your wrist', icon: '🎯', color: '#fbbf24' },
  ready:       { text: 'AR Active', icon: '✓', color: '#34d399' },
  error:       { text: 'Camera error', icon: '⚠', color: '#f87171' },
}

const POSITIONING_HINTS = {
  watches:     'Show your wrist to the camera',
  jewelry:     'Show your hand to the camera',
  accessories: 'Show your wrist to the camera',
  shoes:       'Point feet toward camera',
  bags:        'Show your arm and wrist',
  clothes:     'Stand back — show torso',
}

export default function ARTryOnV2({ product, onClose }) {
  const videoRef  = useRef(null)
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const streamRef = useRef(null)
  const initedRef = useRef(false)

  const [status, setStatus]                   = useState('loading')
  const [selectedColor, setSelectedColor]     = useState(product?.colors?.[0] || null)
  const [selectedSize, setSelectedSize]       = useState(null)
  const [screenshotUrl, setScreenshotUrl]     = useState(null)
  const [showScreenshot, setShowScreenshot]   = useState(false)
  const [showPanel, setShowPanel]             = useState(true)

  const category = (product?.category || 'watches').toLowerCase()
  const hint     = POSITIONING_HINTS[category] || 'Step in front of the camera'

  // ── Init AR Engine ──
  const initAR = useCallback(async (video) => {
    if (initedRef.current) return
    initedRef.current = true
    const canvas = canvasRef.current
    if (!canvas || !video) return

    canvas.width  = video.videoWidth  || 1280
    canvas.height = video.videoHeight || 720

    const engine = new AREngine(canvas, video, {
      ...product,
      colors: [selectedColor || product?.colors?.[0]],
    })
    engine.onStatusChange = (s) => setStatus(s)
    engineRef.current = engine

    try {
      await engine.init()
      engine.start()
    } catch (err) {
      console.error('AR init error:', err)
      setStatus('error')
    }
  }, [product, selectedColor])

  // ── Start Webcam ──
  useEffect(() => {
    let cancelled = false
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        })
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return }
        streamRef.current = stream
        const video = videoRef.current
        if (!video) return
        video.srcObject = stream
        video.onloadedmetadata = async () => {
          try {
            await video.play()
            if (!cancelled) initAR(video)
          } catch (e) { setStatus('error') }
        }
      } catch { if (!cancelled) setStatus('error') }
    }
    startCamera()
    return () => {
      cancelled = true
      engineRef.current?.destroy?.()
      engineRef.current = null
      initedRef.current = false
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [initAR])

  const handleColorChange = (color) => {
    setSelectedColor(color)
    engineRef.current?.setColor(color)
  }

  const handleScreenshot = () => {
    const url = engineRef.current?.captureScreenshot()
    if (!url) return
    setScreenshotUrl(url)
    setShowScreenshot(true)
  }

  const downloadScreenshot = () => {
    if (!screenshotUrl) return
    const a = document.createElement('a')
    a.href = screenshotUrl
    a.download = `arvana-tryon-${(product?.name || 'photo').replace(/\s+/g, '-')}.png`
    a.click()
  }

  const statusInfo = STATUS_MESSAGES[status] || STATUS_MESSAGES.loading

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#000',
      fontFamily: "'Inter', -apple-system, sans-serif",
      overflow: 'hidden',
    }}>

      {/* ── HIDDEN VIDEO (GPU-accessible for MediaPipe) ── */}
      <video ref={videoRef} playsInline muted autoPlay style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%', objectFit: 'cover',
        opacity: 0, pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── FULLSCREEN CANVAS ── */}
      <canvas ref={canvasRef} style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        objectFit: 'cover', zIndex: 1,
      }} />

      {/* ── TOP FLOATING BAR ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)',
      }}>
        <button onClick={onClose} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,255,255,0.15)', border: 'none',
          borderRadius: 24, padding: '8px 14px', color: '#fff',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          backdropFilter: 'blur(10px)',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 19l-7-7 7-7"/></svg>
          Back
        </button>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg,#6366f1,#a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 800, color: '#fff',
          }}>A</div>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: '0.02em' }}>AR Try-On</span>
        </div>

        {/* Snap button */}
        <button onClick={handleScreenshot} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,255,255,0.15)', border: 'none',
          borderRadius: 24, padding: '8px 14px', color: '#fff',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          backdropFilter: 'blur(10px)',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M20.94 11A9 9 0 0 0 3.06 13"/><path d="M3.06 11A9 9 0 0 1 20.94 13"/></svg>
          Snap
        </button>
      </div>

      {/* ── STATUS BADGE ── */}
      <div style={{
        position: 'absolute', top: 68, left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, pointerEvents: 'none',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '7px 16px', borderRadius: 24,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)',
          border: `1px solid ${statusInfo.color}50`,
          color: statusInfo.color, fontSize: 13, fontWeight: 600,
        }}>
          <span style={{ fontSize: 15 }}>{statusInfo.icon}</span>
          <span>{statusInfo.text}</span>
          {status === 'loading' && (
            <div style={{
              width: 13, height: 13, borderRadius: '50%',
              border: `2px solid ${statusInfo.color}44`,
              borderTopColor: statusInfo.color,
              animation: 'spin 0.8s linear infinite',
            }} />
          )}
        </div>
      </div>

      {/* ── POSITIONING GUIDE (frame corners) ── */}
      {status === 'positioning' && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          zIndex: 10, pointerEvents: 'none', textAlign: 'center',
        }}>
          {/* Targeting frame */}
          <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto' }}>
            {[
              { top: 0, left: 0, borderTop: '3px solid rgba(255,255,255,0.6)', borderLeft: '3px solid rgba(255,255,255,0.6)' },
              { top: 0, right: 0, borderTop: '3px solid rgba(255,255,255,0.6)', borderRight: '3px solid rgba(255,255,255,0.6)' },
              { bottom: 0, left: 0, borderBottom: '3px solid rgba(255,255,255,0.6)', borderLeft: '3px solid rgba(255,255,255,0.6)' },
              { bottom: 0, right: 0, borderBottom: '3px solid rgba(255,255,255,0.6)', borderRight: '3px solid rgba(255,255,255,0.6)' },
            ].map((s, i) => (
              <div key={i} style={{ position: 'absolute', width: 28, height: 28, borderRadius: 2, ...s }} />
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 14, fontWeight: 500 }}>{hint}</p>
        </div>
      )}

      {/* ── BOTTOM FLOATING PANEL ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 70%, transparent 100%)',
        padding: showPanel ? '20px 20px 28px' : '12px 20px 28px',
      }}>

        {/* Toggle panel open/close */}
        <button
          onClick={() => setShowPanel(v => !v)}
          style={{
            display: 'block', margin: '0 auto 10px',
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 12,
            width: 40, height: 5, cursor: 'pointer', padding: 0,
          }}
        />

        {showPanel && (
          <>
            {/* Product info row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>
                  {product?.brand || 'ARVANA'}
                </p>
                <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, margin: 0 }}>
                  {product?.name || 'Product'}
                </h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#fff', fontSize: 18, fontWeight: 800, margin: 0 }}>
                  ₹{product?.price?.toLocaleString('en-IN') || '—'}
                </p>
                {product?.originalPrice > product?.price && (
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, textDecoration: 'line-through', margin: 0 }}>
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            </div>

            {/* Colors */}
            {product?.colors?.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                  Color — <span style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 500, textTransform: 'none' }}>{selectedColor}</span>
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.colors.map(color => (
                    <button key={color} onClick={() => handleColorChange(color)} title={color}
                      style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: colorToCSS(color), border: 'none',
                        cursor: 'pointer', padding: 0,
                        outline: selectedColor === color ? '2.5px solid white' : '2px solid transparent',
                        outlineOffset: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                        transform: selectedColor === color ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.15s ease',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product?.sizes?.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Size</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        border: `1.5px solid ${selectedSize === size ? '#fff' : 'rgba(255,255,255,0.25)'}`,
                        background: selectedSize === size ? '#fff' : 'rgba(255,255,255,0.08)',
                        color: selectedSize === size ? '#111' : 'rgba(255,255,255,0.7)',
                        transition: 'all 0.15s ease',
                      }}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{
            flex: 1, padding: '13px 0', borderRadius: 14, fontSize: 13, fontWeight: 700,
            border: '1.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.8)', cursor: 'pointer',
          }}>
            Add to Cart
          </button>
          <button style={{
            flex: 2, padding: '13px 0', borderRadius: 14, fontSize: 13, fontWeight: 800,
            border: 'none', cursor: 'pointer', color: '#fff',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            boxShadow: '0 4px 24px rgba(99,102,241,0.45)',
          }}>
            Buy Now
          </button>
        </div>
      </div>

      {/* ── SCREENSHOT PREVIEW ── */}
      {showScreenshot && screenshotUrl && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div style={{
            width: '100%', maxWidth: 380, borderRadius: 20, overflow: 'hidden',
            background: 'rgba(25,25,30,0.95)', border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <img src={screenshotUrl} alt="AR photo" style={{ width: '100%', display: 'block' }} />
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ color: '#fff', textAlign: 'center', fontSize: 13, fontWeight: 600, margin: 0 }}>Your try-on photo</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShowScreenshot(false)} style={{
                  flex: 1, padding: '11px 0', borderRadius: 12, fontSize: 13,
                  border: '1px solid rgba(255,255,255,0.15)', background: 'transparent',
                  color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                }}>
                  Close
                </button>
                <button onClick={downloadScreenshot} style={{
                  flex: 2, padding: '11px 0', borderRadius: 12, fontSize: 13, fontWeight: 700,
                  border: 'none', background: 'linear-gradient(135deg,#6366f1,#a855f7)',
                  color: '#fff', cursor: 'pointer',
                }}>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spin animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function colorToCSS(color) {
  if (!color) return '#888'
  if (color.startsWith('#')) return color
  const map = {
    'black': '#1a1a1a', 'white': '#f5f5f5', 'red': '#c0392b',
    'blue': '#1a3a6b', 'navy': '#0d1b3e', 'gray': '#808080',
    'brown': '#5c3a1e', 'tan': '#c9996b', 'beige': '#d6c4a0',
    'silver': '#9ea3a8', 'gold': '#d4a947', 'rose gold': '#b76e79',
    'light blue': '#6ea8d4', 'pink': '#d63384', 'purple': '#6f42c1',
    'orange': '#d35400', 'yellow': '#e8b800', 'green': '#1e5c2e',
  }
  return map[color.toLowerCase()] || '#888'
}
