import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center p-6 text-center">
      <div>
        <p className="font-mono text-sm text-avax">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-heading">Esta página no existe</h1>
        <p className="mt-3 text-muted">La demo tiene dos pantallas: los pasos y el acceso.</p>
        <Link href="/" className="btn-primary mt-6">
          Ir al paso 1
        </Link>
      </div>
    </main>
  )
}
