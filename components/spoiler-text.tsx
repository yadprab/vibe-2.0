"use client"

import { useState } from "react"

interface SpoilerTextProps {
  text: string
  label?: string
}

export default function SpoilerText({ text, label = "Hint" }: SpoilerTextProps) {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <div className="w-full">
      <button onClick={() => setIsRevealed(!isRevealed)} className="pink-button mb-2 text-xs">
        {isRevealed ? "Hide" : "Show"} {label}
      </button>
      <div
        className={`
          p-3 rounded-md transition-all duration-300 ease-in-out
          ${isRevealed ? "bg-white/30" : "bg-white/10 text-transparent select-none"}
          ${isRevealed ? "" : "blur-sm hover:blur-[6px]"}
          border border-[#ffb6c1]/20 text-[#4a4a6a]
        `}
      >
        {text}
      </div>
    </div>
  )
}
