import { Head } from '@inertiajs/react'
import MainLayout from '../components/layout/MainLayout'
import TerminalForm from '../components/common/TerminalForm'

export default function Terminal() {
  return (
    <MainLayout>
      <Head title="Lead Capture Terminal" />
      <section className="container-wide" style={{ padding: '8rem 0', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 className="mono text-primary text-center" style={{ marginBottom: '2rem', fontSize: '2rem' }}>
          &gt; Secure_Uplink
        </h1>
        <TerminalForm />
      </section>
    </MainLayout>
  )
}
