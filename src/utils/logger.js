const isDev = typeof import.meta !== 'undefined' ? (import.meta.env?.MODE !== 'production') : true;

export const logger = {
  debug: (...args) => {
    if (isDev) console.debug(...args);
  },
  log: (...args) => {
    if (isDev) console.log(...args);
  },
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args),
};


