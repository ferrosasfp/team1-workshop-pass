import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Web3Provider } from '@/shared/providers/Web3Provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Team1 Workshop Pass',
  description:
    'Un NFT en Avalanche Fuji que funciona como credencial de acceso. Demo del workshop "NFT más allá del arte" de Team1 LatAm.',
  openGraph: {
    title: 'Team1 Workshop Pass',
    description: 'Acuñá tu credencial de acceso en Avalanche Fuji. Sin dinero real.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#08090C',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans">
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  )
}
