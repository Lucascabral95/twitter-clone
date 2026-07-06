export const ACCESS_COOKIE = "myToken";
export const REFRESH_COOKIE = "refreshToken";

export const ACCESS_EXPIRY = "15m";
export const ACCESS_MAX_AGE = 60 * 15;
export const REFRESH_MAX_AGE = 60 * 60 * 24 * 30;

export const getSecretKey = () => new TextEncoder().encode(process.env.JWT_SECRET as string);
