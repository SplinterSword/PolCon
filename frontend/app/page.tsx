"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

type Contradiction = {
  contradiction_id: number
  topic: string
  statement_1: string
  statement_2: string
  summary: string
  articles: string[]
}

export default function LandingPage() {
  const [politicianName, setPoliticianName] = useState("")
  const [politicianDisplayName, setPoliticianDisplayName] = useState("")
  const [politicianInfo, setPoliticianInfo] = useState<Contradiction[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Fix hydration mismatch by only rendering client-specific content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      setError(null)

      const reponse = await fetch("http://0.0.0.0:8000/getContradictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: politicianName }),
      })

      const data = await reponse.json()
      setIsLoading(false)
      setPoliticianDisplayName(politicianName)
      setPoliticianInfo(data.contradictions)

    } catch (error) {
      console.error("Error fetching politician info:", error)
      setIsLoading(false)
      setError("Error fetching information. Please try again.")
    }
  }

  // Return a loading state or nothing until client-side hydration is complete
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    )
  }

  return (
      <>
        <main className="container mx-auto px-4 py-16 md:py-24 space-y-16">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Democracy thrives when ignorance dies</h1>
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
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
              required
            />
            <Button type="submit" className="w-full bg-white text-red-600 hover:bg-white/90" disabled={isLoading}>
              {isLoading ? "Loading..." : "Get Information"}
            </Button>
          </form>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          )}

          {/* Error Message */}
          {error && !politicianInfo && (
            <div className="max-w-2xl mx-auto p-4 bg-red-800/50 rounded-lg text-center">
              <p>{error}</p>
            </div>
          )}

          {/* Information Display Area */}
          {politicianInfo && politicianInfo.length > 0 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center">Contradictions for {politicianDisplayName || "Politician"}</h2>

              <div className="space-y-6">
                {politicianInfo.map((contradiction) => (
                  <Card key={contradiction.contradiction_id} className="bg-white/10 border-white/20 overflow-hidden">
                    <CardHeader className="bg-white/5">
                      <CardTitle className="text-xl md:text-2xl">{contradiction.topic}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-white/90">Initial Statement:</h3>
                        <p className="text-white/80 bg-black/20 p-3 rounded-md">{contradiction.statement_1}</p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-semibold text-white/90">Contradicting Statement:</h3>
                        <p className="text-white/80 bg-black/20 p-3 rounded-md">{contradiction.statement_2}</p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-semibold text-white/90">Summary:</h3>
                        <p className="text-white/80 italic">{contradiction.summary}</p>
                      </div>
                    </CardContent>

                    <CardFooter className="flex flex-col items-start border-t border-white/10 bg-white/5">
                      <h3 className="font-semibold text-white/90 mb-2">Sources:</h3>
                      <ul className="space-y-1 w-full">
                        {contradiction.articles.map((article, index) => (
                          <li key={index} className="truncate">
                            <a
                              href={article}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/70 hover:text-white flex items-center"
                            >
                              <ExternalLink className="h-3 w-3 mr-2 flex-shrink-0" />
                              <span className="truncate">{article}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </>
  )
}

