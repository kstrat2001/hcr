import { useState, useEffect } from 'react'

export default function ScanningVisual() {
  const [glitchLines, setGlitchLines] = useState<string[]>([])
  const [cleanLines, setCleanLines] = useState<string[]>([])

  // Random character generator for the glitch layer
  const generateGlitch = (length: number) => {
    const chars = '01#@$%&H3L0!x8z?><'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Effect to populate the background code
  useEffect(() => {
    // The "Truth" code (Layer B) - Clean, secure, optimized logic.
    const realCode = [
      "import { Security } from '@hcr/core'",
      'class Validator extends Base_Guard {',
      '  public async verify(stream: Code) {',
      '    if (!stream.isSecure()) {',
      '      throw new HallucinationError()',
      '    }',
      '    // Logic verified by Human',
      '    await db.transaction(async (trx) => {',
      '      await trx.insert(clean_data)',
      '    })',
      '    return new Architecture(SOLID)',
      '  }',
      '}',
    ]

    setCleanLines(realCode)

    // The "Glitch" code (Layer A) - Garbled mess of length similar to real code
    const messyCode = realCode.map((line) => generateGlitch(line.length + 5))
    setGlitchLines(messyCode)
  }, [])

  return (
    <div
      className="eye-visual-container"
      style={{ position: 'relative', overflow: 'hidden', background: '#000' }}
    >
      {/* 1. The Glitch Layer (Background) */}
      <div
        className="layer-base mono"
        style={{
          padding: '1.5rem',
          color: '#003B00' /* Dark green, hard to read */,
          fontSize: '0.8rem',
          lineHeight: '1.5',
          opacity: 0.7,
        }}
      >
        {glitchLines.map((line, i) => (
          <div key={i} style={{ whiteSpace: 'nowrap' }}>
            {line}
          </div>
        ))}
      </div>

      {/* 2. The Scanning Lens (Mask) */}
      {/* This container moves up/down. Inside, the clear text stays "static" relative to the parent */}
      <div
        className="scan-mask"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '60px' /* Height of the revealed strip */,
          overflow: 'hidden',
          borderBottom: '2px solid #00ff41',
          boxShadow: '0 0 15px rgba(0, 255, 65, 0.5)',
          background: 'rgba(0, 20, 0, 0.9)' /* Darken background to make white text pop */,
          animation: 'scan-move-mask 3s linear infinite',
        }}
      >
        {/* The Clean Layer (Foreground) */}
        {/* This moves UP inside the mask at the same speed the mask moves DOWN, creating a 'static' window effect */}
        <div
          className="layer-clean mono"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            padding: '1.5rem',
            color: '#00ff41' /* Bright Green */,
            fontSize: '0.8rem',
            fontWeight: 'bold',
            lineHeight: '1.5',
            textShadow: '0 0 5px rgba(0, 255, 65, 0.5)',
            animation: 'counter-scroll 3s linear infinite',
          }}
        >
          {cleanLines.map((line, i) => (
            <div key={i} style={{ whiteSpace: 'nowrap' }}>
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Styles for the unique animations */}
      <style>{`
        @keyframes scan-move-mask {
            0% { top: -20%; }
            100% { top: 120%; }
        }
        
        @keyframes counter-scroll {
            0% { top: 20%; } /* Offset essentially cancels out parental movement */
            100% { top: -120%; }
        }
      `}</style>
    </div>
  )
}
