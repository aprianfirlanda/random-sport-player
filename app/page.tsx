'use client'

export default function Home() {
  async function generate() {
    const res = await fetch('/api/rounds', { method: 'POST' })
    const data = await res.json()
    console.log(data)
    alert('Round generated – check console')
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">
        Random Sport Player
      </h1>

      <button
        onClick={generate}
        className="mt-4 px-4 py-2 bg-black text-white rounded"
      >
        Generate Round
      </button>
    </main>
  )
}
