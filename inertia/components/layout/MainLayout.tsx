import { Link } from '@inertiajs/react'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="layout">
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
        style={{ padding: '4rem 0', borderTop: '1px solid var(--glass-border)', marginTop: '4rem' }}
      >
        <div className="container text-center text-muted mono" style={{ fontSize: '0.8rem' }}>
          <p>&copy; {new Date().getFullYear()} Human Code Reader. All vibes verified.</p>
        </div>
      </footer>
    </div>
  )
}
