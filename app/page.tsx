'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SecretSanta() {
  const [names, setNames] = useState('')
  const [pairs, setPairs] = useState([])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [started, setStarted] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  function validateNames(list) {
    const lower = list.map(n => n.toLowerCase())
    const unique = new Set(lower)

    if (list.length < 2) {
      setError('Add at least 2 names 🎅')
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return false
    }

    if (unique.size !== list.length) {
      setError('Duplicate names found ❌')
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return false
    }

    setError('')
    return true
  }

  function generatePairs() {
    let list = names.split(',').map(n => n.trim()).filter(Boolean)

    if (!validateNames(list)) return

    let givers = shuffle([...list])
    let receivers = shuffle([...list])

    while (givers.some((g, i) => g === receivers[i])) {
      receivers = shuffle([...list])
    }

    const result = givers.map((g, i) => ({ giver: g, receiver: receivers[i] }))
    setPairs(result)
    setStarted(true)
  }

  function nextPerson() {
    setRevealed(false)
    setIndex(prev => prev + 1)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
      generatePairs()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-green-600 flex items-center justify-center p-6 overflow-hidden relative">

      {/* ❄️ Snowfall */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute top-[-10px] bg-white rounded-full opacity-80 animate-snow"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDuration: `${Math.random() * 5 + 5}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md rounded-2xl shadow-xl bg-white p-6 space-y-6 z-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold text-center text-black"
        >
          🎄 Secret Santa 🎁
        </motion.h1>

        {!started && (
          <>
            <textarea
              className="w-full border-2 border-black p-3 rounded-xl text-black bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
              rows={4}
              placeholder="Enter names comma separated"
              value={names}
              onKeyDown={handleKeyDown}
              onChange={e => setNames(e.target.value)}
            />

            {error && <p className="text-red-600 text-sm font-semibold text-center">{error}</p>}

            <button
              className="w-full bg-black text-white rounded-xl py-2 font-semibold"
              onClick={generatePairs}
            >
              Start Assignment
            </button>
            <p className="text-xs text-center text-gray-500">Tip: Press Ctrl + Enter to start</p>
          </>
        )}

        {started && index < pairs.length && (
          <>
            <div className="text-center">
              <p className="text-lg font-semibold">Pass the phone to:</p>
              <p className="text-2xl font-bold text-red-600">{pairs[index].giver}</p>
            </div>

            {!revealed ? (
              <button className="w-full bg-black text-white rounded-xl py-2" onClick={() => setRevealed(true)}>
                Reveal My Secret Santa
              </button>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-4"
              >
                <p className="text-xl">You have to gift 🎁</p>
                <p className="text-3xl font-bold text-green-600">{pairs[index].receiver}</p>
                <button className="w-full bg-black text-white rounded-xl py-2" onClick={nextPerson}>
                  Done → Pass Phone
                </button>
              </motion.div>
            )}
          </>
        )}

        {started && index >= pairs.length && (
          <div className="text-center space-y-4">
            <p className="text-xl font-bold">🎉 All Done! 🎉</p>
            <button className="w-full bg-black text-white rounded-xl py-2" onClick={() => location.reload()}>
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
