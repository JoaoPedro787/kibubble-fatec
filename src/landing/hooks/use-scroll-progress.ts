"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";

export interface GlobalScrollState {
  scrollY: number;
  progress: number;
  prefersReducedMotion: boolean;
}

export interface SmoothedPointer {
  x: number;
  y: number;
}

export function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

function subscribeReducedMotion(callback: () => void): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => {};
  }
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", callback);
    return () => mediaQuery.removeEventListener("change", callback);
  }
  if (typeof mediaQuery.addListener === "function") {
    mediaQuery.addListener(callback);
    return () => mediaQuery.removeListener(callback);
  }
  return () => {};
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

function readGlobalScroll(): { scrollY: number; progress: number } {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return { scrollY: 0, progress: 0 };
  }
  const scrollY = window.scrollY || window.pageYOffset || 0;
  const docHeight = document.documentElement?.scrollHeight ?? 0;
  const viewHeight = window.innerHeight || 0;
  const maxScroll = docHeight - viewHeight;
  const progress = maxScroll > 0 ? clamp01(scrollY / maxScroll) : 0;
  return { scrollY, progress };
}

export function useScrollProgress(): GlobalScrollState {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [state, setState] = useState<{
    scrollY: number;
    progress: number;
  }>({
    scrollY: 0,
    progress: 0,
  });

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncNow = () => {
      rafRef.current = null;
      const { scrollY, progress } = readGlobalScroll();
      setState((prev) => {
        if (
          Math.abs(prev.scrollY - scrollY) < 0.5 &&
          Math.abs(prev.progress - progress) < 0.001
        ) {
          return prev;
        }
        return { scrollY, progress };
      });
    };

    const scheduleSync = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(syncNow);
    };

    scheduleSync();

    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync, { passive: true });

    return () => {
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    scrollY: prefersReducedMotion ? 0 : state.scrollY,
    progress: state.progress,
    prefersReducedMotion,
  };
}

export function useScrollVelocityRef(disabled = false): RefObject<number> {
  const velocityRef = useRef(0);

  useEffect(() => {
    if (disabled || typeof window === "undefined") {
      velocityRef.current = 0;
      return;
    }

    let lastY = window.scrollY || window.pageYOffset || 0;
    let lastTime = performance.now();
    let decayId: number | null = null;

    const decayStep = () => {
      if (Math.abs(velocityRef.current) < 0.05) {
        velocityRef.current = 0;
        decayId = null;
        return;
      }
      velocityRef.current *= 0.9;
      decayId = requestAnimationFrame(decayStep);
    };

    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY || window.pageYOffset || 0;
      const dt = Math.max(8, now - lastTime);
      const dy = y - lastY;
      lastY = y;
      lastTime = now;

      velocityRef.current = Math.max(-45, Math.min(45, (dy / dt) * 16));

      if (decayId === null) {
        decayId = requestAnimationFrame(decayStep);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (decayId !== null) cancelAnimationFrame(decayId);
      velocityRef.current = 0;
    };
  }, [disabled]);

  return velocityRef;
}

export function useSectionScrollProgress(
  ref: RefObject<HTMLElement | null>,
  disabled = false,
): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (disabled || typeof window === "undefined") return;

    let rafId: number | null = null;

    const compute = () => {
      rafId = null;
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 768;
      if (rect.height <= 0) {
        setProgress((prev) => (prev === 0 ? prev : 0));
        return;
      }

      const travel = rect.height - viewportHeight;
      const next =
        travel > 0
          ? clamp01(-rect.top / travel)
          : clamp01(-rect.top / Math.max(1, rect.height));

      setProgress((prev) => (Math.abs(prev - next) < 0.002 ? prev : next));
    };

    const schedule = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(compute);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [ref, disabled]);

  return disabled ? 1 : progress;
}

export function useSmoothedPointer(disabled = false): SmoothedPointer {
  const [pointer, setPointer] = useState<SmoothedPointer>({ x: 0, y: 0 });
  const targetRef = useRef<SmoothedPointer>({ x: 0, y: 0 });
  const currentRef = useRef<SmoothedPointer>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (disabled || typeof window === "undefined") {
      targetRef.current = { x: 0, y: 0 };
      currentRef.current = { x: 0, y: 0 };
      return;
    }

    const tick = () => {
      const dx = targetRef.current.x - currentRef.current.x;
      const dy = targetRef.current.y - currentRef.current.y;

      if (Math.abs(dx) < 0.002 && Math.abs(dy) < 0.002) {
        currentRef.current = { ...targetRef.current };
        setPointer({ ...targetRef.current });
        rafRef.current = null;
        return;
      }

      const nextX = currentRef.current.x + dx * 0.14;
      const nextY = currentRef.current.y + dy * 0.14;
      currentRef.current = { x: nextX, y: nextY };
      setPointer({ x: nextX, y: nextY });
      rafRef.current = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      const normX = Math.max(-1, Math.min(1, (event.clientX / w - 0.5) * 2));
      const normY = Math.max(-1, Math.min(1, (event.clientY / h - 0.5) * 2));
      targetRef.current = { x: normX, y: normY };

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const onPointerLeave = () => {
      targetRef.current = { x: 0, y: 0 };
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [disabled]);

  return disabled ? { x: 0, y: 0 } : pointer;
}
