import API from "./axios";

// Use /contests as a ping — it's always available and lightweight enough
const PING_ENDPOINT = "/contests";
const SLOW_THRESHOLD_MS = 4000; // if backend takes >4s, show wake-up banner

/**
 * Sends a silent wake-up ping to the Render.com backend on app startup.
 * Render free tier "sleeps" after 15 min of inactivity — this wakes it up
 * before the user opens any page, reducing perceived wait time.
 *
 * @param {function} onSlow - called if backend takes > SLOW_THRESHOLD_MS ms
 * @returns {Promise<void>}
 */
export const wakeUpBackend = async (onSlow) => {
  const start = Date.now();
  let slowTimer = null;

  try {
    // Show wake-up banner if backend is slow (cold start)
    if (onSlow) {
      slowTimer = window.setTimeout(() => {
        onSlow();
      }, SLOW_THRESHOLD_MS);
    }

    // skipLoader: true tells our axios interceptor to NOT trigger GlobalLoader
    await API.get(PING_ENDPOINT, {
      timeout: 35_000,
      skipLoader: true,
    });
  } catch {
    // Silently ignore — server may just be slow, not down
  } finally {
    if (slowTimer) {
      window.clearTimeout(slowTimer);
    }
    const elapsed = Date.now() - start;
    if (elapsed > 1000) {
      console.info(`[keepAlive] Backend woke up in ${elapsed}ms`);
    }
  }
};
