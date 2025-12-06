'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import confetti from 'canvas-confetti'
import { QRCodeCanvas } from 'qrcode.react'
import { motion } from 'framer-motion'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function CreateGroupPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [hostName, setHostName] = useState('')
  const [snow, setSnow] = useState(true)

  async function createGroup() {
    const host = hostName.trim()
    if (!host) return alert('Enter your name first')

    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    await setDoc(doc(db, 'groups', newCode), {
      admin: host,
      members: [host],
      pairs: [],
      started: false,
      createdAt: new Date(),
    })

    localStorage.setItem(`secret-santa-name-${newCode}`, host)
    localStorage.setItem(`secret-santa-admin-${newCode}`, 'true')

    setCode(newCode)

    confetti({ particleCount: 200, spread: 140 })
  }

  const joinLink =
    typeof window !== 'undefined'
      ? `${window.location.origin}/group/${code}`
      : ''

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-700 to-rose-600 p-6 relative overflow-hidden">

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
        <div className="absolute inset-0 pointer-events-none z-0">
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

      {/* 🎅 Santa */}
      <motion.img
        src="/santa.gif"
        className="absolute bottom-6 left-6 w-44 z-10"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />

      {/* 🎁 Main Card */}
      <div className="bg-white p-8 rounded-2xl max-w-md w-full text-center space-y-4 z-20 shadow-xl">
        <h1 className="text-2xl font-bold text-black">🎄 Create Group</h1>

        {!code && (
          <>
            <input
              className="w-full border p-2 rounded text-black placeholder-gray-500"
              placeholder="Your Name (Host)"
              value={hostName}
              onChange={e => setHostName(e.target.value)}
            />

            <button
              onClick={createGroup}
              className="w-full bg-black text-white py-2 rounded"
            >
              Generate Group Code
            </button>
          </>
        )}

        {code && (
          <>
            <p className="text-xl font-bold tracking-widest text-black">
              {code}
            </p>

            <div className="flex justify-center">
              <QRCodeCanvas value={joinLink} size={160} />
            </div>

            <button
              onClick={() => router.push(`/group/${code}`)}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Open Group Room
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(joinLink)
                alert('Link copied')
              }}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Copy Share Link
            </button>
          </>
        )}
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
