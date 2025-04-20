"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { animate } from "animejs"
import { CustomProgress } from "@/components/ui/custom-progress"

interface ScratchPosterProps {
  posterUrl?: string
  revealPercentage: number
  gameState: "playing" | "won" | "lost"
  attemptNumber: number
}

export default function ScratchPoster({ posterUrl, revealPercentage, gameState, attemptNumber }: ScratchPosterProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const loadedRef = useRef(false)
  const animatedRef = useRef(false)
  const [isRevealing, setIsRevealing] = useState(false)
  const [scratchedPercentage, setScratchedPercentage] = useState(0)
  const [isDrawing, setIsDrawing] = useState(false)
  const [scratchLimit, setScratchLimit] = useState(20)
  const [scratchRemaining, setScratchRemaining] = useState(20)
  const [quirkyText, setQuirkyText] = useState("Start scratching!")
  const [isMounted, setIsMounted] = useState(false)

  const quirkyTexts = [
    "Scratch to reveal the mystery!",
    "Keep scratching, movie buff!",
    "Peek-a-boo, I see a movie!",
    "Almost there, film fanatic!",
    "The plot thickens... scratch more!",
    "Lights, camera, scratch!",
    "That's a wrap! Fully revealed!",
    "Voilà! Movie magic uncovered!",
    "Scratch limit reached!",
  ]

  // Client-side only effect
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Set scratch limit based on attempt number
  useEffect(() => {
    // Increase scratch limit with each attempt
    const newLimit = 20 + attemptNumber * 10
    setScratchLimit(newLimit)
    setScratchRemaining(newLimit)
    setScratchedPercentage(0)
  }, [attemptNumber])

  useEffect(() => {
    if (!posterUrl) return

    // Create image element
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = posterUrl
    imageRef.current = img

    img.onload = () => {
      loadedRef.current = true
      initCanvas()
      drawOverlay()
    }
  }, [posterUrl])

  useEffect(() => {
    if (!isMounted) return;
    if (loadedRef.current) {
      setIsRevealing(true)

      // Update the quirky text based on reveal percentage
      if (revealPercentage >= 100) {
        setQuirkyText(quirkyTexts[7])
      } else if (revealPercentage >= 70) {
        setQuirkyText(quirkyTexts[5])
      } else if (revealPercentage >= 50) {
        setQuirkyText(quirkyTexts[3])
      } else if (revealPercentage >= 30) {
        setQuirkyText(quirkyTexts[1])
      } else {
        setQuirkyText(quirkyTexts[0])
      }

      // Animate the reveal with a flash effect
      if (containerRef.current) {
        animate(containerRef.current, {
          filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
          duration: 800,
          easing: "easeOutCubic",
        })
      }

      // Draw the overlay after a slight delay for animation effect
      setTimeout(() => {
        drawOverlay()
        setIsRevealing(false)
      }, 300)
    }
  }, [revealPercentage, isMounted])

  useEffect(() => {
    if (!isMounted) return;
    if (containerRef.current && !animatedRef.current && posterUrl) {
      // Enhanced entrance animation
      animate(containerRef.current, {
        opacity: [0, 1],
        scale: [0.85, 1],
        translateY: [30, 0],
        duration: 1200,
        easing: "easeOutElastic(1, .6)",
        complete: () => {
          animatedRef.current = true
        },
      })
    }
  }, [posterUrl, isMounted])

  const initCanvas = () => {
    const canvas = canvasRef.current
    const overlayCanvas = overlayCanvasRef.current
    const img = imageRef.current

    if (!canvas || !overlayCanvas || !img) return

    // Set canvas dimensions to match image
    const aspectRatio = img.width / img.height
    const containerWidth = containerRef.current?.clientWidth || 300
    const canvasWidth = containerWidth
    const canvasHeight = canvasWidth / aspectRatio

    canvas.width = canvasWidth
    canvas.height = canvasHeight
    overlayCanvas.width = canvasWidth
    overlayCanvas.height = canvasHeight

    // Draw the image on the base canvas
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight)
    }

    // Initialize the overlay
    drawOverlay()
  }

  const drawOverlay = () => {
    const overlayCanvas = overlayCanvasRef.current
    if (!overlayCanvas) return

    const ctx = overlayCanvas.getContext("2d")
    if (!ctx) return

    // Clear the canvas
    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)

    // Calculate how much of the poster should be covered
    const coverPercentage = 100 - revealPercentage

    if (coverPercentage <= 0) {
      // If fully revealed, don't draw any overlay
      setScratchedPercentage(100)
      return
    }

    // Create a pattern for the scratch-off overlay
    const patternSize = 20
    ctx.fillStyle = "#ffb6c1"
    ctx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height)

    // Add some texture to the overlay
    for (let x = 0; x < overlayCanvas.width; x += patternSize) {
      for (let y = 0; y < overlayCanvas.height; y += patternSize) {
        ctx.fillStyle = `rgba(255, 209, 220, ${Math.random() * 0.2})`
        ctx.fillRect(x, y, patternSize, patternSize)
      }
    }

    // Add a border
    ctx.strokeStyle = "#ffd1dc"
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, overlayCanvas.width, overlayCanvas.height)

    // Add some text or pattern to indicate it's scratchable
    ctx.fillStyle = "#4a4a6a" // Lavender text color
    ctx.font = "16px 'Segoe UI'"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Draw diagonal scratch lines
    const lineSpacing = 40
    ctx.strokeStyle = "#ffd1dc"
    ctx.lineWidth = 1

    for (let i = -overlayCanvas.height; i < overlayCanvas.width + overlayCanvas.height; i += lineSpacing) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i + overlayCanvas.height, overlayCanvas.height)
      ctx.stroke()
    }
  }

  const handleScratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (gameState !== "playing" || revealPercentage >= 100 || scratchRemaining <= 0) return

    const overlayCanvas = overlayCanvasRef.current
    if (!overlayCanvas) return

    const ctx = overlayCanvas.getContext("2d")
    if (!ctx) return

    // Get position
    let x, y
    if ("touches" in e) {
      // Touch event
      const rect = overlayCanvas.getBoundingClientRect()
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      // Mouse event
      x = e.nativeEvent.offsetX
      y = e.nativeEvent.offsetY
    }

    // Calculate area before scratching
    const beforeImageData = ctx.getImageData(0, 0, overlayCanvas.width, overlayCanvas.height)
    const beforeData = beforeImageData.data
    let beforeTransparentPixels = 0
    for (let i = 0; i < beforeData.length; i += 4) {
      if (beforeData[i + 3] === 0) {
        beforeTransparentPixels++
      }
    }

    // Erase a circle at the pointer position
    ctx.globalCompositeOperation = "destination-out"
    ctx.beginPath()
    ctx.arc(x, y, 20, 0, Math.PI * 2)
    ctx.fill()

    // Calculate area after scratching
    const afterImageData = ctx.getImageData(0, 0, overlayCanvas.width, overlayCanvas.height)
    const afterData = afterImageData.data
    let afterTransparentPixels = 0
    for (let i = 0; i < afterData.length; i += 4) {
      if (afterData[i + 3] === 0) {
        afterTransparentPixels++
      }
    }

    // Calculate how much was scratched in this action
    const pixelsScratched = afterTransparentPixels - beforeTransparentPixels
    const totalPixels = overlayCanvas.width * overlayCanvas.height
    const percentScratched = (pixelsScratched / totalPixels) * 100

    // Update scratch remaining
    const newScratchRemaining = Math.max(0, scratchRemaining - percentScratched)
    setScratchRemaining(newScratchRemaining)

    // If scratch limit reached, update text
    if (newScratchRemaining <= 0) {
      setQuirkyText(quirkyTexts[8])
    }

    // Calculate total scratched percentage
    const newScratchedPercentage = Math.min(100, Math.round((afterTransparentPixels / totalPixels) * 100))
    setScratchedPercentage(newScratchedPercentage)

    // Update quirky text based on scratched percentage
    if (newScratchedPercentage > 90) {
      setQuirkyText(quirkyTexts[7])
    } else if (newScratchedPercentage > 70) {
      setQuirkyText(quirkyTexts[6])
    } else if (newScratchedPercentage > 50) {
      setQuirkyText(quirkyTexts[4])
    } else if (newScratchedPercentage > 30) {
      setQuirkyText(quirkyTexts[2])
    }
  }

  const handleMouseDown = () => {
    if (scratchRemaining > 0) {
      setIsDrawing(true)
    }
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing && scratchRemaining > 0) {
      handleScratch(e)
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (scratchRemaining > 0) {
      handleScratch(e)
    }
  }

  return (
    <div ref={containerRef} className={`transition-all duration-300 ${isRevealing ? "scale-105" : ""}`}>
      <div className="w-full aspect-[2/3] relative">
        {posterUrl ? (
          <div className="scratch-container">
            <canvas ref={canvasRef} className="w-full h-full object-cover" />
            <canvas
              ref={overlayCanvasRef}
              className={`absolute top-0 left-0 w-full h-full object-cover ${gameState !== "playing" ? "hidden" : ""}`}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              onTouchMove={handleTouchMove}
            />
            <div className="scratch-text">
              {gameState === "playing"
                ? quirkyText
                : gameState === "won"
                  ? "Ta-da! Mystery solved!"
                  : "Oh no! Better luck next time!"}
            </div>

            {/* Scratch limit indicator */}
            {gameState === "playing" && (
              <div className="absolute top-2 left-2 right-2 bg-white/80 rounded-md p-1">
                <div className="text-xs text-[#4a4a6a] mb-1 text-center">
                  Scratch Remaining: {Math.round(scratchRemaining)}%
                </div>
                <CustomProgress
                  value={scratchRemaining}
                  max={scratchLimit}
                  className="bg-pink-light/30"
                  indicatorClassName="bg-pink-DEFAULT"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#4a4a6a]">Loading poster...</div>
        )}
      </div>
    </div>
  )
}
