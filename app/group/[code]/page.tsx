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

  const [members, setMembers] = useState<string[]>([])
  const [pairs, setPairs] = useState<Pair[]>([])
  const [started, setStarted] = useState(false)

  const [myPair, setMyPair] = useState<Pair | null>(null)
  const [revealed, setRevealed] = useState(false)

  // 🔹 1) Restore my name from localStorage (per device, per group)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem(`secret-santa-name-${groupCode}`)
    if (saved) {
      setMyName(saved)
      setHasJoined(true)
    }
  }, [groupCode])

  // 🔹 2) Real-time Firestore sync
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

      // try to find my pair whenever data or myName changes
      if (dbStarted && myName.trim()) {
        const found = dbPairs.find(
          p => p.giver.toLowerCase() === myName.trim().toLowerCase()
        )
        setMyPair(found || null)
      } else {
        setMyPair(null)
      }
    })

    return () => unsub()
  }, [groupRef, myName])

  // 🔹 3) Join group
  async function joinGroup() {
    const name = myName.trim()
    if (!name) {
      alert('Please enter your name')
      return
    }

    if (started) {
      alert('Game already started. Ask the host to create a new group.')
      return
    }

    if (members.some(m => m.toLowerCase() === name.toLowerCase())) {
      alert('This name already exists in the group!')
      return
    }

    await updateDoc(groupRef, {
      members: [...members, name],
    })

    if (typeof window !== 'undefined') {
      localStorage.setItem(`secret-santa-name-${groupCode}`, name)
    }

    setHasJoined(true)
  }

  // 🔹 4) Shuffle helper
  function shuffle(arr: string[]) {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  // 🔹 5) Start game once (host or anyone)
  async function startGame() {
    if (started) return

    if (members.length < 2) {
      alert('Need at least 2 members!')
      return
    }

    let givers = shuffle([...members])
    let receivers = shuffle([...members])

    // avoid self-pairing
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

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-700 to-rose-600 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md space-y-6 shadow-xl text-black">

        <h2 className="text-2xl font-bold text-center">
          🎁 Group: {groupCode}
        </h2>

        {/* 🟢 JOIN SECTION (only before game start, before joined) */}
        {!started && !hasJoined && (
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

        {/* 🟢 MEMBER LIST (visible to everyone before start) */}
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

        {/* 🟢 START BUTTON (anyone, only before started) */}
        {!started && members.length >= 2 && (
          <button
            onClick={startGame}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            🎄 Start Secret Santa
          </button>
        )}

        {/* 🔴 GAME STARTED – PRIVATE RESULT */}
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

        {/* 🟡 Started but this device has no saved name / no pair */}
        {started && !myPair && (
          <p className="text-center text-gray-500 text-sm">
            Game has started. Make sure you joined this group earlier from
            this device with the same name, or ask the host to create a new group.
          </p>
        )}
      </div>
    </div>
  )
}
