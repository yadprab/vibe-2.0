"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import LetterInput from "./letter-input"
import { animate } from "animejs"
import { animateCard } from "@/lib/animation"

interface MovieGuessInputProps {
  onSubmit: (guess: string) => void
  disabled?: boolean
  maxLength?: number
  attempts: number
  maxAttempts: number
  gameState: "playing" | "won" | "lost"
  movieTitleLength?: number
  correctLetters?: { [index: number]: string }
}

export default function MovieGuessInput({
  onSubmit,
  disabled = false,
  maxLength = 10,
  attempts,
  maxAttempts,
  gameState,
  movieTitleLength,
  correctLetters = {},
}: MovieGuessInputProps) {
  // Use movieTitleLength if provided, otherwise use maxLength
  const actualLength = movieTitleLength || maxLength

  const [letters, setLetters] = useState<string[]>(Array(actualLength).fill(""))
  const [isShaking, setIsShaking] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const animatedRef = useRef(false)

  // Reset letters when component mounts or key changes
  useEffect(() => {
    setLetters(Array(actualLength).fill(""))
    animatedRef.current = false
    if (containerRef.current) {
      animateCard(containerRef.current, 300)
      animatedRef.current = true
    }
  }, [actualLength])

  // Update letters with correct letters from previous guesses
  useEffect(() => {
    if (Object.keys(correctLetters).length > 0) {
      const newLetters = [...Array(actualLength).fill("")]

      // Fill in correct letters
      Object.entries(correctLetters).forEach(([indexStr, letter]) => {
        const index = Number.parseInt(indexStr, 10)
        if (index < newLetters.length) {
          newLetters[index] = letter
        }
      })

      setLetters(newLetters)
    }
  }, [correctLetters, actualLength])

  // Add victory animation when game is won
  useEffect(() => {
    if (gameState === "won" && containerRef.current) {
      animate(containerRef.current, {
        scale: [1, 1.03, 1],
        duration: 800,
        easing: "easeOutElastic(1, .6)",
      })
    }
  }, [gameState])

  const handleLetterChange = (value: string, index: number) => {
    // Don't allow changing correct letters
    if (correctLetters[index]) return

    const newLetters = [...letters]
    newLetters[index] = value

    setLetters(newLetters)

    // Auto-advance to next input if a letter was entered
    if (value !== "" && index < actualLength - 1) {
      // Find the next input that isn't a correct letter
      let nextIndex = index + 1
      while (nextIndex < actualLength && correctLetters[nextIndex]) {
        nextIndex++
      }

      if (nextIndex < actualLength) {
        const nextInput = document.querySelector(`input[aria-label="Letter ${nextIndex + 1}"]`) as HTMLInputElement
        if (nextInput) nextInput.focus()
      }
    }

    // Auto-submit if all letters are filled
    const guess = newLetters.join("").trim()
    if (guess.length === actualLength && !guess.includes("")) {
      handleSubmit()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && index > 0 && letters[index] === "") {
      // Find the previous input that isn't a correct letter
      let prevIndex = index - 1
      while (prevIndex >= 0 && correctLetters[prevIndex]) {
        prevIndex--
      }

      if (prevIndex >= 0) {
        const prevInput = document.querySelector(`input[aria-label="Letter ${prevIndex + 1}"]`) as HTMLInputElement
        if (prevInput) prevInput.focus()
      }
    }

    // Handle enter key to submit
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    const guess = letters.join("").trim()

    if (guess.length < 3) {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
      return
    }

    onSubmit(guess)

    // Only clear non-correct letters
    const newLetters = [...letters]
    for (let i = 0; i < newLetters.length; i++) {
      if (!correctLetters[i]) {
        newLetters[i] = ""
      }
    }
    setLetters(newLetters)

    // Focus the first empty input after submission
    setTimeout(() => {
      for (let i = 0; i < actualLength; i++) {
        if (!correctLetters[i]) {
          const input = document.querySelector(`input[aria-label="Letter ${i + 1}"]`) as HTMLInputElement
          if (input && !disabled) {
            input.focus()
            break
          }
        }
      }
    }, 100)
  }

  return (
    <div ref={containerRef} className={`${isShaking ? "animate-shake" : ""}`}>
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {Array.from({ length: actualLength }).map((_, i) => {
          const isCorrect = !!correctLetters[i]
          return (
            <div key={i} className="w-[calc(10%-8px)] max-w-[40px]">
              <LetterInput
                value={letters[i] || ""}
                index={i}
                onChange={handleLetterChange}
                onKeyDown={handleKeyDown}
                status={isCorrect ? "correct" : "empty"}
                disabled={disabled || isCorrect}
              />
            </div>
          )
        })}
      </div>
      <p className="text-xs text-[#6b705c]/70 mt-2 text-center">
        {Object.keys(correctLetters).length > 0
          ? "Correct letters are prefilled and locked"
          : "Type your guess and press Enter"}
      </p>
    </div>
  )
}
