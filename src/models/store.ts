import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { FrictionFilters, FrictionPoint } from "./types";
import { seedFrictionPoints } from "./seed";

// ---------------------------------------------------------------------------
// Minimal external store – keeps friction points + filters in memory
// ---------------------------------------------------------------------------

type Listener = () => void;

interface StoreState {
  points: FrictionPoint[];
  filters: FrictionFilters;
}

const defaultFilters: FrictionFilters = {
  severity: "all",
  status: "all",
  category: "all",
  search: "",
};

let state: StoreState = {
  points: seedFrictionPoints,
  filters: { ...defaultFilters },
};

const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l();
}

function getSnapshot(): StoreState {
  return state;
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// --- public mutations -------------------------------------------------------

export function setFilters(partial: Partial<FrictionFilters>) {
  state = { ...state, filters: { ...state.filters, ...partial } };
  emit();
}

export function updatePointStatus(
  id: string,
  status: FrictionPoint["status"],
) {
  state = {
    ...state,
    points: state.points.map((p) => (p.id === id ? { ...p, status } : p)),
  };
  emit();
}

// --- React hook --------------------------------------------------------------

export function useStore() {
  const snap = useSyncExternalStore(subscribe, getSnapshot);

  const setFiltersCb = useCallback(
    (partial: Partial<FrictionFilters>) => setFilters(partial),
    [],
  );

  const updateStatusCb = useCallback(
    (id: string, status: FrictionPoint["status"]) =>
      updatePointStatus(id, status),
    [],
  );

  return useMemo(
    () => ({
      points: snap.points,
      filters: snap.filters,
      setFilters: setFiltersCb,
      updateStatus: updateStatusCb,
    }),
    [snap, setFiltersCb, updateStatusCb],
  );
}
