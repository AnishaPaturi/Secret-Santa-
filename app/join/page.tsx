'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function JoinPage() {
  const router = useRouter()
  const [code, setCode] = useState('')

  function joinGroup() {
    const exists = localStorage.getItem(`group-${code.toUpperCase()}`)

    if (!exists) {
      alert('Invalid group code ❌')
      return
    }

    router.push(`/group/${code.toUpperCase()}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-700 p-6">
      <div className="bg-white text-black rounded-2xl p-8 w-full max-w-md space-y-4 text-center">
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
    </div>
  )
}
