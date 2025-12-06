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

  // ✅ Restore identity & admin
  useEffect(() => {
    const storedName = localStorage.getItem(`secret-santa-name-${groupCode}`)
    const adminFlag = localStorage.getItem(`secret-santa-admin-${groupCode}`)

    if (storedName) {
      setMyName(storedName)
      setHasJoined(true)
    }

    if (adminFlag === 'true') {
      setIsAdmin(true)
    }
  }, [groupCode])

  // ✅ REAL-TIME FIREBASE SYNC (AUTO REFRESH LOGIC)
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

      // ✅ AUTO ASSIGN MY RESULT WHEN GAME STARTS
      if (dbStarted && myName.trim()) {
        const found = dbPairs.find(
          p => p.giver.toLowerCase() === myName.toLowerCase()
        )
        setMyPair(found || null)
      }
    })

    return () => unsub()
  }, [groupRef, myName])

  // ✅ JOIN GROUP
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

  // ✅ SHUFFLE
  function shuffle(arr: string[]) {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  // ✅ ADMIN STARTS GAME
  async function startGame() {
    if (!isAdmin) return
    if (members.length < 2) return alert('Need at least 2 players')

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-700 to-rose-600 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl max-w-md w-full text-center space-y-4 shadow-xl">

        <h2 className="text-2xl font-bold text-black">
          🎁 Group: {groupCode}
        </h2>

        {/* ✅ JOIN SCREEN */}
        {!hasJoined && !started && (
          <>
            <input
              className="w-full border p-2 rounded text-black"
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

        {/* ✅ MEMBER LIST */}
        {!started && members.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {members.map((m, i) => (
              <span
                key={i}
                className="bg-red-600 text-white px-3 py-1 rounded-full"
              >
                {m}
              </span>
            ))}
          </div>
        )}

        {/* ✅ ADMIN START BUTTON */}
        {!started && isAdmin && members.length >= 2 && (
          <button
            onClick={startGame}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            🎄 Start Game
          </button>
        )}

        {/* ✅ WAITING STATE FOR USERS */}
        {!started && !isAdmin && hasJoined && (
          <p className="text-gray-500 text-sm">
            Waiting for host to start the game…
          </p>
        )}

        {/* ✅ FINAL PRIVATE RESULT */}
        {started && myPair && (
          <>
            <p className="text-lg">🎁 You give gift to:</p>
            <p className="text-3xl font-bold text-green-600">
              {myPair.receiver}
            </p>
          </>
        )}

        {/* ✅ SAFETY MESSAGE */}
        {started && !myPair && hasJoined && (
          <p className="text-sm text-gray-500">
            Assignment not found yet. Please wait…
          </p>
        )}

      </div>
    </div>
  )
}
