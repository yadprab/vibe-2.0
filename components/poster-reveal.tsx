"use client"

import { useRef, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { animate } from "animejs"

interface PosterRevealProps {
  posterUrl?: string
  revealPercentage: number
  gameState: "playing" | "won" | "lost"
}

export default function PosterReveal({ posterUrl, revealPercentage, gameState }: PosterRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const loadedRef = useRef(false)
  const animatedRef = useRef(false)
  const [isRevealing, setIsRevealing] = useState(false)

  useEffect(() => {
    if (!posterUrl) return

    // Create image element
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = posterUrl
    imageRef.current = img

    img.onload = () => {
      loadedRef.current = true
      drawCanvas()
    }
  }, [posterUrl])

  useEffect(() => {
    if (loadedRef.current) {
      setIsRevealing(true)

      // Animate the reveal with a flash effect
      if (containerRef.current) {
        animate(containerRef.current, {
          filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
          duration: 800,
          easing: "easeOutCubic",
        });
      }

      // Draw the canvas after a slight delay for animation effect
      setTimeout(() => {
        drawCanvas()
        setIsRevealing(false)
      }, 300)
    }
  }, [revealPercentage])

  useEffect(() => {
    if (containerRef.current && !animatedRef.current && posterUrl) {
      // Enhanced entrance animation
      animate(containerRef.current, {
        opacity: [0, 1],
        scale: [0.85, 1],
        translateY: [30, 0],
        duration: 1200,
        easing: "easeOutElastic(1, .6)",
        complete: () => {
          animatedRef.current = true;
        },
      });
    }
  }, [posterUrl])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    const img = imageRef.current

    if (!canvas || !img) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match image
    canvas.width = img.width
    canvas.height = img.height

    // Draw the image
    ctx.drawImage(img, 0, 0)

    // Apply pixelation effect based on reveal percentage
    if (revealPercentage < 100) {
      // Calculate pixel size based on reveal percentage (smaller = more pixelated)
      // Making this more gradual and starting clearer
      const pixelSize = Math.max(3, 20 - revealPercentage / 5)

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Pixelate the image
      for (let y = 0; y < canvas.height; y += pixelSize) {
        for (let x = 0; x < canvas.width; x += pixelSize) {
          // Get the color of the first pixel in the block
          const red = data[(y * canvas.width + x) * 4]
          const green = data[(y * canvas.width + x) * 4 + 1]
          const blue = data[(y * canvas.width + x) * 4 + 2]

          // Fill the block with that color
          ctx.fillStyle = `rgb(${red},${green},${blue})`
          ctx.fillRect(x, y, pixelSize, pixelSize)
        }
      }

      // Add blur effect - reduced blur amount for better visibility
      ctx.filter = `blur(${Math.max(0.5, 5 - revealPercentage / 20)}px)`
      ctx.drawImage(canvas, 0, 0)
      ctx.filter = "none"
    }
  }

  const getBorderClass = () => {
    if (gameState === "won") return "animated-border-win"
    if (gameState === "lost") return "animated-border-lose"
    return "animated-border"
  }

  return (
    <div
      ref={containerRef}
      className={`opacity-0 ${getBorderClass()} transition-all duration-300 ${isRevealing ? "scale-105" : ""}`}
    >
      <Card className="glass-card overflow-hidden h-full flex items-center justify-center bg-black">
        <div className="w-full aspect-[2/3] relative">
          {posterUrl ? (
            <canvas
              ref={canvasRef}
              className={`w-full h-full object-cover transition-all duration-300 ${isRevealing ? "scale-105 brightness-110" : ""}`}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/50">Loading poster...</div>
          )}
          <div className="absolute bottom-2 right-2">
            <div className="text-xs font-mono bg-black/70 text-white/70 px-2 py-1 rounded-md">
              {revealPercentage}% revealed
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
