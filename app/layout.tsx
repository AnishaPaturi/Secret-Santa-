import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Secret Santa – Christmas Gift Matcher',
  description:
    'Create a magical Secret Santa game, pass the phone, and let everyone discover their gift buddy in a private, fun way.',
  metadataBase: new URL('https://secret-santa-theta-nine.vercel.app/'),
  openGraph: {
    title: 'Secret Santa – Make Your Christmas Gift Swap Magical 🎄',
    description:
      'Invite friends, add names, and let this Secret Santa app privately assign gift partners with festive vibes, snow, sounds and confetti.',
    url: 'https://secret-santa-theta-nine.vercel.app/',
    siteName: 'Secret Santa',
    images: [
      {
        url: '/og-santa.png',
        width: 1200,
        height: 630,
        alt: 'Secret Santa app with animated Santa and Christmas theme',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Secret Santa – Christmas Gift Matcher',
    description:
      'Pass the phone, keep assignments secret, and celebrate with confetti. A cute Christmas Secret Santa app.',
    images: ['/og-santa.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
