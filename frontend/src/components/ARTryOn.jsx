import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Camera, RotateCcw, Download, Share2, Settings, ZoomIn, ZoomOut } from 'lucide-react'
import { useARDetection } from '../hooks/useARDetection'
import {
  getBodyRotation, getTorsoTilt, getBodyWidth, getBodyHeight,
  getShoulderCenter, getHipCenter, smoothValue, getPerspectiveSkew,
  getDynamicOpacity
} from '../services/bodyPerspectiveMapper'

// ─── Draw helpers ──────────────────────────────────────────────────────────────

/**
 * Draw product overlay with perspective transforms based on body movement
 * - Rotates overlay as body rotates
 * - Scales based on actual body measurements
 * - Smooth animation following body motion
 */
const drawOverlay = (ctx, img, kp, category, cw, ch, adj, motionState) => {
  console.log('🎨 drawOverlay called:', { kp: !!kp, kpLen: kp?.length, motionState: !!motionState })
  
  if (!kp?.length) {
    // Fallback: draw placeholder at center when no pose detected
    console.log('⚠️ No keypoints - drawing fallback placeholder')
    const rw = cw * 0.4 * adj.scale
    const rh = ch * 0.35 * adj.scale
    const rx = cw / 2 - rw / 2
    const ry = ch / 2 - rh / 2
    
    ctx.save()
    ctx.globalAlpha = 0.6
    ctx.fillStyle = 'rgba(99,102,241,0.3)'
    ctx.fillRect(rx, ry, rw, rh)
    ctx.strokeStyle = 'rgba(99,102,241,0.9)'
    ctx.lineWidth = 2
    ctx.strokeRect(rx, ry, rw, rh)
    ctx.restore()
    return
  }

  const get = (name) => kp.find(k => k.name === name)
  const mx  = (k) => (1 - k.x) * cw
  const my  = (k) => k.y * ch

  // ── Calculate body measurements ──────────────────────────────────────────
  const bodyRotation = smoothValue(getBodyRotation(kp), motionState?.prevRotation || 0, 0.2)
  const torsoTilt = smoothValue(getTorsoTilt(kp), motionState?.prevTilt || 0, 0.2)
  const bodyWidth = getBodyWidth(kp) * cw
  const bodyHeight = getBodyHeight(kp) * ch

  // Save motion state for next frame
  if (motionState) {
    motionState.prevRotation = bodyRotation
    motionState.prevTilt = torsoTilt
  }

  // ── Compute overlay position & size ────────────────────────────────────────
  let rx = cw * 0.25, ry = ch * 0.3, rw = cw * 0.5, rh = ch * 0.4
  let rotation = 0
  let center = { x: cw / 2, y: ch / 3 }

  switch (category) {
    case 'clothes': {
      const ls = get('left_shoulder'), rs = get('right_shoulder')
      const lhKp = get('left_hip'), rhKp = get('right_hip')
      if (ls && rs && ls.score > 0.1 && rs.score > 0.1) {
        center = getShoulderCenter(kp, cw, ch)
        rw = bodyWidth * 1.5 * adj.scale
        rh = bodyHeight * 1.4 * adj.scale
        rotation = bodyRotation * 0.6 // Scale down rotation for realistic effect
      } else {
        rw = cw * 0.55 * adj.scale; rh = ch * 0.45 * adj.scale
      }
      break
    }
    case 'watches': {
      const wrist = get('left_wrist') || get('right_wrist')
      if (wrist && wrist.score > 0.1) {
        center = { x: mx(wrist), y: my(wrist) }
        rw = cw * 0.13 * adj.scale; rh = rw
        // Wrist rotation follows hand tilt
        rotation = bodyRotation * 0.8
      }
      break
    }
    case 'bags': {
      const ls = get('left_shoulder')
      if (ls && ls.score > 0.1) {
        center = { x: mx(ls) - cw * 0.08, y: my(ls) + ch * 0.02 }
        rw = cw * 0.24 * adj.scale; rh = rw * 1.1
        rotation = bodyRotation * 0.4 // Bags rotate less
      }
      break
    }
    case 'shoes': {
      const la = get('left_ankle'), ra = get('right_ankle')
      rw = cw * 0.2 * adj.scale; rh = rw * 0.55
      if (la && la.score > 0.1) {
        ctx.save()
        ctx.globalAlpha = getDynamicOpacity(kp, 0.85)
        ctx.translate(mx(la), my(la))
        ctx.rotate((rotation * Math.PI) / 180)
        if (img) ctx.drawImage(img, -rw / 2 + adj.offsetX * cw * 0.05, -rh * 0.3 + adj.offsetY * ch * 0.05, rw, rh)
        ctx.restore()
      }
      if (ra && ra.score > 0.1) {
        ctx.save()
        ctx.globalAlpha = getDynamicOpacity(kp, 0.85)
        ctx.translate(mx(ra), my(ra))
        ctx.scale(-1, 1)
        ctx.rotate((rotation * Math.PI) / 180)
        if (img) ctx.drawImage(img, -rw / 2 + adj.offsetX * cw * 0.05, -rh * 0.3 + adj.offsetY * ch * 0.05, rw, rh)
        ctx.restore()
      }
      return
    }
    default: {
      rw = cw * 0.4 * adj.scale; rh = ch * 0.35 * adj.scale
      center = { x: cw / 2, y: ch / 2 }
    }
  }

  // ── Apply transforms & draw overlay ────────────────────────────────────────
  rx = center.x - rw / 2 + adj.offsetX * cw * 0.05
  ry = center.y - rh / 2 + adj.offsetY * ch * 0.05

  ctx.save()
  ctx.globalAlpha = getDynamicOpacity(kp, 0.85)

  // Translate to center, rotate, translate back
  ctx.translate(center.x, center.y)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.translate(-center.x, -center.y)

  if (img) {
    ctx.drawImage(img, rx, ry, rw, rh)
  } else {
    // Placeholder
    ctx.fillStyle = 'rgba(99,102,241,0.45)'
    ctx.fillRect(rx, ry, rw, rh)
    ctx.strokeStyle = 'rgba(99,102,241,0.9)'
    ctx.lineWidth = 3
    ctx.strokeRect(rx, ry, rw, rh)
    ctx.fillStyle = '#fff'
    ctx.font = `bold ${Math.round(rw * 0.08)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText('Loading...', center.x, center.y)
  }

  ctx.restore()
}

// ─── Main component ────────────────────────────────────────────────────────────
const ARTryOn = ({ product, onClose }) => {
  const videoRef   = useRef(null)
  const canvasRef  = useRef(null)
  const frameRef   = useRef(null)
  const imgRef     = useRef(null)   // preloaded product image
  const poseRef    = useRef(null)   // latest keypoints (avoid stale closure)
  const adjRef     = useRef({ scale: 1, offsetX: 0, offsetY: 0 }) // always-current adjustments

  const [isLoading, setIsLoading]         = useState(true)
  const [error, setError]                 = useState(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [poseDetected, setPoseDetected]   = useState(false)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [showControls, setShowControls]   = useState(false)
  const [adjustments, setAdjustments]     = useState({ scale: 1, offsetX: 0, offsetY: 0 })

  // Keep adjRef in sync so the render loop always reads latest without restart
  useEffect(() => { adjRef.current = adjustments }, [adjustments])

  const { detections, isModelLoaded: tfReady, startDetection, stopDetection } =
    useARDetection(videoRef, product?.category)

  // Sync tf model status
  useEffect(() => { setIsModelLoaded(tfReady) }, [tfReady])

  // Keep latest keypoints in a ref so renderLoop closure always sees them
  useEffect(() => {
    if (detections?.normalizedKeypoints?.length) {
      poseRef.current = detections.normalizedKeypoints
      setPoseDetected(true)
    }
  }, [detections])

  // Preload product image via fetch→blob so canvas can draw it (bypasses CORS cache issues)
  useEffect(() => {
    if (!product?.image) return
    let blobUrl = null

    fetch(product.image)
      .then(r => r.blob())
      .then(blob => {
        blobUrl = URL.createObjectURL(blob)
        const img = new Image()
        img.onload = () => {
          imgRef.current = img
          console.log('✅ Product image ready for canvas:', img.width, 'x', img.height)
        }
        img.onerror = () => console.error('❌ Blob img failed')
        img.src = blobUrl
      })
      .catch(err => {
        console.warn('fetch failed, falling back to direct load:', err)
        // Last resort: direct load (may or may not work on canvas)
        const img = new Image()
        img.onload = () => { imgRef.current = img }
        img.src = product.image
      })

    return () => { if (blobUrl) URL.revokeObjectURL(blobUrl) }
  }, [product?.image])

  // ── Render loop: video → canvas every frame ──────────────────────────────
  const startRenderLoop = useCallback(() => {
    const canvas = canvasRef.current
    const video  = videoRef.current
    if (!canvas || !video) return

    const category = product?.category

    // Motion state for smooth real-time body tracking
    const motionState = {
      prevRotation: 0,
      prevTilt: 0
    }

    const draw = () => {
      if (!canvasRef.current) return
      const ctx = canvasRef.current.getContext('2d')
      const cw  = canvasRef.current.width  = canvasRef.current.offsetWidth
      const ch  = canvasRef.current.height = canvasRef.current.offsetHeight

      // 1) Draw mirrored video as background
      ctx.save()
      ctx.scale(-1, 1)
      ctx.drawImage(videoRef.current, -cw, 0, cw, ch)
      ctx.restore()

      // Debug: Add grid overlay to show canvas is active
      // ctx.strokeStyle = 'rgba(255,0,0,0.2)'
      // ctx.lineWidth = 1
      // for(let i = 0; i < cw; i += 50) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, ch); ctx.stroke() }

      // 2) Always draw product overlay with body-tracking perspective transforms
      try {
        console.log('🎬 Drawing overlay:', {
          hasPose: !!poseRef.current,
          poseLength: poseRef.current?.length,
          hasImg: !!imgRef.current,
          category,
          canvasDim: `${cw}x${ch}`,
          adjRef: adjRef.current
        })
        drawOverlay(ctx, imgRef.current, poseRef.current,
          category, cw, ch, adjRef.current, motionState)
      } catch (e) {
        console.error('❌ Overlay draw error:', e)
        // Draw error indicator
        ctx.fillStyle = 'rgba(255,0,0,0.5)'
        ctx.fillRect(10, 10, 200, 50)
        ctx.fillStyle = '#fff'
        ctx.font = '14px sans-serif'
        ctx.fillText('Error: ' + e.message, 15, 35)
      }

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)
  }, [product?.category]) // no adjustments dep — reads from adjRef.current

  // ── Camera init ──────────────────────────────────────────────────────────
  const initializeCamera = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
          setIsCameraActive(true)
          setIsLoading(false)
          startDetection()
          startRenderLoop()
        }
      }
    } catch (err) {
      setError('Unable to access camera. Please grant camera permissions.')
      setIsLoading(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop())
      setIsCameraActive(false)
    }
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
  }

  useEffect(() => {
    initializeCamera()
    return () => { stopCamera(); stopDetection() }
  }, []) // eslint-disable-line

  // ── Capture ──────────────────────────────────────────────────────────────
  const capturePhoto = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      setCapturedImage(canvas.toDataURL('image/png'))
    } catch {
      // Canvas tainted by CORS — capture video frame only as fallback
      const fc = document.createElement('canvas')
      fc.width  = canvas.width
      fc.height = canvas.height
      const ctx = fc.getContext('2d')
      ctx.save(); ctx.scale(-1, 1)
      ctx.drawImage(videoRef.current, -fc.width, 0, fc.width, fc.height)
      ctx.restore()
      setCapturedImage(fc.toDataURL('image/png'))
    }
  }

  const downloadPhoto = () => {
    if (!capturedImage) return
    const a = document.createElement('a')
    a.download = `arvana-tryon-${Date.now()}.png`
    a.href = capturedImage
    a.click()
  }

  const sharePhoto = async () => {
    if (!capturedImage || !navigator.share) return
    try {
      const blob = await (await fetch(capturedImage)).blob()
      const file = new File([blob], 'arvana-tryon.png', { type: 'image/png' })
      await navigator.share({ files: [file], title: 'My ARVANA Virtual Try-On',
        text: `Check out how I look in ${product?.name}!` })
    } catch {}
  }

  const getInstructions = () => {
    switch (product?.category) {
      case 'shoes':   return 'Show your full body — feet visible for shoe overlay'
      case 'bags':    return 'Show your upper body — shoulder area for bag overlay'
      case 'clothes': return 'Show your upper body — shoulders & torso in frame'
      case 'watches': return 'Raise your wrist toward the camera'
      default:        return 'Position yourself in the camera view'
    }
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-lg text-white p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
          <div>
            <h2 className="font-bold text-lg">{product?.name || 'AR Virtual Try-On'}</h2>
            <p className="text-sm text-gray-300">{getInstructions()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {!isModelLoaded
            ? <span className="text-sm text-yellow-400 animate-pulse">Loading AI Model…</span>
            : <span className="text-sm text-green-400">● AI Ready</span>
          }
          <button onClick={() => setShowControls(v => !v)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Fine-tune controls */}
      {showControls && (
        <div className="bg-black/70 text-white px-6 py-3 flex flex-wrap gap-6 items-center flex-shrink-0 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-sm w-12">Scale</span>
            <input type="range" min="0.4" max="2.5" step="0.05"
              value={adjustments.scale}
              onChange={e => setAdjustments(p => ({ ...p, scale: +e.target.value }))}
              className="w-28" />
            <span className="text-xs text-gray-400 w-8">{adjustments.scale.toFixed(2)}×</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm w-16">Horizontal</span>
            <input type="range" min="-5" max="5" step="0.25"
              value={adjustments.offsetX}
              onChange={e => setAdjustments(p => ({ ...p, offsetX: +e.target.value }))}
              className="w-28" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm w-16">Vertical</span>
            <input type="range" min="-5" max="5" step="0.25"
              value={adjustments.offsetY}
              onChange={e => setAdjustments(p => ({ ...p, offsetY: +e.target.value }))}
              className="w-28" />
          </div>
          <button onClick={() => setAdjustments({ scale: 1, offsetX: 0, offsetY: 0 })}
            className="text-xs text-gray-400 hover:text-white underline">Reset</button>
        </div>
      )}

      {/* AR View */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-500 mx-auto mb-4" />
              <p className="text-lg">Initializing AR Camera…</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-center text-white max-w-md p-8">
              <div className="text-6xl mb-4">⚠️</div>
              <p className="text-lg mb-4">{error}</p>
              <button onClick={initializeCamera} className="btn-primary">Try Again</button>
            </div>
          </div>
        )}

        {capturedImage ? (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
        ) : (
          <>
            {/* Hidden video — pose detection runs on this */}
            <video ref={videoRef} autoPlay playsInline muted
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1 }} />

            {/* Canvas: video + overlay drawn every frame */}
            <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
          </>
        )}

        {/* Corner brackets */}
        {isCameraActive && !capturedImage && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-primary-500 rounded-tl" />
            <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-primary-500 rounded-tr" />
            <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-primary-500 rounded-bl" />
            <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-primary-500 rounded-br" />

            {poseDetected && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-green-500/90 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow">
                ✓ Body detected — overlay active
              </div>
            )}
            {!poseDetected && isModelLoaded && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-yellow-500/90 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow">
                Position yourself in frame…
              </div>
            )}
          </div>
        )}

        {/* Product pill */}
        {product && !capturedImage && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 text-white flex items-center space-x-3 whitespace-nowrap shadow-lg">
            <img src={product.image} alt={product.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
            <span className="text-sm font-semibold">{product.name}</span>
            <span className="text-sm font-bold text-primary-400">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="bg-black/80 backdrop-blur-lg p-4 flex-shrink-0">
        {capturedImage ? (
          <div className="flex justify-center space-x-4">
            <button onClick={() => setCapturedImage(null)}
              className="flex items-center space-x-2 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors">
              <RotateCcw className="w-5 h-5" /><span>Retake</span>
            </button>
            <button onClick={downloadPhoto}
              className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
              <Download className="w-5 h-5" /><span>Save</span>
            </button>
            <button onClick={sharePhoto}
              className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
              <Share2 className="w-5 h-5" /><span>Share</span>
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button onClick={capturePhoto} disabled={!isCameraActive}
              className="w-16 h-16 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-all disabled:opacity-50 shadow-lg flex items-center justify-center">
              <Camera className="w-8 h-8" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ARTryOn
