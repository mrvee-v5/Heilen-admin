export const BACKEDN_API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.heilen.io'
    : 'https://dev.heilen.io';