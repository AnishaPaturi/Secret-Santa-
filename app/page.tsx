'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

type Pair = { giver: string; receiver: string }

export default function SecretSanta() {
  // ✅ ALL HOOKS SAFELY INSIDE THE COMPONENT
  const [shareLink, setShareLink] = useState('')
  const [confetti, setConfetti] = useState<any>(null)

  const [names, setNames] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [pairs, setPairs] = useState<Pair[]>([])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [started, setStarted] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [locked, setLocked] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [snow, setSnow] = useState(true)

  const revealSound = typeof Audio !== 'undefined' ? new Audio('/sounds/reveal.mp3') : null
  const whooshSound = typeof Audio !== 'undefined' ? new Audio('/sounds/whoosh.mp3') : null
  const endSound = typeof Audio !== 'undefined' ? new Audio('/sounds/celebrate.mp3') : null

  // ✅ SAFE CONFETTI LOADING
  useEffect(() => {
    import('canvas-confetti').then(mod => {
      setConfetti(() => mod.default)
    })
  }, [])

  function shuffle(array: string[]): string[] {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  function validateNames(list: string[]): boolean {
    const lower = list.map(n => n.toLowerCase())
    const unique = new Set(lower)

    if (list.length < 2) {
      setError('Add at least 2 names 🎅')
      setShake(true)
      setTimeout(() => setShake(false), 400)
      return false
    }

    if (unique.size !== list.length) {
      setError('Duplicate names found ❌')
      setShake(true)
      setTimeout(() => setShake(false), 400)
      return false
    }

    setError('')
    return true
  }

  function addName() {
    if (!input.trim()) return
    setNames([...names, input.trim()])
    setInput('')
  }

  function removeName(i: number) {
    setNames(names.filter((_, idx) => idx !== i))
  }

  async function generatePairs() {
    if (!validateNames(names)) return

    let givers = shuffle([...names])
    let receivers = shuffle([...names])

    while (givers.some((g, i) => g === receivers[i])) {
      receivers = shuffle([...names])
    }

    const result = givers.map((g, i) => ({ giver: g, receiver: receivers[i] }))
    setPairs(result)
    setStarted(true)

    // ✅ SAVE GAME TO SERVER
    const res = await fetch('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pairs: result })
    })

    const data = await res.json()
    const link = `${window.location.origin}/game/${data.gameId}`
    setShareLink(link)
  }

  function nextPerson() {
    setRevealed(false)
    setLocked(true)
    whooshSound?.play()

    setTimeout(() => {
      setIndex(prev => prev + 1)
      setLocked(false)
    }, 1200)
  }

  function reveal() {
    setRevealed(true)
    revealSound?.play()
    navigator.vibrate?.(200)
  }

  // ✅ FINAL CONFETTI + CELEBRATION
  useEffect(() => {
    if (started && index === pairs.length && pairs.length && confetti) {
      confetti({ particleCount: 250, spread: 180 })
      endSound?.play()
    }
  }, [index, started, pairs, confetti, endSound])

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? 'bg-gradient-to-br from-black to-gray-900'
          : 'bg-gradient-to-br from-red-700 to-rose-600'
      } flex items-center justify-center p-6 overflow-hidden relative`}
    >
      {/* ❄️ Snow */}
      {snow && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute top-[-10px] bg-white rounded-full opacity-80 animate-snow"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                animationDuration: `${Math.random() * 6 + 6}s`
              }}
            />
          ))}
        </div>
      )}

      {/* 🎅 Santa GIF */}
      <motion.img
        src="/santa.gif"
        className="absolute bottom-6 left-6 w-40 z-20"
        animate={{ x: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />

      {/* Toggles */}
      <div className="fixed top-4 right-4 space-x-3 z-30">
        <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-1 bg-white text-black rounded">
          🌙
        </button>
        <button onClick={() => setSnow(!snow)} className="px-3 py-1 bg-white text-black rounded">
          ❄️
        </button>
      </div>

      {/* Main Card */}
      <motion.div
        animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
        transition={{ duration: 0.3 }}
        className={`w-full max-w-md rounded-2xl shadow-xl ${
          darkMode ? 'bg-black text-white' : 'bg-white text-black'
        } p-6 space-y-6 z-10`}
      >
        <h2 className="text-2xl font-bold text-center">🎄 Secret Santa 🎁</h2>

        {/* ✅ NAME CHIPS */}
        {!started && (
          <>
            <div className="flex">
              <input
                className="flex-1 border p-2 rounded-l text-black"
                placeholder="Type name"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addName()}
              />
              <button onClick={addName} className="bg-black text-white px-4 rounded-r">
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {names.map((n, i) => (
                <div key={i} className="bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-2">
                  {n}
                  <button onClick={() => removeName(i)}>❌</button>
                </div>
              ))}
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button className="w-full bg-black text-white py-2 rounded" onClick={generatePairs}>
              Start Assignment
            </button>
          </>
        )}

        {/* ✅ SHARE LINK */}
        {shareLink && (
          <div className="bg-green-100 text-black p-3 rounded text-sm break-all text-center">
            Share this link with players:
            <br />
            <strong>{shareLink}</strong>
          </div>
        )}

        {/* ✅ GAME FLOW */}
        {started && index < pairs.length && (
          <>
            {!locked ? (
              <>
                <p className="text-lg text-center">Pass phone to</p>
                <p className="text-2xl font-bold text-center text-red-600">
                  {pairs[index].giver}
                </p>

                {!revealed ? (
                  <button className="w-full bg-black text-white py-2 rounded" onClick={reveal}>
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
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center text-white text-xl rounded-2xl">
                Pass phone to next person 🔒
              </div>
            )}
          </>
        )}

        {/* ✅ END */}
        {started && index >= pairs.length && (
          <div className="text-center space-y-4">
            <p className="text-xl font-bold">🎉 All Done! 🎉</p>
            <button className="w-full bg-black text-white py-2 rounded" onClick={() => location.reload()}>
              Restart
            </button>
          </div>
        )}
      </motion.div>

      <style jsx global>{`
        @keyframes snow {
          to {
            transform: translateY(110vh);
          }
        }
        .animate-snow {
          animation-name: snow;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  )
}
