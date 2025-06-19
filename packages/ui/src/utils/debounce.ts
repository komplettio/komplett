// Debounce utility for performance optimization
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay = 300,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Throttle utility for high-frequency events
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay = 100,
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

// Async debounce for database operations
export function debounceAsync<T extends (...args: Parameters<T>) => Promise<unknown>>(
  func: T,
  delay = 300,
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: NodeJS.Timeout;
  let resolvePromise: (value: ReturnType<T>) => void;
  let rejectPromise: (reason: unknown) => void;

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve, reject) => {
      clearTimeout(timeoutId);
      resolvePromise = resolve;
      rejectPromise = reject;

      timeoutId = setTimeout(() => {
        func(...args)
          .then(result => {
            resolvePromise(result as ReturnType<T>);
          })
          .catch((error: unknown) => {
            rejectPromise(error);
          });
      }, delay);
    });
  };
}
