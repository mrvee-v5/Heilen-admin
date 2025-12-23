export const BACKEDN_API_BASE_URL =
  process.env.NEXT_PUBLIC_ENVIROMENT === 'production'
    ? 'https://api.heilen.io'
    : 'https://dev.heilen.io';