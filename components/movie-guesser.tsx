"use client"

import { useState, useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import confetti from "canvas-confetti"
import ScratchPoster from "@/components/scratch-poster"
import MovieGuessInput from "@/components/movie-guess-input"
import SpoilerText from "@/components/spoiler-text"
import { animate } from "animejs"
import { fetchRandomMovie } from "@/app/actions/movie-actions"

export default function MovieGuesser() {
  // Define ALL state hooks at the top of the component
  const [attempts, setAttempts] = useState(0)
  const [maxAttempts] = useState(3)
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing")
  const [revealPercentage, setRevealPercentage] = useState(30)
  const [guessedCorrectly, setGuessedCorrectly] = useState(false)
  const [previousGuesses, setPreviousGuesses] = useState<string[]>([])
  const [correctLetters, setCorrectLetters] = useState<{ [index: number]: string }>({})
  const [showHint, setShowHint] = useState(false)
  const [resetKey, setResetKey] = useState(0) // Add a reset key to force re-render
  const [isMounted, setIsMounted] = useState(false)

  const detailsCardRef = useRef<HTMLDivElement>(null)
  const gameContainerRef = useRef<HTMLDivElement>(null)

  const {
    data: movie,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["randomMovie"],
    queryFn: fetchRandomMovie,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  })

  // Client-side only effect
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Update showHint based on attempts
  useEffect(() => {
    setShowHint(attempts > 0 && gameState === "playing")
  }, [attempts, gameState])

  useEffect(() => {
    if (attempts >= maxAttempts && !guessedCorrectly) {
      setGameState("lost")
      setRevealPercentage(100)
    }
  }, [attempts, maxAttempts, guessedCorrectly])

  useEffect(() => {
    if (!isMounted) return;
    
    if (gameState !== "playing" && detailsCardRef.current) {
      animate(detailsCardRef.current, {
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 800,
        delay: 300,
        easing: "easeOutCubic",
      })
    }
  }, [gameState, isMounted])

  // Ensure proper game state transition
  useEffect(() => {
    if (guessedCorrectly && gameState === "won") {
      setRevealPercentage(100)
    }
  }, [guessedCorrectly, gameState])

  const handleGuess = (guess: string) => {
    if (gameState !== "playing" || !movie) return

    // Normalize both strings by removing spaces and converting to lowercase
    const normalizedGuess = guess.toLowerCase().replace(/\s+/g, "").trim()
    const normalizedTitle = movie.Title.toLowerCase().replace(/\s+/g, "").trim()

    console.log("Comparing:", normalizedGuess, "with", normalizedTitle)

    setPreviousGuesses([...previousGuesses, guess])

    // Check for correct letters and their positions
    const newCorrectLetters = { ...correctLetters }

    // Process the guess to find correct letters
    for (let i = 0; i < normalizedGuess.length; i++) {
      if (i < normalizedTitle.length && normalizedGuess[i] === normalizedTitle[i]) {
        newCorrectLetters[i] = normalizedGuess[i]
      }
    }

    setCorrectLetters(newCorrectLetters)

    if (normalizedGuess === normalizedTitle) {
      setGuessedCorrectly(true)
      setGameState("won")
      setRevealPercentage(100)

      // Trigger enhanced confetti animation with lavender colors
      setTimeout(() => {
        confetti({
          particleCount: 200,
          spread: 90,
          origin: { y: 0.6 },
          colors: ["#ffb6c1", "#ffd1dc", "#ffc8dd", "#ffafcc"],
          startVelocity: 30,
          gravity: 0.8,
          shapes: ["circle", "square"],
          scalar: 1.2,
        })

        // Add a second burst for more effect
        setTimeout(() => {
          confetti({
            particleCount: 150,
            angle: 60,
            spread: 70,
            origin: { x: 0, y: 0.6 },
            colors: ["#ffb6c1", "#ffd1dc", "#ffc8dd"],
          })

          confetti({
            particleCount: 150,
            angle: 120,
            spread: 70,
            origin: { x: 1, y: 0.6 },
            colors: ["#ffb6c1", "#ffd1dc", "#ffc8dd"],
          })
        }, 300)
      }, 100)
    } else {
      setAttempts(attempts + 1)
      // Increase reveal percentage with each wrong guess - but keep it reasonable
      // First attempt: 30%, Second: 45%, Third: 60%
      setRevealPercentage(30 + (attempts + 1) * 15)
    }
  }

  const resetGame = () => {
    setAttempts(0)
    setGameState("playing")
    setRevealPercentage(30)
    setGuessedCorrectly(false)
    setPreviousGuesses([])
    setCorrectLetters({})
    setResetKey((prev) => prev + 1) // Increment reset key to force re-render
    refetch()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffb6c1]"></div>
      </div>
    )
  }

  // Get movie title length, removing spaces
  const movieTitleLength = movie?.Title ? movie.Title.replace(/\s+/g, "").length : 10

  return (
    <div ref={gameContainerRef} className="game-container">
      <div className="pink-card p-4 sm:p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          <div className="md:col-span-5">
            <div className="poster-container">
              <ScratchPoster
                posterUrl={movie?.Poster}
                revealPercentage={revealPercentage}
                gameState={gameState}
                attemptNumber={attempts}
              />
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="guess-container">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-normal text-[#4a4a6a]">Guess That Flick</h3>
                <span className="badge text-xs sm:text-sm">
                  {gameState === "playing"
                    ? `Attempt ${attempts + 1}/${maxAttempts}`
                    : gameState === "won"
                      ? "You won!"
                      : "Game over"}
                </span>
              </div>

              <MovieGuessInput
                key={resetKey}
                onSubmit={handleGuess}
                disabled={gameState !== "playing"}
                attempts={attempts}
                maxAttempts={maxAttempts}
                gameState={gameState}
                movieTitleLength={movieTitleLength}
                correctLetters={correctLetters}
              />

              {showHint && (
                <div className="mt-4">
                  <SpoilerText text={movie?.Plot || ""} label="Synopsis" />
                </div>
              )}

              {gameState !== "playing" && (
                <div ref={detailsCardRef} className="mt-6 opacity-0">
                  <div className="border-t border-[#ffb6c1]/30 pt-4 mt-4">
                    <h3 className="text-xl font-normal text-[#4a4a6a] mb-2">{movie?.Title}</h3>
                    <div className="flex items-center mb-2">
                      <span className="badge mr-2">{movie?.Year}</span>
                    </div>
                    <p className="text-[#4a4a6a] mb-4">{movie?.Plot}</p>
                    <button onClick={resetGame} className="pink-button w-full">
                      Play Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
