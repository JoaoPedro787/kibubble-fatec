"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  getServerStoreSnapshot,
  readStore,
  subscribeStore,
  updateStore,
} from "@/shared/libs/storage";
import type { KiBubbleStore, ThemeMode } from "@/shared/types/domain";

interface AppStoreContextValue {
  store: KiBubbleStore;
  hydrated: boolean;
  resolvedTheme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  refreshStore: () => void;
}

const AppStoreContext = createContext<AppStoreContextValue | null>(null);

const noopUnsubscribe = () => {};
const subscribeHydration = () => noopUnsubscribe;

function resolveSystemTheme(): ThemeMode {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function subscribeSystemTheme(callback: () => void): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return noopUnsubscribe;
  }
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function subscribeClientStore(callback: () => void): () => void {
  const unsub = subscribeStore(() => callback());
  if (typeof window === "undefined") return unsub;
  const onStorage = () => callback();
  window.addEventListener("storage", onStorage);
  return () => {
    unsub();
    window.removeEventListener("storage", onStorage);
  };
}

function getClientStoreSnapshot(): KiBubbleStore {
  return readStore();
}

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );

  const store = useSyncExternalStore(
    subscribeClientStore,
    getClientStoreSnapshot,
    getServerStoreSnapshot,
  );

  const systemTheme = useSyncExternalStore(
    subscribeSystemTheme,
    resolveSystemTheme,
    () => "light" as ThemeMode,
  );

  const resolvedTheme: ThemeMode = store.theme ?? systemTheme;

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [hydrated, resolvedTheme]);

  const setTheme = useCallback((theme: ThemeMode) => {
    updateStore((current) => ({
      ...current,
      theme,
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme: ThemeMode = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  }, [resolvedTheme, setTheme]);

  const refreshStore = useCallback(() => {
    readStore();
  }, []);

  const value = useMemo<AppStoreContextValue>(
    () => ({
      store,
      hydrated,
      resolvedTheme,
      setTheme,
      toggleTheme,
      refreshStore,
    }),
    [store, hydrated, resolvedTheme, setTheme, toggleTheme, refreshStore],
  );

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore(): AppStoreContextValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) {
    throw new Error("useAppStore must be used within AppStoreProvider");
  }
  return ctx;
}
