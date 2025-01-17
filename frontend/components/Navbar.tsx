import React from 'react'
import { Github } from 'lucide-react'
import Link from 'next/link'


const Navbar = () => {
  return (
      <nav className="flex items-center justify-between p-4 md:p-6">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          PolCon
        </Link>
        <Link 
          href="https://github.com/SplinterSword/PolCon" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center space-x-2 hover:text-gray-300 transition-colors"
        >
          <Github className="h-6 w-6" />
          <span className="hidden sm:inline">GitHub</span>
        </Link>
      </nav>
  )
}

export default Navbar
