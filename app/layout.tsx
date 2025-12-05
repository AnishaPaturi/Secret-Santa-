import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Secret Santa – Christmas Gift Matcher',
  description:
    'Create a magical Secret Santa game, pass the phone, and let everyone discover their gift buddy in a private, fun way.',
  openGraph: {
    title: 'Secret Santa – Make Your Christmas Gift Swap Magical 🎄',
    description:
      'Invite friends, add names, and let this Secret Santa app privately assign gift partners with festive vibes, snow, sounds and confetti.',
    url: 'https://secret-santa-theta-nine.vercel.app',
    siteName: 'Secret Santa',
    images: [
      {
        url: 'https://secret-santa-theta-nine.vercel.app/og-santa.png',
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
    images: ['https://secret-santa-theta-nine.vercel.app/og-santa.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* ✅ Theme color for mobile status bar */}
        <meta name="theme-color" content="#dc2626" />

        {/* ✅ iOS PWA support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Secret Santa" />

        {/* ✅ App Icons */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>

      <body>
        {children}

        {/* ✅ Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
