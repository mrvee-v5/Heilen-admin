export const BACKEDN_API_BASE_URL =
  process.env.APP_ENVIROMENT==='production'
    ? 'https://api.heilen.io'
    : 'https://dev.heilen.io';