'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreateGroupPage() {
  const router = useRouter()
  const [code, setCode] = useState('')

  function createGroup() {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    // Save empty group in localStorage
    localStorage.setItem(`group-${newCode}`, JSON.stringify([]))

    setCode(newCode)
  }

  function goToGroup() {
    router.push(`/group/${code}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-700 p-6">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md space-y-4 text-center">
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
            <p className="text-3xl font-bold tracking-widest bg-gray-100 py-2 rounded">
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
    </div>
  )
}
