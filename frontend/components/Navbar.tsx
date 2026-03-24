'use client'

import React from 'react'
import { Github } from 'lucide-react'
import Link from 'next/link'


const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/40 backdrop-blur-xl border-b border-rose-500/10 shadow-2xl shadow-rose-900/20 flex justify-between items-center px-8 py-4 max-w-full mx-auto">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-serif italic font-bold tracking-tight text-primary">
          PolCon
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="https://github.com/SplinterSword/PolCon"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-300 rounded-full active:scale-95 flex items-center gap-2"
        >
          <Github className="h-6 w-6" />
          <span className="hidden sm:inline font-body font-medium">GitHub</span>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
