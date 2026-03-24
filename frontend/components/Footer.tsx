'use client'

import React from 'react'

const Footer = () => {
  return (
    <footer className="surface-container-lowest border-t border-outline/5 py-10 px-8 mt-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-4 text-center">
        <span className="font-headline text-3xl italic text-primary block">PolCon</span>
        <p className="font-body text-on-surface-variant max-w-sm leading-relaxed">
          A project dedicated to radical transparency in the political sphere. We utilize high-fidelity data scraping and natural language analysis to bridge the gap between rhetoric and reality.
        </p>
      </div>
      <div className="max-w-7xl mx-auto mt-10 pt-8 border-t border-outline/5 flex justify-center items-center">
        <p className="font-body text-xs text-outline">&copy; {new Date().getFullYear()} PolCon. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
