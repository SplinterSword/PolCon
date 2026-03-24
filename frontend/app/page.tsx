"use client"

import type React from "react"
import { useState, useEffect } from "react"

type Contradiction = {
  contradiction_id: number
  topic: string
  statement_1: string
  statement_2: string
  summary: string
  articles: string[]
}

type ContradictionsApiResponse =
  | {
    contradictions: Contradiction[]
    conversation_history?: unknown
  }
  | {
    error: string
    details?: string
  }

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "")

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
      setPoliticianInfo(null)

      if (!backendBaseUrl) {
        throw new Error("NEXT_PUBLIC_BACKEND_URL is not configured.")
      }

      const response = await fetch(`${backendBaseUrl}/getContradictions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: politicianName }),
      })

      let data: ContradictionsApiResponse
      try {
        data = (await response.json()) as ContradictionsApiResponse
        console.log("API Response:", data)
      } catch {
        throw new Error("Failed to parse response from server.")
      }

      if (!response.ok) {
        if (data && typeof data === "object" && "error" in data && typeof data.error === "string") {
          setError(data.details ? `${data.error}: ${data.details}` : data.error)
          setIsLoading(false)
          return
        }
        setError(`Request failed with status ${response.status}.`)
        setIsLoading(false)
        return
      }

      if (data && typeof data === "object" && "error" in data && typeof data.error === "string") {
        setError(data.details ? `${data.error}: ${data.details}` : data.error)
        setIsLoading(false)
        return
      }

      setIsLoading(false)
      setPoliticianDisplayName(politicianName)
      setPoliticianInfo(
        data && typeof data === "object" && "contradictions" in data && Array.isArray(data.contradictions)
          ? data.contradictions
          : [],
      )

    } catch (error) {
      console.error("Error fetching politician info:", error)
      setIsLoading(false)
      setError(error instanceof Error ? error.message : "Error fetching information. Please try again.")
    }
  }

  // Return a loading state or nothing until client-side hydration is complete
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0b1326] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <main className="relative pt-24 min-h-screen">
      {/* Hero Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] hero-glow pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 flex flex-col items-center text-center max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="font-headline text-5xl md:text-8xl italic tracking-tight text-on-surface leading-[1.1] mb-8 max-w-5xl">
            Democracy thrives when <span className="text-primary">ignorance dies</span>
          </h1>
          <p className="font-body text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto font-light leading-relaxed">
            Explore the truth behind political figures and make informed decisions through sovereign, data-driven intelligence.
          </p>
        </div>

        {/* Search Area */}
        <form onSubmit={handleSubmit} className="w-full max-w-3xl glass-panel p-2 rounded-full flex flex-col md:flex-row items-center gap-2 border border-outline/10 shadow-2xl">
          <div className="flex-1 flex items-center px-6 w-full">
            <span className="material-symbols-outlined text-outline mr-3">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-on-surface w-full font-body placeholder:text-outline-variant text-lg h-14 focus:outline-none"
              placeholder="Enter a politician's name..."
              type="text"
              value={politicianName}
              onChange={(e) => setPoliticianName(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto px-8 h-14 bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-bold rounded-full hover:shadow-[0_0_20px_rgba(225,29,72,0.4)] active:scale-95 transition-all duration-300 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Get Information"}
          </button>
        </form>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center mt-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error Message */}
        {error && !politicianInfo && (
          <div className="mt-12 max-w-2xl mx-auto p-4 bg-error-container/50 border border-error/50 rounded-lg text-center">
            <p className="text-on-error-container">{error}</p>
          </div>
        )}
      </section>

      {/* Empty State */}
      {politicianInfo && !error && !isLoading && politicianInfo.length === 0 && (
        <section className="relative px-6 pb-32 max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto p-8 glass-panel border border-outline/10 rounded-xl text-center">
            <p className="text-on-surface-variant text-lg tracking-wide">No verified contradictions found for {politicianDisplayName || "this politician"}.</p>
          </div>
        </section>
      )}

      {/* Results Area / Contradiction Grid */}
      {politicianInfo && politicianInfo.length > 0 && (
        <section className="relative px-6 pb-32 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16 px-4">
            <h2 className="font-headline text-3xl italic text-on-surface break-words max-w-[50%]">Contradictions for {politicianDisplayName}</h2>
            <div className="h-[1px] flex-1 mx-4 md:mx-8 bg-gradient-to-r from-primary/30 to-transparent hidden sm:block"></div>
            <span className="font-label text-label-sm tracking-[0.2em] uppercase text-on-surface-variant hidden sm:block">Live Intel Feed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {politicianInfo.map((contradiction) => (
              <div key={contradiction.contradiction_id} className="group flex flex-col surface-container-high rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-500 border-t border-l border-outline/10 glass-panel">
                <div className="p-8 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="font-headline text-xl text-on-surface">{contradiction.topic}</h3>
                  </div>

                  {/* Initial Statement */}
                  <div className="bg-surface-container-low/50 p-4 rounded-lg mb-4 border-l-2 border-primary/40">
                    <span className="font-label text-[10px] uppercase tracking-widest text-primary/70 block mb-2">Initial Statement</span>
                    <p className="font-body text-sm text-on-surface leading-relaxed italic">"{contradiction.statement_1}"</p>
                  </div>

                  {/* Contradicting Statement */}
                  <div className="bg-surface-container-highest/40 p-4 rounded-lg mb-6 border-l-2 border-secondary/40 flex-1">
                    <span className="font-label text-[10px] uppercase tracking-widest text-secondary/70 block mb-2">Contradiction</span>
                    <p className="font-body text-sm text-on-surface leading-relaxed italic">"{contradiction.statement_2}"</p>
                  </div>

                  {/* Summary */}
                  <div className="mb-6">
                    <p className="font-body text-xs text-on-surface-variant italic leading-relaxed">
                      {contradiction.summary}
                    </p>
                  </div>

                  {/* Sources */}
                  <div className="pt-6 border-t border-outline/5 flex flex-wrap gap-3">
                    {contradiction.articles.map((article, index) => (
                      <a
                        key={index}
                        href={article}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-outline hover:text-primary transition-colors flex items-center gap-1"
                        title={article}
                      >
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                        <span className="text-[10px] font-label uppercase truncate max-w-[100px]">Source {index + 1}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
