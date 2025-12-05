'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import confetti from 'canvas-confetti'
import { QRCodeCanvas } from 'qrcode.react'
import { motion } from 'framer-motion'

export default function CreateGroupPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [snow, setSnow] = useState(true)

  function createGroup() {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    localStorage.setItem(`group-${newCode}`, JSON.stringify([]))
    setCode(newCode)

    // ✅ Success Confetti
    confetti({
      particleCount: 180,
      spread: 120,
      origin: { y: 0.6 },
    })
  }

  function goToGroup() {
    router.push(`/group/${code}`)
  }

  const joinLink =
    typeof window !== 'undefined'
      ? `${window.location.origin}/group/${code}`
      : ''

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-700 to-rose-600 p-6 overflow-hidden relative">

      {/* ❄️ Snow Toggle */}
      <div className="fixed top-4 right-4 z-30">
        <button
          onClick={() => setSnow(!snow)}
          className="px-3 py-1 bg-white text-black rounded"
        >
          ❄️
        </button>
      </div>

      {/* ❄️ Snowfall */}
      {snow && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute top-[-10px] bg-white rounded-full opacity-80 animate-snow"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                animationDuration: `${Math.random() * 6 + 6}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* 🎅 Animated Santa */}
      <motion.img
        src="/santa.gif"
        className="absolute bottom-6 left-6 w-44 z-20"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />

      {/* 🎁 Main Card */}
      <div className="bg-white text-black rounded-2xl p-8 w-full max-w-md space-y-5 text-center z-10 shadow-xl">
        <h1 className="text-2xl font-bold">🎄 Create a Secret Santa Group</h1>

        {!code && (
          <button
            onClick={createGroup}
            className="w-full bg-black text-white py-2 rounded"
          >
            Generate Group Code
          </button>
        )}

        {code && (
          <>
            <p className="text-lg font-semibold">Group Code</p>

            <p className="text-3xl font-bold tracking-widest bg-gray-100 py-2 rounded text-black">
              {code}
            </p>

            {/* ✅ QR CODE */}
            <div className="flex justify-center pt-2">
              <QRCodeCanvas value={joinLink} size={160} />
            </div>

            <p className="text-sm text-gray-600">
              Scan to join instantly
            </p>

            <button
              onClick={goToGroup}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Open Group Room
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(joinLink)
                alert('Group link copied!')
              }}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Copy Share Link
            </button>
          </>
        )}

        <button
          onClick={() => router.push('/')}
          className="text-sm text-gray-600 underline"
        >
          ← Back to Home
        </button>
      </div>

      {/* ✅ Snow Animation CSS */}
      <style jsx global>{`
        @keyframes snow {
          to {
            transform: translateY(110vh);
          }
        }
        .animate-snow {
          animation-name: snow;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  )
}
