const isProd = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

export const logger = {
  error: (...args: unknown[]) => {
    if (!isProd && !isTest) console.error(...args);
  },
  log: (...args: unknown[]) => {
    if (!isProd && !isTest) console.log(...args);
  },
};
