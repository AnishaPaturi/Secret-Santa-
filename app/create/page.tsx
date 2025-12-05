'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreateGroupPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [snow, setSnow] = useState(true)

  function createGroup() {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    localStorage.setItem(`group-${newCode}`, JSON.stringify([]))
    setCode(newCode)
  }

  function goToGroup() {
    router.push(`/group/${code}`)
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

      {/* Main Card */}
      <div className="bg-white text-black rounded-2xl p-8 w-full max-w-md space-y-4 text-center z-10 shadow-xl">
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
            <p className="text-lg font-semibold mt-4">Group Code</p>

            <p className="text-3xl font-bold tracking-widest bg-gray-100 py-2 rounded text-black">
              {code}
            </p>

            <button
              onClick={goToGroup}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Open Group Room
            </button>

            <button
              onClick={() => {
                const link = `${window.location.origin}/group/${code}`
                navigator.clipboard.writeText(link)
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
