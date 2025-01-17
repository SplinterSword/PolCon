'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function LandingPage() {
  const [politicianName, setPoliticianName] = useState('')
  const [politicianInfo, setPoliticianInfo] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {

      const response = await fetch('http://localhost:8080/healthz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: await JSON.stringify({ "name": politicianName }),
      })
      const data = await response.json()

      setPoliticianInfo(data.message)

    } catch (error) {

      console.error('Error fetching politician info:', error)
      setPoliticianInfo('Error fetching information. Please try again.')

    }
  }

  return (
      <main className="container mx-auto px-4 py-16 md:py-24 space-y-16">

        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Democracy thrives when ignorance dies
          </h1>
          <p className="text-xl md:text-2xl mb-12 opacity-80">
            Explore the truth behind political figures and make informed decisions.
          </p>
        </div>

        {/* Politician Search Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
          <Input
            type="text"
            placeholder="Enter politician's name"
            value={politicianName}
            onChange={(e) => setPoliticianName(e.target.value)}
            required
          />
          <Button type="submit" className="w-full bg-white text-red-600 hover:bg-white/90">
            Get Information
          </Button>
        </form>

        {/* Information Display Area */}
        {politicianInfo && (
          <Card className="max-w-2xl mx-auto bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl">Politician Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{politicianInfo}</p>
            </CardContent>
          </Card>
        )}
      </main>
  )
}

