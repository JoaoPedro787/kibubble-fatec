"use client";

import { ViewTransition } from "react";

/**
 * Wraps page-level content so Next.js route navigations animate according to
 * their transition type (lateral cross-fade or directional slide).
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        "nav-lateral": "fade-in",
        default: "fade-in",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        "nav-lateral": "fade-out",
        default: "fade-out",
      }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
