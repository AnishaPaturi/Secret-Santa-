'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function JoinPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [snow, setSnow] = useState(true)

  async function joinGroup() {
    const ref = doc(db, 'groups', code.toUpperCase())
    const snap = await getDoc(ref)

    if (!snap.exists()) {
      alert('Invalid group code ❌')
      return
    }

    router.push(`/group/${code.toUpperCase()}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-700 to-rose-600 p-6 overflow-hidden relative">

      {/* Snow Toggle */}
      <div className="fixed top-4 right-4 z-30">
        <button
          onClick={() => setSnow(!snow)}
          className="px-3 py-1 bg-white text-black rounded"
        >
          ❄️
        </button>
      </div>

      {/* Snowfall */}
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
        className="absolute bottom-6 left-6 w-40 z-20"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />

      {/* Main Card */}
      <div className="bg-white text-black rounded-2xl p-8 w-full max-w-md space-y-4 text-center z-10">
        <h1 className="text-2xl font-bold">🎁 Join a Secret Santa Group</h1>

        <input
          className="w-full border p-2 rounded"
          placeholder="Enter Group Code"
          value={code}
          onChange={e => setCode(e.target.value)}
        />

        <button
          onClick={joinGroup}
          className="w-full bg-black text-white py-2 rounded"
        >
          Join Group
        </button>

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
