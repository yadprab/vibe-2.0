// Simple animation utility functions that don't rely on external libraries
// This will help us avoid the MIME type loading issues

export type AnimationTarget = string | HTMLElement | HTMLElement[] | NodeList

export interface AnimationOptions {
  target: AnimationTarget
  duration?: number
  delay?: number
  complete?: () => void
}

// Simple fade-in animation using CSS transitions
export const fadeIn = (element: HTMLElement, duration = 500, delay = 0) => {
  if (!element) return

  element.style.opacity = "0"
  element.style.transition = `opacity ${duration}ms ease ${delay}ms`

  // Force a reflow to ensure the initial state is applied
  void element.offsetWidth

  // Apply the final state
  element.style.opacity = "1"
}

// Simple slide-up animation using CSS transitions
export const slideUp = (element: HTMLElement, distance = 20, duration = 500, delay = 0) => {
  if (!element) return

  element.style.transform = `translateY(${distance}px)`
  element.style.opacity = "0"
  element.style.transition = `transform ${duration}ms ease ${delay}ms, opacity ${duration}ms ease ${delay}ms`

  // Force a reflow to ensure the initial state is applied
  void element.offsetWidth

  // Apply the final state
  element.style.transform = "translateY(0)"
  element.style.opacity = "1"
}

// Animate multiple elements with staggered delay
export const staggerElements = (
  elements: HTMLElement[],
  animationFn: (el: HTMLElement, delay: number) => void,
  staggerDelay = 50,
  baseDelay = 0,
) => {
  if (!elements || !elements.length) return

  elements.forEach((el, index) => {
    const delay = baseDelay + index * staggerDelay
    animationFn(el, delay)
  })
}

// Simple scale animation
export const scaleElement = (element: HTMLElement, startScale = 0.9, endScale = 1, duration = 500, delay = 0) => {
  if (!element) return

  element.style.transform = `scale(${startScale})`
  element.style.transition = `transform ${duration}ms ease ${delay}ms`

  // Force a reflow to ensure the initial state is applied
  void element.offsetWidth

  // Apply the final state
  element.style.transform = `scale(${endScale})`
}

// Flash animation for highlighting elements
export const flashElement = (element: HTMLElement, duration = 300) => {
  if (!element) return

  element.style.transition = `filter ${duration / 2}ms ease`
  element.style.filter = "brightness(1.3)"

  setTimeout(() => {
    element.style.filter = "brightness(1)"
  }, duration / 2)
}
