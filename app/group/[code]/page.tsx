'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

type Pair = { giver: string; receiver: string }

export default function GroupRoom() {
  const { code } = useParams()
  const groupCode = String(code)
  const groupRef = doc(db, 'groups', groupCode)

  const [myName, setMyName] = useState('')
  const [hasJoined, setHasJoined] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const [members, setMembers] = useState<string[]>([])
  const [pairs, setPairs] = useState<Pair[]>([])
  const [started, setStarted] = useState(false)

  const [myPair, setMyPair] = useState<Pair | null>(null)
  const [revealed, setRevealed] = useState(false)

  // ✅ Restore identity & admin status from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`secret-santa-name-${groupCode}`)
    const adminFlag = localStorage.getItem(`secret-santa-admin-${groupCode}`)

    if (stored) {
      setMyName(stored)
      setHasJoined(true)
    }

    if (adminFlag === 'true') {
      setIsAdmin(true)
    }
  }, [groupCode])

  // ✅ Real-time Firestore sync
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
          p => p.giver.toLowerCase() === myName.toLowerCase()
        )
        setMyPair(found || null)
        setRevealed(true) // ✅ AUTO-REVEAL AFTER START
      }
    })

    return () => unsub()
  }, [groupRef, myName])

  // ✅ Join Group
  async function joinGroup() {
    const n = myName.trim()
    if (!n) return alert('Enter your name')

    if (members.some(m => m.toLowerCase() === n.toLowerCase())) {
      alert('Name already exists')
      return
    }

    await updateDoc(groupRef, {
      members: [...members, n],
    })

    localStorage.setItem(`secret-santa-name-${groupCode}`, n)
    setHasJoined(true)
  }

  // ✅ Shuffle
  function shuffle(arr: string[]) {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  // ✅ Start Game (ADMIN ONLY)
  async function startGame() {
    if (!isAdmin) return
    if (members.length < 2) return alert('Need 2+ players')

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

        {/* JOIN */}
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
          </>
        )}

        {/* MEMBERS LIST */}
        {!started && members.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {members.map((m, i) => (
              <div key={i} className="bg-red-600 text-white px-3 py-1 rounded-full">
                {m}
              </div>
            ))}
          </div>
        )}

        {/* ✅ ADMIN START BUTTON ONLY */}
        {!started && isAdmin && members.length >= 2 && (
          <button
            onClick={startGame}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            🎄 Start the Game
          </button>
        )}

        {/* WAITING FOR HOST */}
        {!started && !isAdmin && (
          <p className="text-center text-gray-500">
            Waiting for host to start the game…
          </p>
        )}

        {/* ✅ FINAL PRIVATE RESULT */}
        {started && myPair && (
          <>
            <p className="text-center text-lg">🎁 You give gift to:</p>
            <p className="text-3xl text-center font-bold text-green-600">
              {myPair.receiver}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
