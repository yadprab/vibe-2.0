import { animate, stagger } from "animejs";

export type AnimationTarget = string | HTMLElement | HTMLElement[] | NodeList;

export interface TitleAnimationOptions {
  target: AnimationTarget;
  duration?: number;
  delay?: number;
  easing?: string;
  complete?: () => void;
}

export const animateTitle = ({
  target,
  duration = 1500,
  delay = 300,
  easing = "easeOutElastic(1, .5)",
  complete,
}: TitleAnimationOptions) => {
  return animate(target, {
    translateY: [40, 0],
    opacity: [0, 1],
    scale: [0.9, 1],
    delay: stagger(50, { start: delay }),
    duration,
    easing,
    ...(complete ? { complete } : {}),
  });
};

export const animatePoster = (target: AnimationTarget) => {
  return animate(target, {
    scale: [0.85, 1],
    opacity: [0, 1],
    translateY: [30, 0],
    duration: 1200,
    easing: "easeOutElastic(1, .6)",
  });
};

export const animateCard = (target: AnimationTarget, delay = 0) => {
  return animate(target, {
    translateY: [20, 0],
    opacity: [0, 1],
    duration: 800,
    delay,
    easing: "easeOutCubic",
  });
};

export const animateLetters = (target: AnimationTarget, correct: boolean) => {
  return animate(target, {
    scale: [1, 1.1, 1],
    duration: 400,
    easing: "easeOutElastic(1, .6)",
    backgroundColor: correct
      ? ["rgba(165, 165, 141, 0.1)", "rgba(165, 165, 141, 0.3)", "rgba(165, 165, 141, 0.2)"]
      : ["rgba(183, 183, 164, 0.1)", "rgba(183, 183, 164, 0.3)", "rgba(183, 183, 164, 0.2)"],
  });
};

export const pulseAnimation = (target: AnimationTarget) => {
  return animate(target, {
    boxShadow: [
      "0 0 5px rgba(255, 182, 193, 0.5)",
      "0 0 15px rgba(255, 182, 193, 0.7)",
      "0 0 5px rgba(255, 182, 193, 0.5)",
    ],
    duration: 2000,
    easing: "easeInOutSine",
    loop: true,
  });
};

export const animatePosterReveal = (target: AnimationTarget, percentage: number) => {
  return animate(target, {
    scale: [1, 1.05, 1],
    brightness: [1, 1.2, 1],
    duration: 800,
    easing: "easeOutCubic",
  });
};

export const animateVictory = (target: AnimationTarget, percentage: number) => {
  return animate(target, {
    scale: [1, 1.05, 1],
    rotate: [0, 2, -2, 0],
    duration: 1000,
    easing: "easeOutElastic(1, .4)",
  });
};
