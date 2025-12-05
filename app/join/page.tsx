'use client'
import { useRouter } from 'next/navigation'

export default function JoinPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-700 text-white p-6">
      <div className="bg-white text-black rounded-2xl p-8 w-full max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-bold">🎄 Join a Secret Santa Group</h1>

        <input
          className="w-full border p-2 rounded"
          placeholder="Enter Group Code"
        />

        <button className="w-full bg-black text-white py-2 rounded">
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
