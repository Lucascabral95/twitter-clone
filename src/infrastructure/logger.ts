const isProd = process.env.NODE_ENV === "production";

export const logger = {
  error: (...args: unknown[]) => {
    if (!isProd) console.error(...args);
  },
  log: (...args: unknown[]) => {
    if (!isProd) console.log(...args);
  },
};
