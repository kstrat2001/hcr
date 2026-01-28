import { useState, useEffect } from 'react'

interface TypewriterProps {
  strings: string[]
  typeSpeed?: number
  backSpeed?: number
  loop?: boolean
  className?: string
  style?: React.CSSProperties
}

export default function Typewriter({ 
  strings, 
  typeSpeed = 100, 
  backSpeed = 50, 
  loop = true,
  className = "",
  style = {}
}: TypewriterProps) {
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  const [typingSpeed, setTypingSpeed] = useState(typeSpeed)

  useEffect(() => {
    const handleType = () => {
      const i = loopNum % strings.length
      const fullText = strings[i]

      setText(isDeleting 
        ? fullText.substring(0, text.length - 1) 
        : fullText.substring(0, text.length + 1)
      )

      setTypingSpeed(isDeleting ? backSpeed : typeSpeed)

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1500) // Pause at end
      } else if (isDeleting && text === '') {
        setIsDeleting(false)
        setLoopNum(loopNum + 1)
      }
    }

    const timer = setTimeout(handleType, typingSpeed)
    return () => clearTimeout(timer)
  }, [text, isDeleting, loopNum, strings, typeSpeed, backSpeed])

  return (
    <span className={className} style={{ borderRight: '0.1em solid var(--color-primary)', ...style }}>
      {text}
    </span>
  )
}
