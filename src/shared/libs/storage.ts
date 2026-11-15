import { createInitialSeed } from "@/shared/libs/seed";
import type { KiBubbleStore, ThemeMode } from "@/shared/types/domain";

export const STORAGE_KEY = "kibubble:v1:store";

type StoreListener = (store: KiBubbleStore) => void;

const listeners = new Set<StoreListener>();

const SERVER_SNAPSHOT: KiBubbleStore = createInitialSeed(
  new Date("2026-01-01T12:00:00.000Z"),
);

let cachedRaw: string | null = null;
let cachedStore: KiBubbleStore | null = null;

function isValidTheme(value: unknown): value is ThemeMode | null {
  return value === null || value === "light" || value === "dark";
}

function isValidStore(value: unknown): value is KiBubbleStore {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<KiBubbleStore>;
  return (
    candidate.version === 1 &&
    isValidTheme(candidate.theme ?? null) &&
    Array.isArray(candidate.ingredients) &&
    Array.isArray(candidate.products) &&
    Array.isArray(candidate.orders) &&
    Array.isArray(candidate.sales) &&
    typeof candidate.nextOrderNumber === "number"
  );
}

export function getBrowserStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getServerStoreSnapshot(): KiBubbleStore {
  return SERVER_SNAPSHOT;
}

export function subscribeStore(listener: StoreListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners(store: KiBubbleStore): void {
  for (const listener of listeners) {
    listener(store);
  }
}

export function readStore(
  storage: Storage | null = getBrowserStorage(),
): KiBubbleStore {
  if (!storage) {
    return SERVER_SNAPSHOT;
  }

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw && raw === cachedRaw && cachedStore) {
      return cachedStore;
    }

    if (!raw) {
      const seed = createInitialSeed();
      const serialized = JSON.stringify(seed);
      storage.setItem(STORAGE_KEY, serialized);
      cachedRaw = serialized;
      cachedStore = seed;
      return seed;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isValidStore(parsed)) {
      const seed = createInitialSeed();
      const serialized = JSON.stringify(seed);
      storage.setItem(STORAGE_KEY, serialized);
      cachedRaw = serialized;
      cachedStore = seed;
      return seed;
    }

    cachedRaw = raw;
    cachedStore = parsed;
    return parsed;
  } catch {
    const seed = createInitialSeed();
    const serialized = JSON.stringify(seed);
    try {
      storage.setItem(STORAGE_KEY, serialized);
      cachedRaw = serialized;
      cachedStore = seed;
    } catch {
      // Ignore storage quota/availability errors during fallback
    }
    return seed;
  }
}

export function writeStore(
  nextStore: KiBubbleStore,
  storage: Storage | null = getBrowserStorage(),
): KiBubbleStore {
  if (storage) {
    const serialized = JSON.stringify(nextStore);
    storage.setItem(STORAGE_KEY, serialized);
    cachedRaw = serialized;
    cachedStore = nextStore;
  }
  notifyListeners(nextStore);
  return nextStore;
}

export function updateStore(
  updater: (current: KiBubbleStore) => KiBubbleStore,
  storage: Storage | null = getBrowserStorage(),
): KiBubbleStore {
  const current = readStore(storage);
  const next = updater(current);
  return writeStore(next, storage);
}
