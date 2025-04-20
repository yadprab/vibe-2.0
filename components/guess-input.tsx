"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface GuessInputProps {
  onSubmit: (guess: string) => void
  disabled?: boolean
}

export default function GuessInput({ onSubmit, disabled = false }: GuessInputProps) {
  const [guess, setGuess] = useState("")
  const [isShaking, setIsShaking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus()
    }
  }, [disabled])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!guess.trim()) {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
      return
    }

    onSubmit(guess)
    setGuess("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full ${isShaking ? "animate-shake" : ""}`}>
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Guess the movie title..."
            className="bg-purple-900/30 border-purple-400/30 text-white placeholder:text-purple-300/50 focus-visible:ring-purple-400"
          />
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-10 gap-1 w-full max-w-md">
            {Array.from({ length: 10 }).map((_, i) => {
              const letter = guess[i] || ""
              return (
                <div
                  key={i}
                  className={`
                    h-10 w-full flex items-center justify-center rounded border 
                    ${letter ? "bg-purple-700/50 border-purple-400" : "bg-purple-900/30 border-purple-400/30"}
                    text-white font-bold text-lg transition-all
                  `}
                >
                  {letter.toUpperCase()}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </form>
  )
}
