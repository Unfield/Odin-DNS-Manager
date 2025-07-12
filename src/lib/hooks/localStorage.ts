// lib/stores/localStorage.ts
import { writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";

interface LocalStorageStore<T> extends Writable<T> {
  destroy?: () => void;
}

/**
 * Creates a writable store that syncs with localStorage
 * @param key - The localStorage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Writable store with localStorage sync
 */
export function localStorageStore<T>(
  key: string,
  defaultValue: T,
): LocalStorageStore<T> {
  // Get initial value from localStorage (only in browser)
  const getStoredValue = (): T => {
    if (!browser) return defaultValue;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  };

  const initialValue = getStoredValue();
  const store = writable<T>(initialValue);

  // Subscribe to store changes and update localStorage
  if (browser) {
    store.subscribe((value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`Error writing to localStorage key "${key}":`, error);
      }
    });

    // Listen for localStorage changes in other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          store.set(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(
            `Error parsing localStorage change for key "${key}":`,
            error,
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return {
      ...store,
      destroy: () => {
        window.removeEventListener("storage", handleStorageChange);
      },
    };
  }

  return store;
}

/**
 * Creates a store with additional methods for localStorage management
 */
export function createLocalStorageStore<T>(key: string, defaultValue: T) {
  const store = localStorageStore(key, defaultValue);

  return {
    ...store,
    reset: () => store.set(defaultValue),
    clear: () => {
      if (browser) {
        localStorage.removeItem(key);
      }
      store.set(defaultValue);
    },
  };
}
