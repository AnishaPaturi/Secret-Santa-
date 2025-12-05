'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function GroupRoom() {
  const { code } = useParams()
  const groupKey = `group-${code}`

  const [name, setName] = useState('')
  const [members, setMembers] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(groupKey)
    if (stored) {
      setMembers(JSON.parse(stored))
    }
  }, [groupKey])

  function joinGroup() {
    if (!name.trim()) return

    // prevent duplicates
    if (members.includes(name.trim())) {
      alert('Name already exists!')
      return
    }

    const updated = [...members, name.trim()]
    setMembers(updated)
    localStorage.setItem(groupKey, JSON.stringify(updated))
    setName('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-700 p-6">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md text-black space-y-4">
        <h1 className="text-xl font-bold text-center">
          🎁 Group Code: {code}
        </h1>

        <div className="flex">
          <input
            className="flex-1 border p-2 rounded-l"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button
            onClick={joinGroup}
            className="bg-black text-white px-4 rounded-r"
          >
            Join
          </button>
        </div>

        <div className="space-y-2">
          {members.map((m, i) => (
            <div
              key={i}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              {m}
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-600 text-center">
          Group members are stored on this device (local demo mode).
        </p>
      </div>
    </div>
  )
}
