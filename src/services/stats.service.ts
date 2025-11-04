// src/services/stats.service.ts (or add to users.service.ts if you prefer)
import axiosExtended from './axios.service'

export interface AppKPI {
  totalSales: number
  totalBookings: number
  users: number
  totalOrder: number
}

export async function getAppKPI(): Promise<AppKPI> {
  try {
    const res = await axiosExtended.get('/admin/stats')
    return res.data
  } catch (error: any) {
    console.error(
      'Failed to fetch app KPI:',
      error.response?.data || error.message
    )
    throw error
  }
}
