import axiosExtended from './axios.service'

// ==========================
// TYPES
// ==========================

export interface CreateDiscountCodePayload {
  code: string
  discountPercent: string
  validFrom: string
  validUntil: string
  maxUses: number
  description?: string
  isActive: boolean
}

export interface DiscountCode {
  id: string
  code: string
  discountPercent: string
  validFrom: string
  validUntil: string
  maxUses: number
  usedCount: number
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface DiscountCodesApiResponse {
  data: DiscountCode[]
  total: number
  pageIndex: number
  pageSize: number
}

// ==========================
// DISCOUNT CODES CRUD
// ==========================

// 🔹 Create discount code
export const createDiscountCode = async (
  data: CreateDiscountCodePayload
): Promise<DiscountCode> => {
  try {
    const res = await axiosExtended.post(`/admin/discount-codes`, data)
    return res.data
  } catch (error: any) {
    console.error(
      'Failed to create discount code:',
      error.response?.data || error.message
    )
    throw error
  }
}

// 🔹 Get all discount codes (paginated)
export const getDiscountCodes = async (
  pageIndex: number,
  pageSize: number
): Promise<DiscountCodesApiResponse> => {
  try {
    const params: { pageIndex: string; pageSize: string } = {
      pageIndex: String(pageIndex),
      pageSize: String(pageSize),
    }

    const res = await axiosExtended.get(`/admin/discount-codes`, { params })
    return res.data
  } catch (error: any) {
    console.error(
      'Failed to fetch discount codes:',
      error.response?.data || error.message
    )
    throw error
  }
}

// 🔹 Get discount code by ID
export const getDiscountCodeById = async (
  codeId: string
): Promise<DiscountCode> => {
  try {
    const res = await axiosExtended.get(
      `/admin/discount-codes/${codeId}`
    )
    return res.data
  } catch (error: any) {
    console.error(
      'Failed to fetch discount code:',
      error.response?.data || error.message
    )
    throw error
  }
}

// 🔹 Update discount code
export const updateDiscountCode = async (
  codeId: string,
  data: Partial<CreateDiscountCodePayload>
): Promise<DiscountCode> => {
  try {
    const res = await axiosExtended.put(
      `/admin/discount-codes/${codeId}`,
      data
    )
    return res.data
  } catch (error: any) {
    console.error(
      'Failed to update discount code:',
      error.response?.data || error.message
    )
    throw error
  }
}

// 🔹 Delete discount code
export const deleteDiscountCode = async (
  codeId: string
): Promise<void> => {
  try {
    await axiosExtended.delete(`/admin/discount-codes/${codeId}`)
  } catch (error: any) {
    console.error(
      'Failed to delete discount code:',
      error.response?.data || error.message
    )
    throw error
  }
}

// 🔹 Toggle discount code active status
export const toggleDiscountCodeStatus = async (
  codeId: string,
  isActive: boolean
): Promise<DiscountCode> => {
  try {
    const res = await axiosExtended.put(
      `/admin/discount-codes/${codeId}/toggle`,
      null,
      {
        params: { isActive },
      }
    )
    return res.data
  } catch (error: any) {
    console.error(
      'Failed to toggle discount code status:',
      error.response?.data || error.message
    )
    throw error
  }
}
