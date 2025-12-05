'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Pair = { giver: string; receiver: string }

export default function JoinGame() {
  const { id } = useParams()
  const [pairs, setPairs] = useState<Pair[]>([])
  const [name, setName] = useState('')
  const [receiver, setReceiver] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/game?gameId=${id}`)
      .then(res => res.json())
      .then(data => setPairs(data.pairs || []))
  }, [id])

  function reveal() {
    const match = pairs.find(p => p.giver.toLowerCase() === name.toLowerCase())
    if (!match) {
      setError('Name not found in this game ❌')
      return
    }
    setReceiver(match.receiver)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-700 to-rose-600 p-6">
      <div className="bg-white rounded-xl p-6 w-full max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold">🎄 Join Secret Santa 🎁</h1>

        {!receiver ? (
          <>
            <input
              className="w-full border p-2 rounded"
              placeholder="Enter your name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <button
              className="w-full bg-black text-white py-2 rounded"
              onClick={reveal}
            >
              Reveal My Secret Santa
            </button>
            {error && <p className="text-red-600">{error}</p>}
          </>
        ) : (
          <>
            <p className="text-lg">You need to gift 🎁</p>
            <p className="text-3xl font-bold text-green-600">{receiver}</p>
          </>
        )}
      </div>
    </div>
  )
}
