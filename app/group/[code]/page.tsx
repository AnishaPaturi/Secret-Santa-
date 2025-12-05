'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import {
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

type Pair = { giver: string; receiver: string }

export default function GroupRoom() {
  const { code } = useParams()
  const groupCode = String(code)
  const groupRef = doc(db, 'groups', groupCode)

  const [myName, setMyName] = useState('')
  const [hasJoined, setHasJoined] = useState(false)

  const [members, setMembers] = useState<string[]>([])
  const [pairs, setPairs] = useState<Pair[]>([])
  const [started, setStarted] = useState(false)

  const [myPair, setMyPair] = useState<Pair | null>(null)
  const [revealed, setRevealed] = useState(false)

  // ✅ REAL-TIME FIREBASE SYNC
  useEffect(() => {
    const unsub = onSnapshot(groupRef, snap => {
      if (!snap.exists()) return

      const data = snap.data()

      const dbMembers: string[] = data.members || []
      const dbPairs: Pair[] = data.pairs || []
      const dbStarted: boolean = data.started || false

      setMembers(dbMembers)
      setPairs(dbPairs)
      setStarted(dbStarted)

      if (dbStarted && myName.trim()) {
        const found = dbPairs.find(
          p => p.giver.toLowerCase() === myName.trim().toLowerCase()
        )
        setMyPair(found || null)
      }
    })

    return () => unsub()
  }, [groupRef, myName])

  // ✅ JOIN GROUP
  async function joinGroup() {
    const name = myName.trim()

    if (!name) {
      alert('Please enter your name')
      return
    }

    if (members.some(m => m.toLowerCase() === name.toLowerCase())) {
      alert('This name already exists!')
      return
    }

    await updateDoc(groupRef, {
      members: [...members, name],
    })

    setHasJoined(true)
  }

  // ✅ SHUFFLE
  function shuffle(arr: string[]) {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  // ✅ START GAME (ONLY ONCE)
  async function startGame() {
    if (members.length < 2) {
      alert('Need at least 2 members!')
      return
    }

    let givers = shuffle([...members])
    let receivers = shuffle([...members])

    while (givers.some((g, i) => g === receivers[i])) {
      receivers = shuffle([...members])
    }

    const result: Pair[] = givers.map((g, i) => ({
      giver: g,
      receiver: receivers[i],
    }))

    await updateDoc(groupRef, {
      pairs: result,
      started: true,
    })

    confetti({ particleCount: 200, spread: 160 })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-700 to-rose-600 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md space-y-6 shadow-xl text-black">

        <h2 className="text-2xl font-bold text-center">
          🎁 Group: {groupCode}
        </h2>

        {/* ✅ BEFORE JOIN */}
        {!hasJoined && !started && (
          <>
            <input
              className="w-full border p-2 rounded"
              placeholder="Enter your name"
              value={myName}
              onChange={e => setMyName(e.target.value)}
            />

            <button
              onClick={joinGroup}
              className="w-full bg-black text-white py-2 rounded"
            >
              Join Group
            </button>

            {members.length === 0 && (
              <p className="text-center text-gray-500">
                No members yet
              </p>
            )}
          </>
        )}

        {/* ✅ MEMBER LIST (VISIBLE TO ALL BEFORE START) */}
        {!started && members.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {members.map((m, i) => (
              <div
                key={i}
                className="bg-red-600 text-white px-3 py-1 rounded-full"
              >
                {m}
              </div>
            ))}
          </div>
        )}

        {/* ✅ START BUTTON (ANYONE CAN START ONCE) */}
        {!started && members.length >= 2 && (
          <button
            onClick={startGame}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            🎄 Start Secret Santa
          </button>
        )}

        {/* ✅ PRIVATE REVEAL — ONLY YOUR RESULT */}
        {started && myPair && (
          <>
            {!revealed ? (
              <button
                className="w-full bg-black text-white py-2 rounded"
                onClick={() => setRevealed(true)}
              >
                Reveal My Secret Santa
              </button>
            ) : (
              <>
                <p className="text-center mt-4">🎁 You gift:</p>
                <p className="text-3xl text-center font-bold text-green-600">
                  {myPair.receiver}
                </p>
              </>
            )}
          </>
        )}

        {/* ✅ JOINED TOO LATE / NAME MISMATCH */}
        {started && hasJoined && !myPair && (
          <p className="text-center text-gray-500">
            You joined after the game started.
          </p>
        )}
      </div>
    </div>
  )
}
