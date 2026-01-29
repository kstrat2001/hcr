import { Head } from '@inertiajs/react'
import MainLayout from '../components/layout/MainLayout'
import Typewriter from '../components/common/Typewriter'
import TerminalForm from '../components/common/TerminalForm'
import ScanningVisual from '../components/common/ScanningVisual'

export default function Home() {
  return (
    <MainLayout>
      <Head title="Vibe Check Your Code" />

      {/* Hero Section */}
      <section
        className="hero container flex items-center justify-between"
        style={{ minHeight: '80vh' }}
      >
        <div style={{ maxWidth: '800px' }}>
          <h1
            className="mono text-primary"
            style={{
              fontSize: '3rem',
              marginBottom: '1.5rem',
              textShadow: '0 0 10px var(--color-primary-glow)',
              minHeight: '1.2em',
              color: 'var(--color-primary)',
            }}
          >
            &gt;{' '}
            <Typewriter
              strings={[
                'Human_Code_Reader',
                'From_Prompt_To_Prod',
                'Refactoring_Slop',
                'Scaling_Your_Dreams',
              ]}
              typeSpeed={70}
              backSpeed={40}
            />
          </h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
            Don't let your vibes{' '}
            <span style={{ textDecoration: 'line-through', color: '#ff4141' }}>
              break production
            </span>
            .
          </p>
          <a
            href="#contact"
            className="btn-primary mono"
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              border: '2px solid var(--color-primary)',
              color: 'var(--color-primary)',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            [Get_Verified]
          </a>
        </div>

        {/* NEW VISUAL: The X-Ray Scanner */}
        <ScanningVisual />
      </section>

      {/* The Trap */}
      <section id="trap" style={{ padding: '6rem 0', background: 'var(--color-bg-light)' }}>
        <div className="container">
          <h2 className="text-center mono" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>
            The_AI_Trap
          </h2>
          <div
            className="grid"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}
          >
            <div>
              <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                You prompted it. It generated. It runs.
                <br />
                <br />
                <span className="text-primary">But is it secure? Is it scalable?</span>
              </p>
              <p style={{ color: 'var(--color-text-muted)' }}>
                LLMs are great at mimicing patterns, but terrible at architectural intent. They
                don't know your business logic, they just know what code "looks like".
              </p>
            </div>
            <div
              className="code-block"
              style={{
                background: '#000',
                padding: '1.5rem',
                borderLeft: '4px solid #ff4141',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                color: '#a0a0a0',
              }}
            >
              <span style={{ color: '#ff4141' }}>// AI Generated "Auth"</span>
              <br />
              if (user.password == input.password) &#123;
              <br />
              &nbsp;&nbsp;login(user);
              <br />
              &#125;
              <br />
              <br />
              <span style={{ color: 'var(--color-primary)' }}>// REALITY CHECK:</span>
              <br />
              <span style={{ color: 'var(--color-primary)' }}>
                // Timing attack vulnerable. Plaintext comparison. NO.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section id="solution" style={{ padding: '6rem 0' }}>
        <div className="container">
          <h2 className="text-center mono" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>
            The_Solution
          </h2>
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
              I am a <span className="text-primary">Human Code Reader</span>.
            </p>
            <p
              style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '3rem' }}
            >
              I review your AI-generated codebase before you launch. I spot the hallucinations, the
              security holes, and the architectural dead-ends.
            </p>
            <div
              className="features grid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}
            >
              <div
                style={{
                  padding: '2rem',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--glass-bg)',
                }}
              >
                <h3 className="mono text-primary" style={{ marginBottom: '1rem' }}>
                  &gt; Security
                </h3>
                <p>Prevent SQL injection, XSS, and logic flaws.</p>
              </div>
              <div
                style={{
                  padding: '2rem',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--glass-bg)',
                }}
              >
                <h3 className="mono text-primary" style={{ marginBottom: '1rem' }}>
                  &gt; Architecture
                </h3>
                <p>Ensure your database schema isn't a ticking time bomb.</p>
              </div>
              <div
                style={{
                  padding: '2rem',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--glass-bg)',
                }}
              >
                <h3 className="mono text-primary" style={{ marginBottom: '1rem' }}>
                  &gt; Optimization
                </h3>
                <p>Cut down AWS bills by fixing inefficient loops.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio */}
      <section id="bio" style={{ padding: '6rem 0', background: 'var(--color-bg-light)' }}>
        <div className="container items-center" style={{ display: 'flex', gap: '4rem' }}>
          <div style={{ flex: 1 }}>
            <h2 className="mono" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
              &gt; Who_Is_Kain?
            </h2>

            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.8' }}>
              It started with a <span className="text-primary">TRS-80</span> in the 1990s. I wasn't
              prompting an LLM; I was fighting memory limits and syntax errors by hand.
            </p>

            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.8' }}>
              Fast forward 20 years. I've managed engineering teams at{' '}
              <strong className="text-white">Apple</strong>, delivering software to millions. I've
              directed VR technology at <strong className="text-white">Digital Domain</strong>. I've
              built custom graphics engines and embedded systems where performance wasn't a
              luxury—it was physics.
            </p>

            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.8' }}>
              I've seen every pitfall. I know why that AI-generated "optimization" will crash your
              server at 3 AM. I know why that "clever" architecture will become technical debt next
              month.
            </p>

            <p
              style={{
                fontSize: '1.1rem',
                color: 'var(--color-text-muted)',
                borderLeft: '4px solid var(--color-primary)',
                paddingLeft: '1rem',
              }}
            >
              You have the vision. You have the speed. <br />
              <span className="text-white">I have the scars to keep you safe.</span>
            </p>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: '100%',
                maxWidth: '500px',
                background: '#000',
                border: '1px solid #333',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                boxShadow: '0 0 20px rgba(0,0,0,0.5)',
              }}
            >
              <div
                style={{
                  background: '#111',
                  padding: '0.5rem 1rem',
                  borderBottom: '1px solid #333',
                  color: '#666',
                  fontSize: '0.75rem',
                }}
              >
                kain_experience.log
              </div>
              <div style={{ padding: '1.5rem', color: '#a0a0a0' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <span className="text-primary">$ load_history --full</span>
                </div>

                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#888' }}>[2019-2022]</span>{' '}
                  <strong className="text-white">Apple</strong>
                  <br />
                  &gt; Engineering Manager, Video Apps
                </div>

                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#888' }}>[2015-2018]</span>{' '}
                  <strong className="text-white">Digital Domain</strong>
                  <br />
                  &gt; Director of SE, VR/Graphics
                </div>

                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#888' }}>[2008-2014]</span>{' '}
                  <strong className="text-white">Various Studios</strong>
                  <br />
                  &gt; Game Developer (Graphics, OpenGL, Shaders)
                </div>

                <hr style={{ borderColor: '#333', margin: '1rem 0' }} />

                <div>
                  <span className="text-primary">$ check_skills</span>
                  <br />
                  &gt; C++, OpenGL, iOS, Embedded Systems
                  <br />
                  &gt; Engineering Leadership, Architecture
                  <br />
                  &gt; <span className="text-primary">Vibe_Verification_Status: APPROVED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" style={{ padding: '8rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2 className="mono text-primary" style={{ fontSize: '3rem', marginBottom: '2rem' }}>
            Ready_to_Launch?
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>
            Send me your repo. I'll send you the truth.
          </p>
          <div style={{ marginTop: '2rem' }}>
            <TerminalForm />
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
