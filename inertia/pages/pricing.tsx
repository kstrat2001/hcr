import { Head } from '@inertiajs/react'
import MainLayout from '../components/layout/MainLayout'

export default function Pricing() {
  const models = [
    {
      id: '001',
      name: 'VIBE_CHECK',
      price: '$499',
      unit: 'starting at',
      desc: 'Sanity check for new AI-generated projects.',
      features: [
        'Architecture Review (High Level)',
        'Tech Stack Feasibility',
        'Red/Yellow/Green Report',
        '48-Hour Turnaround',
      ],
      cta: '[Init_Check]',
      color: '#ffbd2e', // Warning Yellow
    },
    {
      id: '002',
      name: 'DEEP_AUDIT',
      price: '$2,999',
      unit: 'starting at',
      desc: 'Full security & logic analysis before launch.',
      features: [
        'Deep code review + testing',
        'Security Check',
        'Compliance Check',
        'Database Schema Check',
        'Performance Check',
        'Comprehensive Report',
      ],
      cta: '[Start_Audit]',
      color: '#00ff41', // Primary Green
      recommended: true,
    },
    {
      id: '003',
      name: 'FRACTIONAL_CTO',
      price: '$5,000',
      unit: 'per month',
      desc: 'Ongoing protection against architectural entropy.',
      features: [
        'Monthly Reporting',
        'Monthly Architecture Review',
        'Monthly Security Checkup',
        'Dev Team Mentorship',
        'Direct Text Message Access',
      ],
      cta: '[Hire_Retainer]',
      color: '#00e5ff', // Cyan
    },
  ]

  return (
    <MainLayout>
      <Head title="Human Models" />

      <section className="container" style={{ padding: '4rem 0 8rem' }}>
        <div className="text-center" style={{ marginBottom: '5rem' }}>
          <h1 className="mono text-primary" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            &gt; Human_Models
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Choose your level of intelligence. <br />
            AI writes code fast. We make sure it's correct.
          </p>
        </div>

        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '6rem' }}>
          {models.map((p) => (
            <div
              key={p.id}
              style={{
                position: 'relative',
                background: 'rgba(10, 10, 10, 0.6)',
                border: `1px solid ${p.recommended ? p.color : '#333'}`,
                backdropFilter: 'blur(10px)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: p.recommended ? `0 0 20px -5px ${p.color}40` : 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = `0 0 25px -5px ${p.color}60`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = p.recommended ? `0 0 20px -5px ${p.color}40` : 'none'
              }}
            >
              {(p.recommended) && (
                <div
                  className="mono"
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: p.color,
                    color: '#000',
                    padding: '2px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                  }}
                >
                  RECOMMENDED
                </div>
              )}

              <div className="mono" style={{ color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                Model_{p.id}
              </div>
              
              <h2 className="mono" style={{ color: p.color, fontSize: '2rem', marginBottom: '1rem' }}>
                {p.name}
              </h2>

              <div style={{ marginBottom: '2rem' }}>
                <span className="mono" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff' }}>
                  {p.price}
                </span>
                <span style={{ color: '#888', marginLeft: '0.5rem', fontSize: '0.9rem' }}>
                  / {p.unit}
                </span>
              </div>

              <p style={{ marginBottom: '2rem', minHeight: '3rem' }}>{p.desc}</p>

              <ul style={{ listStyle: 'none', marginBottom: '3rem', flex: 1 }}>
                {p.features.map((f, i) => (
                  <li key={i} style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: p.color, marginRight: '0.75rem' }}>&gt;</span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={`/?plan=${p.name}&color=${encodeURIComponent(p.color)}#contact`}
                className="mono text-center"
                style={{
                  display: 'block',
                  border: `1px solid ${p.color}`,
                  color: p.color,
                  padding: '1rem',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = p.color
                  e.currentTarget.style.color = '#000'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = p.color
                }}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>

        {/* PROMO BANNER */}
        <div style={{ maxWidth: '800px', margin: '0 auto 4rem' }}>
            <div 
                style={{ 
                    border: '1px dashed #666', 
                    padding: '2rem', 
                    background: 'rgba(255,255,255,0.05)',
                    position: 'relative'
                }}
            >
                <div style={{ 
                    position: 'absolute', 
                    top: '-10px', 
                    left: '2rem', 
                    background: '#000', 
                    padding: '0 1rem',
                    color: '#fff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem'
                }}>
                    Model_000: PROOF_OF_WORK
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                    <div style={{ flex: 1 }}>
                         <h3 className="mono" style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>
                            Unsure if we're real?
                         </h3>
                         <p style={{ color: '#aaa', marginBottom: '1rem' }}>
                            I will find <strong style={{color: '#fff'}}>ONE critical flaw</strong> to prove I am not an AI. 
                            No report, just the raw truth.
                         </p>
                         <div className="mono" style={{ fontSize: '0.8rem', color: '#666' }}>
                            &gt; Status: <span style={{color: '#fff'}}>LIMITED_AVAILABILITY</span>
                         </div>
                    </div>
                    
                    <div className="text-right">
                        <div className="mono" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', marginBottom: '1rem' }}>$0</div>
                        <a href="/?plan=PROOF#contact" className="btn-primary mono" style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}>
                            [Run_Test]
                        </a>
                    </div>
                </div>
            </div>
        </div>



        
        <div className="text-center" style={{ marginTop: '4rem' }}>
           <p className="mono" style={{ color: '#666' }}>
             // Complexity Surcharge may apply for monolithic codebases &gt; 50k LOC.
           </p>
        </div>
      </section>
    </MainLayout>
  )
}
