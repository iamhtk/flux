import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Download, RefreshCw, Sparkles } from 'lucide-react'

function App() {
  // Apple-style gradient presets
  const gradientPresets = [
    { name: 'Ocean Blue', from: '#007AFF', to: '#5856D6' },
    { name: 'Sunset', from: '#FF2D55', to: '#FF9500' },
    { name: 'Mint Green', from: '#34C759', to: '#30D158' },
    { name: 'Purple Dream', from: '#5E5CE6', to: '#BF5AF2' },
    { name: 'Coral Burst', from: '#FF9F0A', to: '#FF375F' },
    { name: 'Sky Blue', from: '#00C7BE', to: '#007AFF' },
    { name: 'Rose Gold', from: '#FF6482', to: '#FFB347' },
    { name: 'Forest', from: '#32D74B', to: '#64D2FF' },
  ]

  // Lissajous curve parameters
  const [a, setA] = useState(3)
  const [b, setB] = useState(4)
  const [delta, setDelta] = useState(Math.PI / 2)
  const [speed, setSpeed] = useState(1)
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [gradient, setGradient] = useState(gradientPresets[0])
  const [text, setText] = useState('Flux')
  const [isAnimating, setIsAnimating] = useState(true)
  
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const timeRef = useRef(0)

  // Draw Lissajous curve
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 40

    const animate = () => {
      if (!isAnimating) return

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Create gradient
      const gradientFill = ctx.createLinearGradient(0, 0, width, height)
      gradientFill.addColorStop(0, gradient.from)
      gradientFill.addColorStop(1, gradient.to)

      // Draw Lissajous curve
      ctx.beginPath()
      ctx.strokeStyle = gradientFill
      ctx.lineWidth = strokeWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      const points = 1000
      for (let i = 0; i <= points; i++) {
        const t = (i / points) * Math.PI * 2 + timeRef.current * speed * 0.01
        const x = centerX + radius * Math.sin(a * t + delta)
        const y = centerY + radius * Math.sin(b * t)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()
      timeRef.current += 1
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [a, b, delta, speed, strokeWidth, gradient, isAnimating])

  // Export as CSS card
  const exportCard = () => {
    const cssCode = `
/* Flux Generated Card */
.flux-card {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, ${gradient.from}, ${gradient.to});
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(20px);
}

.flux-card h2 {
  color: white;
  font-size: 48px;
  font-weight: 700;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
    `.trim()

    const blob = new Blob([cssCode], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'flux-card.css'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Reset to defaults
  const resetParams = () => {
    setA(3)
    setB(4)
    setDelta(Math.PI / 2)
    setSpeed(1)
    setStrokeWidth(2)
    setGradient(gradientPresets[0])
    setText('Flux')
    timeRef.current = 0
  }

  // Randomize
  const randomize = () => {
    setA(Math.floor(Math.random() * 8) + 1)
    setB(Math.floor(Math.random() * 8) + 1)
    setDelta(Math.random() * Math.PI * 2)
    setSpeed(Math.random() * 2 + 0.5)
    setGradient(gradientPresets[Math.floor(Math.random() * gradientPresets.length)])
  }

  return (
    <div style={{ 
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexShrink: 0
        }}
      >
        <div>
          <h1 style={{ 
            fontSize: '42px', 
            fontWeight: '700',
            letterSpacing: '-0.02em',
            marginBottom: '4px',
            lineHeight: 1
          }}>
            Flux<span style={{ color: 'var(--accent-blue)' }}>.</span>
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)',
            fontSize: '15px',
            fontWeight: '500'
          }}>
            A mini web app that generates sleek CSS cards with animated Lissajous curves, vibrant gradients, and custom text.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={randomize}
            className="glass"
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '600',
              fontSize: '14px',
              color: 'var(--text-primary)'
            }}
          >
            <Sparkles size={16} />
            Randomize
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportCard}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              background: 'var(--accent-blue)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 4px 16px rgba(0, 122, 255, 0.3)'
            }}
          >
            <Download size={16} />
            Export CSS
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div style={{
        width: '100%',
        flex: 1,
        display: 'flex',
        gap: '24px',
        minHeight: 0
      }}>
        
        {/* Canvas Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="glass-heavy"
          style={{
            flex: 1,
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 0
          }}
        >
          {/* Animated gradient background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${gradient.from}15, ${gradient.to}15)`,
            opacity: 0.5
          }} />
          
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            style={{
              width: '100%',
              maxWidth: '400px',
              height: 'auto',
              position: 'relative',
              zIndex: 1
            }}
          />
          
          {text && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize: '56px',
                fontWeight: '700',
                background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginTop: '20px',
                position: 'relative',
                zIndex: 1
              }}
            >
              {text}
            </motion.h2>
          )}
        </motion.div>

        {/* Controls Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="glass"
          style={{
            width: '380px',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            overflowY: 'auto',
            overflowX: 'hidden',
            flexShrink: 0
          }}
        >
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '0px'
          }}>
            Controls
          </h3>

          {/* Gradient Presets */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text-secondary)'
            }}>
              Gradient Presets
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px'
            }}>
              {gradientPresets.map((preset, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGradient(preset)}
                  title={preset.name}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: '12px',
                    border: gradient.name === preset.name ? '3px solid var(--accent-blue)' : '1px solid var(--glass-border)',
                    cursor: 'pointer',
                    background: `linear-gradient(135deg, ${preset.from}, ${preset.to})`,
                    boxShadow: gradient.name === preset.name ? '0 4px 12px rgba(0, 122, 255, 0.4)' : 'none'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Custom Gradient Colors */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text-secondary)'
            }}>
              Custom Gradient
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="color"
                value={gradient.from}
                onChange={(e) => setGradient({ ...gradient, from: e.target.value, name: 'Custom' })}
                style={{ 
                  flex: 1,
                  height: '40px',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              />
              <input
                type="color"
                value={gradient.to}
                onChange={(e) => setGradient({ ...gradient, to: e.target.value, name: 'Custom' })}
                style={{ 
                  flex: 1,
                  height: '40px',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>

          {/* Frequency A */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text-secondary)'
            }}>
              Frequency A: {a}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={a}
              onChange={(e) => setA(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* Frequency B */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text-secondary)'
            }}>
              Frequency B: {b}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={b}
              onChange={(e) => setB(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* Phase Delta */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text-secondary)'
            }}>
              Phase: {(delta / Math.PI).toFixed(2)}π
            </label>
            <input
              type="range"
              min="0"
              max={Math.PI * 2}
              step="0.1"
              value={delta}
              onChange={(e) => setDelta(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* Speed */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text-secondary)'
            }}>
              Speed: {speed.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* Stroke Width */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text-secondary)'
            }}>
              Stroke: {strokeWidth}px
            </label>
            <input
              type="range"
              min="1"
              max="8"
              step="1"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* Custom Text */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text-secondary)'
            }}>
              Custom Text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text..."
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--glass-border)',
                fontSize: '14px',
                fontWeight: '500',
                background: 'rgba(255, 255, 255, 0.5)'
              }}
            />
          </div>

          {/* Animation Toggle */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAnimating(!isAnimating)}
            className="glass"
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              color: 'var(--text-primary)'
            }}
          >
            {isAnimating ? 'Pause' : 'Play'}
          </motion.button>

          {/* Reset Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetParams}
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--glass-border)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              color: 'var(--text-secondary)',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={14} />
            Reset
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default App