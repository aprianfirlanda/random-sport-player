import { prisma } from '@/lib/prisma'
import { getTodaySession } from '@/lib/session'
import { generateTeams } from '@/lib/generator'
import { NextResponse } from 'next/server'

const PLAYERS_PER_TEAM = 6 // can be dynamic later

export async function POST() {
  // 1. Get today's session
  const session = await getTodaySession()

  // 2. Load players with today's play count
  const players = await prisma.player.findMany({
    include: {
      participations: {
        where: { sessionId: session.id },
      },
    },
  })

  const playersWithCount = players.map(p => ({
    id: p.id,
    name: p.name,
    gender: p.gender,
    playCount: p.participations[0]?.playCount ?? 0,
  }))

  if (playersWithCount.length < PLAYERS_PER_TEAM * 2) {
    return NextResponse.json(
      { error: 'Not enough players' },
      { status: 400 }
    )
  }

  // 3. Generate fair teams
  const { teamA, teamB } = generateTeams(
    playersWithCount,
    PLAYERS_PER_TEAM
  )

  // 4. Increment play count for today
  const selectedIds = [...teamA, ...teamB].map(p => p.id)

  await Promise.all(
    selectedIds.map(playerId =>
      prisma.participation.upsert({
        where: {
          playerId_sessionId: {
            playerId,
            sessionId: session.id,
          },
        },
        update: {
          playCount: { increment: 1 },
        },
        create: {
          playerId,
          sessionId: session.id,
          playCount: 1,
        },
      })
    )
  )

  return NextResponse.json({
    date: session.playDate,
    teamA,
    teamB,
  })
}
