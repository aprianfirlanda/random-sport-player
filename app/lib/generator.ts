type PlayerWithCount = {
  id: string
  name: string
  gender: 'male' | 'female'
  playCount: number
}

export function generateTeams(
  players: PlayerWithCount[],
  playersPerTeam: number
) {
  const totalNeeded = playersPerTeam * 2

  const sorted = [...players].sort(
    (a, b) => a.playCount - b.playCount
  )

  const males = sorted.filter(p => p.gender === 'male')
  const females = sorted.filter(p => p.gender === 'female')

  const targetMale = Math.floor(totalNeeded / 2)

  function pick(list: PlayerWithCount[], count: number) {
    const result: PlayerWithCount[] = []
    const groups = new Map<number, PlayerWithCount[]>()

    list.forEach(p => {
      groups.set(p.playCount, [...(groups.get(p.playCount) || []), p])
    })

    for (const key of [...groups.keys()].sort((a, b) => a - b)) {
      const shuffled = groups.get(key)!.sort(() => Math.random() - 0.5)
      for (const p of shuffled) {
        if (result.length < count) result.push(p)
      }
      if (result.length === count) break
    }

    return result
  }

  const selectedMales = pick(males, targetMale)
  const selectedFemales = pick(
    females,
    totalNeeded - selectedMales.length
  )

  const selected = [...selectedMales, ...selectedFemales]
    .sort(() => Math.random() - 0.5)

  return {
    teamA: selected.slice(0, playersPerTeam),
    teamB: selected.slice(playersPerTeam),
  }
}
