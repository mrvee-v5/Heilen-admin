// src/services/services.service.ts
import axiosExtended from './axios.service';
import { ServiceDetail, ServicesApiResponse } from './types';

const API_URL = '/admin/services';

// Fetch services
export const getServices = async (
  pageIndex: number,
  pageSize: number
): Promise<ServicesApiResponse> => {
  try {
    const params = { pageIndex, pageSize };
    const response = await axiosExtended.get(API_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};




const API_URL_SERVICE_DETAIL = "/user/service";

// Fetch service details by ID
export const getServiceDetail = async (serviceId: string): Promise<ServiceDetail> => {
  try {
    const response = await axiosExtended.get(`${API_URL_SERVICE_DETAIL}/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching service detail:", error);
    throw error;
  }
};




const API_URL_PUBLISHING_RESPONSE = '/admin/publishing-response';

/**
 * Updates the publish status of a service (retreat) by ID.
 * @param serviceId The ID of the service to update.
 * @param publish The desired publish status (true for published, false for unpublished).
 * @param remark A detailed remark for the update.
 * @returns A promise that resolves to the response data from the API.
 */
export const updatePublishStatus = async (serviceId: string, publish: boolean, remark?: string): Promise<any> => {
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
    );
    return response.data;
  } catch (error) {
    console.error("Error updating publish status:", error);
    throw error;
  }
};


