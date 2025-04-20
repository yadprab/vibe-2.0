"use client"

import { useEffect, useRef, useState } from "react"
import MovieGuesser from "@/components/movie-guesser"
import { animate, stagger } from "animejs"

export default function Home() {
  const titleRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return;
    
    if (titleRef.current) {
      const titleLetters = titleRef.current.querySelectorAll(".title-letter")
      animate(titleLetters, {
        translateY: [40, 0],
        opacity: [0, 1],
        scale: [0.9, 1],
        delay: stagger(50, { start: 300 }),
        duration: 1500,
        easing: "easeOutElastic(1, .5)",
      })
    }

    if (taglineRef.current) {
      animate(taglineRef.current, {
        translateY: [40, 0],
        opacity: [0, 1],
        scale: [0.9, 1],
        delay: 800,
        duration: 1000,
        easing: "easeOutCubic",
      })
    }
  }, [isMounted])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 py-10">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <h1 ref={titleRef} className="text-4xl md:text-5xl">
            <span className="title-letter">C</span>
            <span className="title-letter">i</span>
            <span className="title-letter">n</span>
            <span className="title-letter">e</span>
            <span className="title-letter">M</span>
            <span className="title-letter">y</span>
            <span className="title-letter">s</span>
            <span className="title-letter">t</span>
            <span className="title-letter">e</span>
            <span className="title-letter">r</span>
            <span className="title-letter">y</span>
          </h1>
          <p ref={taglineRef} className="text-lg mt-2 opacity-0 italic text-[#4a4a6a]">
            Where Every Frame Hides a Secret
          </p>
        </div>
        <MovieGuesser />
      </div>
    </main>
  )
}
