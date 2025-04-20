"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { animate } from "animejs"

type LetterStatus = "correct" | "present" | "absent" | "empty"

interface LetterInputProps {
  value: string
  index: number
  onChange: (value: string, index: number) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void
  status: LetterStatus
  disabled?: boolean
  maxLength?: number
}

export default function LetterInput({
  value,
  index,
  onChange,
  onKeyDown,
  status = "empty",
  disabled = false,
  maxLength = 1,
}: LetterInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const prevStatusRef = useRef<LetterStatus>(status)
  const animatedRef = useRef(false)

  useEffect(() => {
    // Auto-focus the first empty input
    if (value === "" && index === 0 && !disabled && inputRef.current && status !== "correct") {
      inputRef.current.focus()
    }
  }, [value, index, disabled, status])

  useEffect(() => {
    // Animate when status changes to correct or present
    if (containerRef.current && (status === "correct" || status === "present") && prevStatusRef.current !== status) {
      animate(containerRef.current, {
        scale: [1, 1.1, 1],
        duration: 400,
        easing: "easeOutElastic(1, .6)",
        backgroundColor:
          status === "correct"
            ? ["rgba(165, 165, 141, 0.1)", "rgba(165, 165, 141, 0.3)", "rgba(165, 165, 141, 0.2)"]
            : ["rgba(183, 183, 164, 0.1)", "rgba(183, 183, 164, 0.3)", "rgba(183, 183, 164, 0.2)"],
      })
      animatedRef.current = true
    }
    prevStatusRef.current = status
  }, [status])

  // Animate when a correct letter is first displayed
  useEffect(() => {
    if (containerRef.current && status === "correct" && value && !animatedRef.current) {
      animate(containerRef.current, {
        scale: [1, 1.1, 1],
        duration: 400,
        easing: "easeOutElastic(1, .6)",
        backgroundColor: ["rgba(165, 165, 141, 0.1)", "rgba(165, 165, 141, 0.3)", "rgba(165, 165, 141, 0.2)"],
      })
      animatedRef.current = true
    }
  }, [value, status])

  const getStatusClass = () => {
    switch (status) {
      case "correct":
        return "letter-input-correct"
      case "present":
        return "letter-input-present"
      case "absent":
        return "letter-input-absent"
      default:
        return "letter-input-empty"
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          const newValue = e.target.value.slice(-maxLength)
          onChange(newValue, index)
        }}
        onKeyDown={(e) => onKeyDown(e, index)}
        className={`letter-input ${getStatusClass()}`}
        maxLength={maxLength}
        disabled={disabled}
        aria-label={`Letter ${index + 1}`}
      />
    </div>
  )
}
