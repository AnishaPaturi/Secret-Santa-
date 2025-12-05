'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

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
    if (e.key === 'Enter' && e.ctrlKey) generatePairs()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-700 via-red-600 to-rose-600 flex items-center justify-center p-6 overflow-hidden relative">

      {/* ❄️ Snow */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute top-[-10px] bg-white rounded-full opacity-80 animate-snow"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDuration: `${Math.random() * 6 + 6}s`,
            }}
          />
        ))}
      </div>

      {/* 🎅 Animated Santa (Emoji based) */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, -3, 3, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-6 left-6 text-6xl z-20"
      >
        🎅
      </motion.div>

      {/* 🎅 Hero Layout */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-red-600 rounded-[2rem] shadow-2xl p-10 text-white font-christmas">

        {/* Left */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-wide drop-shadow-lg">
            Secret Santa
          </h1>
          <p className="text-lg opacity-90 font-sans">
            Invite friends and family, pass the phone, and let the Christmas magic decide your gift partner.
          </p>
        </div>

        {/* Right Card */}
        <motion.div
          animate={shake ? { x: [-12, 12, -12, 12, 0] } : {}}
          transition={{ duration: 0.3 }}
          className="bg-white text-black rounded-2xl shadow-xl p-6 space-y-6 font-sans"
        >
          <h2 className="text-2xl font-bold text-center font-christmas">🎄 Create Secret Santa 🎁</h2>

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
                className="w-full bg-black text-white rounded-xl py-3 font-semibold"
                onClick={generatePairs}
              >
                Start Assignment
              </button>
              <p className="text-xs text-center text-gray-500">Ctrl + Enter to start</p>
            </>
          )}

          {started && index < pairs.length && (
            <>
              <div className="text-center">
                <p className="text-lg font-semibold">Pass the phone to:</p>
                <p className="text-2xl font-bold text-red-600">{pairs[index].giver}</p>
              </div>

              {!revealed ? (
                <button className="w-full bg-black text-white rounded-xl py-3" onClick={() => setRevealed(true)}>
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
                  <button className="w-full bg-black text-white rounded-xl py-3" onClick={nextPerson}>
                    Done → Pass Phone
                  </button>
                </motion.div>
              )}
            </>
          )}

          {started && index >= pairs.length && (
            <div className="text-center space-y-4">
              <p className="text-xl font-bold">🎉 All Done! 🎉</p>
              <button
                className="w-full bg-black text-white rounded-xl py-3"
                onClick={() => location.reload()}
              >
                Restart
              </button>
            </div>
          )}
        </motion.div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@700&display=swap');

        .font-christmas {
          font-family: 'Mountains of Christmas', cursive;
        }

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
