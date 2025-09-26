// src/services/users.service.ts
import axiosExtended from './axios.service';
import { RegisterUserPayload, UserDetail, UsersApiResponse } from './types';
const API_URL = '/admin/users';



export const getUsers = async (pageIndex: number, pageSize: number, email?: string): Promise<UsersApiResponse> => {
    try {
        const params: { pageIndex: number; pageSize: number; email?: string } = {
            pageIndex: pageIndex,
            pageSize: pageSize,
        };

        if (email) {
            params.email = email;
        }

        const response = await axiosExtended.get(API_URL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};


export async function registerUser(data: RegisterUserPayload) {
  try {
    const res = await axiosExtended.post(`/user/register`, data);
    return res.data;
  } catch (error: any) {
    console.error("Register user failed:", error.response?.data || error.message);
    throw error;
  }
}

// New service function to send a verification code to a user's email.
export async function sendVerificationCode(data: { email: string, mode: "register" | "forgot_password" }) {
  try {
    const res = await axiosExtended.post(`/user/send-verification-code`, data);
    return res.data;
  } catch (error: any) {
    console.error("Failed to send verification code:", error.response?.data || error.message);
    throw error;
  }
}

// New service function to get the OTP for a user from the admin dashboard.
export async function getUsersOtp(email: string) {
  try {
    const res = await axiosExtended.get(`/admin/users-otp/${email}`);
    return res.data;
  } catch (error: any) {
    console.error("Failed to get OTP:", error.response?.data || error.message);
    throw error;
  }
}

// New service function to verify an OTP token.
export async function verifyToken(data: { email: string, token: string }) {
  try {
    const res = await axiosExtended.post(`/user/verify-token`, data);
    return res.data;
  } catch (error: any) {
    console.error("Failed to verify token:", error.response?.data || error.message);
    throw error;
  }
}



export async function getUserById(id: string): Promise<UserDetail> {
  try {
    const response = await axiosExtended.get(`/admin/users/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch user by ID:", error.response?.data || error.message);
    throw error;
  }
}


export const updateUserSubscription = async (
  userId: string,
  subscriptionStatus: boolean,
  subscriptionType: string
): Promise<void> => {
  try {
    await axiosExtended.put(`/admin/update-subscription/${userId}`, null, {
      params: {
        subscriptionStatus,
        subscriptionType,
      },
    });
  } catch (error) {
    console.error("Failed to update subscription", error);
    throw error;
  }
};