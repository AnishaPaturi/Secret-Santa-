import { NextResponse } from 'next/server'

type Pair = { giver: string; receiver: string }

const games = new Map<string, Pair[]>()

export async function POST(req: Request) {
  const body = await req.json()
  const { pairs } = body

  const gameId = Math.random().toString(36).substring(2, 8)
  games.set(gameId, pairs)

  return NextResponse.json({ gameId })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const gameId = searchParams.get('gameId')

  if (!gameId || !games.has(gameId)) {
    return NextResponse.json({ error: 'Invalid Game' }, { status: 404 })
  }

  return NextResponse.json({ pairs: games.get(gameId) })
}
