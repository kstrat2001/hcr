import { Link, Head } from '@inertiajs/react'
import { ReactNode } from 'react'
import { DE_LEGAL, DE_LOGO, DE_ORIGIN } from '../../lib/de_links'

interface Props {
  children: ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="layout">
      <Head>
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/og-image.png" />
      </Head>
      {/* Scanline Effect */}
      <div className="scanline"></div>

      {/* Header */}
      <header className="header">
        <div
          className="container flex justify-between items-center"
          style={{ height: 'var(--header-height)' }}
        >
          <Link href="/" className="logo mono" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
            &lt;HumanCodeReader /&gt;
          </Link>

          <nav className="nav flex gap-4 mono" style={{ fontSize: '0.9rem' }}>
            <Link href="/">[Home]</Link>
            <a href="/#trap">[The_Trap]</a>
            <a href="/#solution">[Solution]</a>
            <a href="/#bio">[Who_Am_I]</a>
            <Link href="/pricing">[Models]</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer
        style={{ padding: '3rem 0', borderTop: '1px solid var(--glass-border)', marginTop: '2rem' }}
      >
        <div className="container text-center text-muted mono" style={{ fontSize: '0.8rem' }}>
          <a
            href={`${DE_ORIGIN}/?utm_source=hcr&utm_medium=referral&utm_campaign=footer`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              color: 'var(--color-text-muted)',
            }}
          >
            <img src={DE_LOGO} alt="Darkly Energized" width={28} height={28} />
            <span>A Darkly Energized LLC product</span>
          </a>
          <p style={{ marginTop: '0.75rem' }}>
            &copy; {new Date().getFullYear()} Darkly Energized LLC. All rights reserved.
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            <a href={DE_LEGAL.terms}>[Terms]</a> <a href={DE_LEGAL.privacy}>[Privacy]</a>{' '}
            <a href={DE_LEGAL.disclaimer}>[Disclaimer]</a> <Link href="/pricing">[Models]</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
