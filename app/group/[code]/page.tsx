'use client'
import { useParams } from 'next/navigation'
import { useState } from 'react'

export default function GroupRoom() {
  const { code } = useParams()
  const [name, setName] = useState('')
  const [members, setMembers] = useState<string[]>([])

  function joinGroup() {
    if (!name.trim()) return
    setMembers([...members, name.trim()])
    setName('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-700 p-6">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md text-black space-y-4">
        <h1 className="text-xl font-bold text-center">🎁 Group Code: {code}</h1>

        <div className="flex">
          <input
            className="flex-1 border p-2 rounded-l"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button onClick={joinGroup} className="bg-black text-white px-4 rounded-r">
            Join
          </button>
        </div>

        <div className="space-y-2">
          {members.map((m, i) => (
            <div key={i} className="bg-red-600 text-white px-3 py-1 rounded">
              {m}
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-600 text-center">
          (Next step: remote assignment — coming next)
        </p>
      </div>
    </div>
  )
}
