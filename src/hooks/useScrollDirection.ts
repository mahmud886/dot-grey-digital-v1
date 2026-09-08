"use client";

import { useSyncExternalStore } from "react";

export type ScrollState = { direction: "up" | "down"; scrolled: boolean };

const IDLE: ScrollState = { direction: "up", scrolled: false };
/** Ignore sub-pixel jitter and rubber-band overscroll. */
const JITTER = 6;
/**
 * Flipping on the first few pixels made the header twitch — a trackpad nudge or the tail of
 * a momentum scroll was enough to throw it away. It now has to be a deliberate gesture:
 * hiding costs more travel than bringing it back, because a header you cannot get to is a
 * worse failure than one that lingers.
 */
const HIDE_AFTER = 110;
const SHOW_AFTER = 44;
/** Above this the header always stays put — the hero is still in view. */
const FLOOR = 200;

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
  /** Distance travelled since the scroll last changed direction. */
  let travelled = 0;
  let heading: 1 | -1 = -1;

  const emit = (next: ScrollState) => {
    if (next.direction === state.direction && next.scrolled === state.scrolled) return;
    state = next;
    for (const listener of listeners) listener();
  };

  const update = () => {
    frame = 0;
    const y = Math.max(0, window.scrollY);
    const delta = y - last;
    if (Math.abs(delta) < JITTER) return;
    last = y;

    const next: 1 | -1 = delta > 0 ? 1 : -1;
    if (next !== heading) {
      heading = next;
      travelled = 0;
    }
    travelled += Math.abs(delta);

    // Overscroll momentum at the end of the page can otherwise leave the header hidden with
    // no downward scroll left to bring it back.
    const atBottom =
      y + window.innerHeight >= document.documentElement.scrollHeight - 2;

    let direction = state.direction;
    if (y <= FLOOR || atBottom) direction = "up";
    else if (heading === 1 && travelled > HIDE_AFTER) direction = "down";
    else if (heading === -1 && travelled > SHOW_AFTER) direction = "up";

    emit({ direction, scrolled: y > threshold });
  };

  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      if (!attached) {
        attached = true;
        last = Math.max(0, window.scrollY);
        travelled = 0;
        heading = -1;
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
