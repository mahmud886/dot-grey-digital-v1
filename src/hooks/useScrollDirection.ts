"use client";

import { useSyncExternalStore } from "react";

export type ScrollState = { direction: "up" | "down"; scrolled: boolean };

const IDLE: ScrollState = { direction: "up", scrolled: false };
/** Ignore sub-pixel jitter and rubber-band overscroll. */
const JITTER = 6;

type Store = {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => ScrollState;
};

const stores = new Map<number, Store>();

function createStore(threshold: number): Store {
  const listeners = new Set<() => void>();
  let state = IDLE;
  let last = 0;
  let frame = 0;
  let attached = false;

  const emit = (next: ScrollState) => {
    if (next.direction === state.direction && next.scrolled === state.scrolled) return;
    state = next;
    for (const listener of listeners) listener();
  };

  const update = () => {
    frame = 0;
    const y = window.scrollY;
    if (Math.abs(y - last) < JITTER) return;
    emit({ direction: y > last && y > threshold ? "down" : "up", scrolled: y > threshold });
    last = y;
  };

  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      if (!attached) {
        attached = true;
        last = window.scrollY;
        // A reload can restore scroll position, so seed from where we actually are.
        state = { direction: "up", scrolled: last > threshold };
        window.addEventListener("scroll", onScroll, { passive: true });
      }
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          attached = false;
          window.removeEventListener("scroll", onScroll);
          if (frame) cancelAnimationFrame(frame);
          frame = 0;
        }
      };
    },
    getSnapshot: () => state,
  };
}

function getStore(threshold: number) {
  let store = stores.get(threshold);
  if (!store) {
    store = createStore(threshold);
    stores.set(threshold, store);
  }
  return store;
}

/** Drives the header: `scrolled` condenses it, `direction` hides or reveals it. */
export function useScrollDirection(threshold = 80): ScrollState {
  const store = getStore(threshold);
  return useSyncExternalStore(store.subscribe, store.getSnapshot, () => IDLE);
}
