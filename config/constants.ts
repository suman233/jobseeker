// Application constants
export const accessTokenName =
  process.env.NEXT_PUBLIC_TOKEN_NAME || "accessToken";
export const refreshTokenName = "refreshToken";

export const APP_CONFIG = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  appName:
    process.env.NEXT_PUBLIC_APP_NAME || "WorkSphere — Tech Career Infrastructure",
  accessTokenName,
  refreshTokenName,
};

export default APP_CONFIG;
