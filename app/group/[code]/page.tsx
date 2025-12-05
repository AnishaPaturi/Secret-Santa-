'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function GroupRoom() {
  const { code } = useParams()
  const groupRef = doc(db, 'groups', String(code))

  const [name, setName] = useState('')
  const [members, setMembers] = useState<string[]>([])
  const [pairs, setPairs] = useState<
    { giver: string; receiver: string }[]
  >([])
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [locked, setLocked] = useState(false)

  // ✅ REAL-TIME SYNC
  useEffect(() => {
    const unsub = onSnapshot(groupRef, snap => {
      if (snap.exists()) {
        const data = snap.data()
        setMembers(data.members || [])
        setPairs(data.pairs || [])
        setStarted(data.started || false)
      }
    })
    return () => unsub()
  }, [groupRef])

  async function joinGroup() {
    if (!name.trim()) return
    if (members.includes(name.trim())) {
      alert('Name already exists!')
      return
    }

    await updateDoc(groupRef, {
      members: [...members, name.trim()],
    })

    setName('')
  }

  function shuffle(array: string[]) {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  async function startGame() {
    if (members.length < 2) {
      alert('Need at least 2 members to start!')
      return
    }

    let givers = shuffle([...members])
    let receivers = shuffle([...members])

    while (givers.some((g, i) => g === receivers[i])) {
      receivers = shuffle([...members])
    }

    const result = givers.map((g, i) => ({
      giver: g,
      receiver: receivers[i],
    }))

    await updateDoc(groupRef, {
      pairs: result,
      started: true,
    })

    confetti({ particleCount: 200, spread: 160 })
  }

  function nextPerson() {
    setRevealed(false)
    setLocked(true)

    setTimeout(() => {
      setIndex(prev => prev + 1)
      setLocked(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-700 to-rose-600 flex items-center justify-center p-6">
      <div className="bg-white text-black rounded-2xl p-8 w-full max-w-md space-y-5 shadow-xl">

        <h2 className="text-2xl font-bold text-center">
          🎁 Group: {code}
        </h2>

        {/* ✅ BEFORE GAME START */}
        {!started && (
          <>
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

            <div className="flex flex-wrap gap-2">
              {members.map((m, i) => (
                <div
                  key={i}
                  className="bg-red-600 text-white px-3 py-1 rounded-full"
                >
                  {m}
                </div>
              ))}
            </div>

            <button
              onClick={startGame}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              🎄 Start Secret Santa
            </button>
          </>
        )}

        {/* ✅ GAME STARTED */}
        {started && index < pairs.length && (
          <>
            {!locked ? (
              <>
                <p className="text-lg text-center">Pass phone to</p>
                <p className="text-2xl font-bold text-center text-red-600">
                  {pairs[index].giver}
                </p>

                {!revealed ? (
                  <button
                    className="w-full bg-black text-white py-2 rounded"
                    onClick={() => setRevealed(true)}
                  >
                    Reveal My Secret Santa
                  </button>
                ) : (
                  <>
                    <p className="text-center mt-4">You gift 🎁</p>
                    <p className="text-3xl text-center font-bold text-green-600">
                      {pairs[index].receiver}
                    </p>
                    <button
                      className="w-full bg-black text-white py-2 rounded mt-4"
                      onClick={nextPerson}
                    >
                      Done → Pass Phone
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="bg-black/80 text-white text-center py-10 rounded">
                Pass phone to next person 🔒
              </div>
            )}
          </>
        )}

        {/* ✅ GAME FINISHED */}
        {started && index >= pairs.length && (
          <div className="text-center space-y-4">
            <p className="text-xl font-bold">🎉 All Done! 🎉</p>
            <button
              className="w-full bg-black text-white py-2 rounded"
              onClick={() => location.reload()}
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
