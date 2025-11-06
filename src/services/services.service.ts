


// src/services/services.service.ts
import axiosExtended from './axios.service'
import { ServiceDetail, ServicesApiResponse } from './types'
import { PublishRequestsApiResponse } from './types'

const API_URL_PUBLISH_REQUESTS = '/admin/publish-requests'
const API_URL = '/admin/services'
const API_URL_SERVICE_DETAIL = '/admin/service'
const API_URL_PUBLISHING_RESPONSE = '/admin/publishing-response'

// Fetch services
export const getServices = async (
  pageIndex: number,
  pageSize: number
): Promise<ServicesApiResponse> => {
  try {
    const params = { pageIndex, pageSize }
    const response = await axiosExtended.get(API_URL, { params })
    return response.data
  } catch (error) {
    console.error('Error fetching services:', error)
    throw error
  }
}



// Fetch service details by ID
export const getServiceDetail = async (
  serviceId: string
): Promise<ServiceDetail> => {
  try {
    const response = await axiosExtended.get(
      `${API_URL_SERVICE_DETAIL}/${serviceId}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching service detail:', error)
    throw error
  }
}


const API_URL_PUBLISH_REQUEST = '/admin/publish-requests'

/**
 * Reviews a publish request (approve or reject).
 * @param serviceId - The ID of the service to review.
 * @param approve - true to approve (publish), false to reject.
 * @param remark - Reviewer remarks or justification.
 */
export const reviewPublishRequest = async (
  serviceId: string,
  approve: boolean,
  remark?: string
): Promise<any> => {

  console.log('remark', remark, 'serviceId', serviceId, 'approve', approve)
  try {
    const endpoint = `${API_URL_PUBLISH_REQUEST}/${serviceId}/${approve ? 'approve' : 'reject'}`

    const response = await axiosExtended.put(endpoint, { remark,serviceId })

    return response.data
  } catch (error) {
    console.error('Error updating publish request status:', error)
    throw error
  }
}





/**
 * Fetches a paginated list of publish requests.
 * @param pageIndex The current page index for pagination.
 * @param pageSize The number of items per page.
 * @returns A promise resolving to the list of publish requests.
 */
export const getPublishRequests = async (
  pageIndex: number,
  pageSize: number
): Promise<PublishRequestsApiResponse> => {
  try {
    const params = { pageIndex, pageSize }
    const response = await axiosExtended.get(API_URL_PUBLISH_REQUESTS, { params })
    return response.data
  } catch (error) {
    console.error('Error fetching publish requests:', error)
    throw error
  }
}





/**
 * Updates the publish status of a service (retreat) by ID.
 * @param serviceId The ID of the service to update.
 * @param publish The desired publish status (true for published, false for unpublished).
 * @param remark A detailed remark for the update.
 * @returns A promise that resolves to the response data from the API.
 */
export const updatePublishStatus = async (
  serviceId: string,
  publish: boolean,
  remark?: string
): Promise<any> => {
  try {
    const response = await axiosExtended.put(
      `${API_URL_PUBLISHING_RESPONSE}/${serviceId}`,
      null,
      {
        params: {
          publish,
          remark,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error updating publish status:', error)
    throw error
  }
}
