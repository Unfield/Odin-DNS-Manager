// src/lib/cookies.ts
import { browser } from "$app/environment";

/**
 * Sets a cookie.
 * @param name The name of the cookie.
 * @param value The value of the cookie.
 * @param [days] The number of days until the cookie expires. If not provided, it's a session cookie.
 */
export function setCookie(name: string, value: string, days?: number): void {
  if (browser) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  } else {
    // console.warn(`setCookie('${name}') called on server, but document is not available.`);
    // In a server context, you'd typically set cookies via response headers.
    // For client-side focused functions like this, it's safer to just prevent execution.
  }
}

/**
 * Gets a cookie by name.
 * @param name The name of the cookie to retrieve.
 * @returns The value of the cookie, or null if not found.
 */
export function getCookie(name: string): string | null {
  if (browser) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
  } else {
    // console.warn(`getCookie('${name}') called on server, but document is not available.`);
  }
  return null; // Return null if not in browser or cookie not found
}

/**
 * Deletes a cookie.
 * @param name The name of the cookie to delete.
 */
export function deleteCookie(name: string): void {
  if (browser) {
    document.cookie = name + "=; Max-Age=-99999999; path=/";
  } else {
    // console.warn(`deleteCookie('${name}') called on server, but document is not available.`);
  }
}
