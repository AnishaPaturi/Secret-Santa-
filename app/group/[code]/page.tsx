'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function GroupRoom() {
  const { code } = useParams()
  const [name, setName] = useState('')
  const [members, setMembers] = useState<string[]>([])

  useEffect(() => {
    const ref = doc(db, 'groups', String(code))

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setMembers(snap.data().members || [])
      }
    })

    return () => unsub()
  }, [code])

  async function joinGroup() {
    if (!name.trim()) return
    if (members.includes(name.trim())) {
      alert('Name already exists!')
      return
    }

    const ref = doc(db, 'groups', String(code))
    await updateDoc(ref, {
      members: [...members, name.trim()],
    })

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

        {members.length === 0 && (
          <p className="text-center text-gray-500">
            No members added yet
          </p>
        )}

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
      </div>
    </div>
  )
}
