"use client";
import { useEffect, useState } from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Types out a single string char-by-char. Restarts whenever `text` changes.
 * Used by the Skills sticky modal (retype the hovered stack's note).
 */
export function useTypewriter(text: string, speed = 26) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setOut(text);
      setDone(true);
      return;
    }
    setOut("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return { text: out, done };
}

type CyclePhase = "typing" | "holding" | "deleting";

/**
 * Cycles through an array of strings: type -> hold -> delete -> next.
 * Used by the AI teaser bubble. `phase` lives in state so the effect re-runs
 * on every transition.
 */
export function useTypewriterCycle(
  phrases: string[],
  {
    typeSpeed = 45,
    deleteSpeed = 25,
    hold = 1600,
    enabled = true,
  }: { typeSpeed?: number; deleteSpeed?: number; hold?: number; enabled?: boolean } = {}
) {
  const [out, setOut] = useState("");
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<CyclePhase>("typing");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (!enabled) {
      setOut("");
      setIndex(0);
      setPhase("typing");
      return;
    }

    if (phrases.length === 0) return;
    const current = phrases[index % phrases.length];

    // Reduced motion: show each phrase fully, swap on the hold interval.
    if (reduced) {
      setOut(current);
      const id = setTimeout(() => setIndex((n) => n + 1), hold * 2);
      return () => clearTimeout(id);
    }

    let timer: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (out.length < current.length) {
        timer = setTimeout(() => setOut(current.slice(0, out.length + 1)), typeSpeed);
      } else {
        setPhase("holding");
      }
    } else if (phase === "holding") {
      timer = setTimeout(() => setPhase("deleting"), hold);
    } else {
      // deleting
      if (out.length > 0) {
        timer = setTimeout(() => setOut(current.slice(0, out.length - 1)), deleteSpeed);
      } else {
        setIndex((n) => n + 1);
        setPhase("typing");
      }
    }

    return () => clearTimeout(timer!);
  }, [out, index, phase, reduced, phrases, typeSpeed, deleteSpeed, hold, enabled]);

  return out;
}
