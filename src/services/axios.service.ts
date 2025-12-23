import { useAuth } from '@/hooks/useAuth'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ORIGIN

const authNotRequiredURLs: string[] = ['/admin/login']

const getExcludedURLs = (config: AxiosRequestConfig): boolean => {
  return (
    config.url !== undefined &&
    authNotRequiredURLs.some((endpoint) => config.url?.endsWith(endpoint))
  )
}


const axiosExtended: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
})


axiosExtended.interceptors.request.use(
  async (config: any) => {
    // Add custom API key header
    config.headers['X-API-key'] = 'sheyyoudeywhinemeniiiiiiiiii'

    if (getExcludedURLs(config)) return config

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
