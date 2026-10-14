import confetti from "canvas-confetti";

export function triggerConfetti() {
  if (typeof window === "undefined") return;
  try {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#14b8a6", "#f97316", "#3b82f6", "#ec4899", "#eab308"],
    });
  } catch (e) {
    console.error(e);
  }
}
