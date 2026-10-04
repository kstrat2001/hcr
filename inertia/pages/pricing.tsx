import { Head } from '@inertiajs/react'
import MainLayout from '../components/layout/MainLayout'
import { startProjectUrl } from '../lib/de_links'

export default function Pricing() {
  const models = [
    {
      id: '001',
      name: 'CODE_AUDIT',
      content: 'audit',
      desc: 'A senior engineer reads your code.',
      features: [
        'Security review: we look for SQL injection, XSS, and gaps in auth',
        'Architecture and database schema review',
        'Performance and cloud-cost hotspots',
        'A written report with prioritized fixes',
      ],
      cta: '[Scope_an_Audit]',
      color: '#ffbd2e', // Warning Yellow
    },
    {
      id: '002',
      name: 'EVALS_AND_TESTS',
      content: 'evals_tests',
      desc: 'We write your evals.',
      features: [
        'Unit and end-to-end test frameworks set up for your codebase',
        'Evals for your AI features, so you can tell when a prompt or model change makes things worse',
        'Test runs wired into your workflow, so regressions get caught before deploy',
      ],
      cta: '[Scope_Evals_and_Tests]',
      color: '#00ff41', // Primary Green
      recommended: true,
    },
    {
      id: '003',
      name: 'FEATURE_OR_APP',
      content: 'build',
      desc: 'We build it, tested from day one.',
      features: [
        'A scoped feature or a full app, built with you',
        'Tests and evals included from the start',
        'Code you own, reviewed before it ships',
      ],
      cta: '[Scope_a_Build]',
      color: '#00e5ff', // Cyan
    },
  ]

  return (
    <MainLayout>
      <Head title="Human Models" />

      <section className="container" style={{ padding: '4rem 0 2rem' }}>
        <div className="text-center" style={{ marginBottom: '4rem' }}>
          <h1
            className="mono text-primary"
            style={{
              fontSize: 'clamp(1.8rem, 5vw, 3rem)',
              marginBottom: '1rem',
              whiteSpace: 'nowrap',
            }}
          >
            &gt; Human_Models
          </h1>
          <p
            style={{
              fontSize: '1.25rem',
              color: 'var(--color-text-muted)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Choose your level of intelligence. <br />
            AI writes code fast. We make sure it's correct.
          </p>
        </div>

        {/* START A PROJECT */}
        <div style={{ maxWidth: '800px', margin: '0 auto 5rem' }}>
          <div
            style={{
              border: '1px solid var(--color-primary)',
              padding: '2rem',
              background: 'rgba(0, 255, 65, 0.04)',
              position: 'relative',
              boxShadow: '0 0 20px -5px #00ff4140',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-10px',
                left: '2rem',
                background: '#000',
                padding: '0 1rem',
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
              }}
            >
              &gt; Start_a_Project
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '2rem',
              }}
            >
              <div style={{ flex: 1, minWidth: '260px' }}>
                <p style={{ color: '#e0e0e0', fontSize: '1.15rem', marginBottom: '1rem' }}>
                  All models are delivered by{' '}
                  <span style={{ whiteSpace: 'nowrap' }}>Darkly Energized</span>.
                </p>
                <div className="mono" style={{ fontSize: '0.8rem', color: '#666' }}>
                  &gt; Next: scope it on Darkly Energized.
                </div>
              </div>
              <a
                href={startProjectUrl('pricing')}
                className="btn-primary mono"
                style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
              >
                [Start_a_Project]
              </a>
            </div>
          </div>
        </div>

        <div
          className="grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
          }}
        >
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
                e.currentTarget.style.boxShadow = p.recommended
                  ? `0 0 20px -5px ${p.color}40`
                  : 'none'
              }}
            >
              {p.recommended && (
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

              <div
                className="mono"
                style={{ color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}
              >
                Model_{p.id}
              </div>

              <h2
                className="mono"
                style={{ color: p.color, fontSize: '2rem', marginBottom: '1rem' }}
              >
                {p.name}
              </h2>

              <p style={{ marginBottom: '2rem', minHeight: '3rem' }}>{p.desc}</p>

              <ul style={{ listStyle: 'none', marginBottom: '3rem', flex: 1 }}>
                {p.features.map((f, i) => (
                  <li
                    key={i}
                    style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}
                  >
                    <span style={{ color: p.color, marginRight: '0.75rem' }}>&gt;</span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={startProjectUrl('pricing', p.content)}
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

        <div className="text-center" style={{ marginTop: '4rem' }}>
          <p className="mono" style={{ color: '#666' }}>
            // Every engagement is scoped to your codebase.
            <br />
            // Deliverables are set in your Statement of Work.
          </p>
        </div>
      </section>
    </MainLayout>
  )
}
