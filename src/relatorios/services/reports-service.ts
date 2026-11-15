import { readStore } from "@/shared/libs/storage";
import {
  computeReportsSnapshot,
  type ReportsSnapshot,
} from "@/relatorios/utils/analytics";

export function getReportsSnapshot(
  storage?: Storage | null,
  now: Date = new Date(),
): ReportsSnapshot {
  const store = readStore(storage);
  return computeReportsSnapshot(store.sales, now);
}
