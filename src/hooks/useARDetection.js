import { useState, useEffect, useRef } from 'react'

export const useARDetection = (videoRef, canvasRef, category, productImage) => {
  const [detections, setDetections] = useState(null)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const animationFrameRef = useRef(null)
  const productImgRef = useRef(null)

  useEffect(() => {
    loadModel()
    loadProductImage()
    return () => {
      stopDetection()
    }
  }, [category, productImage])

  const loadProductImage = () => {
    if (productImage) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = productImage
      img.onload = () => {
        productImgRef.current = img
      }
    }
  }

  const loadModel = async () => {
    try {
      // Simulate model loading
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsModelLoaded(true)
      setDetections({ demo: true })
    } catch (error) {
      console.error('Error loading model:', error)
    }
  }

  const startDetection = () => {
    if (!videoRef.current || !canvasRef.current) return
    
    const detectFrame = () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const video = videoRef.current
        const canvas = canvasRef.current
        
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        
        ctx.save()
        
        // Draw AR overlay based on category with product image
        switch (category) {
          case 'shoes':
            drawShoes(ctx, centerX, canvas.height, canvas.width)
            break
          case 'watches':
            drawWatch(ctx, centerX, centerY)
            break
          case 'bags':
            drawBag(ctx, centerX, centerY)
            break
          case 'clothes':
            drawClothes(ctx, centerX, centerY, canvas.width)
            break
        }
        
        ctx.restore()
      }
      
      animationFrameRef.current = requestAnimationFrame(detectFrame)
    }
    
    detectFrame()
  }

  const drawShoes = (ctx, centerX, canvasHeight, canvasWidth) => {
    // Left shoe
    ctx.globalAlpha = 0.85
    ctx.fillStyle = '#1e40af'
    ctx.strokeStyle = '#60a5fa'
    ctx.lineWidth = 4
    
    const shoeWidth = 120
    const shoeHeight = 140
    const shoeY = canvasHeight - 180
    
    // Left shoe
    ctx.beginPath()
    ctx.ellipse(centerX - 80, shoeY + shoeHeight - 40, shoeWidth/2, shoeHeight/3, 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Right shoe
    ctx.beginPath()
    ctx.ellipse(centerX + 80, shoeY + shoeHeight - 40, shoeWidth/2, shoeHeight/3, 0, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Add product image if available
    if (productImgRef.current) {
      ctx.globalAlpha = 0.9
      ctx.drawImage(productImgRef.current, centerX - 140, shoeY, 100, 100)
      ctx.drawImage(productImgRef.current, centerX + 40, shoeY, 100, 100)
    }
    
    // Add label
    ctx.globalAlpha = 1
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('👟 Shoes Try-On', centerX, shoeY - 20)
  }

  const drawWatch = (ctx, centerX, centerY) => {
    const wristX = centerX - 180
    const wristY = centerY + 120
    
    // Watch face
    ctx.globalAlpha = 0.9
    ctx.fillStyle = '#1f2937'
    ctx.strokeStyle = '#9ca3af'
    ctx.lineWidth = 4
    
    ctx.beginPath()
    ctx.arc(wristX, wristY, 50, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Watch band
    ctx.fillStyle = '#374151'
    ctx.fillRect(wristX - 60, wristY - 15, 30, 30)
    ctx.fillRect(wristX + 30, wristY - 15, 30, 30)
    
    // Add product image if available
    if (productImgRef.current) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(wristX, wristY, 45, 0, 2 * Math.PI)
      ctx.clip()
      ctx.globalAlpha = 0.95
      ctx.drawImage(productImgRef.current, wristX - 45, wristY - 45, 90, 90)
      ctx.restore()
    }
    
    // Add label
    ctx.globalAlpha = 1
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('⌚ Watch Try-On', wristX, wristY - 80)
  }

  const drawBag = (ctx, centerX, centerY) => {
    const bagX = centerX + 80
    const bagY = centerY - 120
    const bagWidth = 140
    const bagHeight = 160
    
    // Bag body
    ctx.globalAlpha = 0.85
    ctx.fillStyle = '#92400e'
    ctx.strokeStyle = '#d97706'
    ctx.lineWidth = 4
    
    ctx.fillRect(bagX, bagY, bagWidth, bagHeight)
    ctx.strokeRect(bagX, bagY, bagWidth, bagHeight)
    
    // Bag handle
    ctx.beginPath()
    ctx.arc(bagX + bagWidth/2, bagY, 50, Math.PI, 0, true)
    ctx.stroke()
    
    // Add product image if available
    if (productImgRef.current) {
      ctx.globalAlpha = 0.9
      ctx.drawImage(productImgRef.current, bagX + 10, bagY + 10, bagWidth - 20, bagHeight - 20)
    }
    
    // Add label
    ctx.globalAlpha = 1
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('👜 Bag Try-On', bagX + bagWidth/2, bagY - 80)
  }

  const drawClothes = (ctx, centerX, centerY, canvasWidth) => {
    const clothesWidth = 280
    const clothesHeight = 240
    const clothesX = centerX - clothesWidth/2
    const clothesY = centerY - 100
    
    // T-shirt shape
    ctx.globalAlpha = 0.75
    ctx.fillStyle = '#8b5cf6'
    ctx.strokeStyle = '#a78bfa'
    ctx.lineWidth = 4
    
    // Body
    ctx.fillRect(clothesX, clothesY, clothesWidth, clothesHeight)
    ctx.strokeRect(clothesX, clothesY, clothesWidth, clothesHeight)
    
    // Sleeves
    ctx.fillRect(clothesX - 60, clothesY, 60, 100)
    ctx.fillRect(clothesX + clothesWidth, clothesY, 60, 100)
    
    // Add product image if available
    if (productImgRef.current) {
      ctx.globalAlpha = 0.85
      ctx.drawImage(productImgRef.current, clothesX + 40, clothesY + 40, clothesWidth - 80, clothesHeight - 80)
    }
    
    // Add label
    ctx.globalAlpha = 1
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('👕 Clothes Try-On', centerX, clothesY - 20)
  }

  const stopDetection = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }

  return {
    detections,
    isModelLoaded,
    startDetection,
    stopDetection
  }
}
