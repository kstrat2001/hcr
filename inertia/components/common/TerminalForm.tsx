import { useState } from 'react'

export default function TerminalForm() {
  const [step, setStep] = useState(0) // 0: repo, 1: email, 2: success
  const [repo, setRepo] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Step 0: Repo Validation
    if (step === 0) {
      if (!repo) {
        setError('Error: Repo URL is required.')
        return
      }

      const urlPattern = /^(https?:\/\/)?([\w\d]+\.)?[\w\d]+\.[\w\d]+(\/.*)?$/
      if (!urlPattern.test(repo)) {
        setError('Error: That doesn\'t look like a repo. 404 Vibe Not Found.')
        return
      }

      setStep(1)
      setError('')
    } 
    
    // Step 1: Email Validation
    else if (step === 1) {
      if (!email) {
        setError('Error: Email is required.')
        return
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Error: Email vibe check failed. Bots not allowed.')
        return
      }
      
      setIsSubmitting(true)
      setError('')
      setIsSubmitting(true)
      setError('')
      
      try {
        // Get CSRF token from cookie
        const xsrfToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1]

        const response = await fetch('/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': xsrfToken || '',
          },
          body: JSON.stringify({
            repoUrl: repo,
            email: email
          })
        })

        if (response.ok) {
          setStep(2)
        } else {
          setError('Error: Server connection refused. Try again.')
        }
      } catch (err) {
        setError('Error: Transmission failed. Check your connection.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      background: '#000', 
      border: '1px solid #333', 
      borderRadius: '4px',
      padding: '2px',
      boxShadow: '0 0 30px rgba(0, 255, 65, 0.1)'
    }}>
      {/* Terminal Header */}
      <div style={{ 
        background: '#1a1a1a', 
        padding: '0.5rem 1rem', 
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div className="mono" style={{ fontSize: '0.8rem', color: '#888' }}>lead_capture_v1.sh</div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }}></div>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }}></div>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }}></div>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="mono" style={{ padding: '1.5rem', minHeight: '200px', textAlign: 'left', fontSize: '1rem' }}>
        
        {/* History */}
        <div style={{ color: '#888', marginBottom: '1rem' }}>
          &gt; initiating handshake...<br/>
          &gt; connection established.<br/>
          &gt; ready for input.
        </div>

        {/* Step 0: Repo Input */}
        {step >= 0 && (
          <div style={{ marginBottom: step === 0 ? '0' : '1rem' }}>
            <span className="text-primary">&gt; Enter_Repo_URL:</span>
            {step === 0 ? (
              <form onSubmit={handleSubmit} style={{ display: 'inline' }} noValidate>
                <input 
                  type="text"
                  value={repo}
                  onChange={(e) => {
                    setRepo(e.target.value)
                    setError('')
                  }}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: '#fff', 
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    marginLeft: '0.5rem',
                    outline: 'none',
                    width: '80%'
                  }}
                  placeholder="github.com/user/project..."
                />
              </form>
            ) : (
              <span style={{ color: '#fff', marginLeft: '0.5rem' }}>{repo}</span>
            )}
            {step === 0 && error && <div style={{ color: '#ff4141', marginTop: '0.5rem', marginLeft: '1rem' }}>&gt; {error}</div>}
          </div>
        )}

        {/* Step 1: Email Input */}
        {step >= 1 && step !== 2 && (
          <div style={{ marginBottom: step === 1 ? '0' : '1rem' }}>
            <span className="text-primary">&gt; Enter_Email:</span>
            {step === 1 ? (
              <form onSubmit={handleSubmit} style={{ display: 'inline' }} noValidate>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError('')
                  }}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    caretColor: 'var(--color-primary)',
                    color: '#fff', 
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    marginLeft: '0.5rem',
                    outline: 'none',
                    width: '80%'
                  }}
                  placeholder="you@company.com"
                />
              </form>
            ) : (
              <span style={{ color: '#fff', marginLeft: '0.5rem' }}>{email}</span>
            )}
            {error && <div style={{ color: '#ff4141', marginTop: '0.5rem', marginLeft: '1rem' }}>&gt; {error}</div>}
          </div>
        )}

        {/* Loading State */}
        {isSubmitting && (
           <div className="text-primary">
             &gt; transmitting_data... <span className="glitch-text">|||||</span>
           </div>
        )}

        {/* Success State */}
        {step === 2 && (
          <div style={{ marginTop: '1rem' }}>
             <div className="text-primary" style={{ marginBottom: '1rem' }}>
               &gt; <span style={{ background: 'var(--color-primary)', color: '#000', padding: '0 4px' }}>SUCCESS</span> Data received.
             </div>
             <p style={{ color: '#e0e0e0' }}>
               I will analyze your repo and email you shortly.<br/>
               Expect the truth.
             </p>
             <button 
               onClick={() => { setStep(0); setRepo(''); setEmail('') }}
               style={{ 
                 marginTop: '1.5rem',
                 background: 'transparent',
                 border: '1px solid #333',
                 color: '#888',
                 fontFamily: 'inherit',
                 padding: '0.5rem 1rem',
                 cursor: 'pointer'
               }}
             >
               [New_Session]
             </button>
          </div>
        )}

        {/* Blinking Cursor */}


      </div>
    </div>
  )
}
