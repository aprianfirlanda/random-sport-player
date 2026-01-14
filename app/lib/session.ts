import { prisma } from './prisma'

export async function getTodaySession() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return prisma.session.upsert({
    where: { playDate: today },
    update: {},
    create: { playDate: today },
  })
}
