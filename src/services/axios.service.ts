import { useAuth } from '@/hooks/useAuth'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

const prod = 'https://api.heilen.io'
const dev = 'https://dev.heilen.io'
const API_BASE_URL = dev;

// Public endpoints that don't require authentication
const authNotRequiredURLs: string[] = ['/admin/login']

// Check if request should skip auth
const getExcludedURLs = (config: AxiosRequestConfig): boolean => {
  return (
    config.url !== undefined &&
    authNotRequiredURLs.some((endpoint) => config.url?.endsWith(endpoint))
  )
}

// Create axios instance
const axiosExtended: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
})

// Add request interceptor
axiosExtended.interceptors.request.use(
  async (config: any) => {
    // Add custom API key header
    config.headers['X-API-key'] = 'sheyyoudeywhinemeniiiiiiiiii'

    // Skip auth if it's a public endpoint
    if (getExcludedURLs(config)) return config

    // ✅ Pull token directly from Zustand store
    const token = useAuth.getState().token

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    console.log(
      `[API:REQUEST] ${config.method?.toUpperCase()} ${config.baseURL || ''}${config.url}`,
      config.params ? `\nParams: ${JSON.stringify(config.params)}` : '',
      config.data ? `\nBody: ${JSON.stringify(config.data)}` : ''
    )

    return config
  },
  (error: any) => Promise.reject(error)
)

export default axiosExtended
