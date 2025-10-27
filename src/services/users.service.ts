import axios from 'axios';
import axiosExtended from './axios.service';
import { RegisterUserPayload, UserDetail, UsersApiResponse } from './types';

const API_URL = '/admin/users';

// ==========================
// AUTH & ADMIN LOGIN
// ==========================
export async function adminLogin(data: { email: string; password: string; deviceToken: string }) {
  try {
    const res = await axiosExtended.post(`/admin/login`, data);
    const { token } = res.data;
    axios.defaults.headers.common['authorization'] = `Bearer ${token}`;
    return res.data;
  } catch (error: any) {
    console.error("Admin login failed:", error.response?.data || error.message);
    throw error;
  }
}

// ==========================
// USERS CRUD
// ==========================
export const getUsers = async (pageIndex: number, pageSize: number, email?: string): Promise<UsersApiResponse> => {
  try {
    const params: { pageIndex: number; pageSize: number; email?: string } = { pageIndex, pageSize };
    if (email) params.email = email;

    const response = await axiosExtended.get(API_URL, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export async function registerUser(data: RegisterUserPayload) {
  try {
    const res = await axiosExtended.post(`/admin/users`, data);
    return res.data;
  } catch (error: any) {
    console.error("Register user failed:", error.response?.data || error.message);
    throw error;
  }
}

// ==========================
// USER EMAIL VERIFICATION
// ==========================
export async function sendVerificationCode(data: { email: string; mode: "register" | "forgot_password" }) {
  try {
    const res = await axiosExtended.post(`/user/send-verification-code`, data);
    return res.data;
  } catch (error: any) {
    console.error("Failed to send verification code:", error.response?.data || error.message);
    throw error;
  }
}

export async function getUsersOtp(email: string) {
  try {
    const res = await axiosExtended.get(`/admin/users-otp/${email}`);
    return res.data;
  } catch (error: any) {
    console.error("Failed to get OTP:", error.response?.data || error.message);
    throw error;
  }
}

export async function verifyToken(data: { email: string; token: string }) {
  try {
    const res = await axiosExtended.post(`/user/verify-token`, data);
    return res.data;
  } catch (error: any) {
    console.error("Failed to verify token:", error.response?.data || error.message);
    throw error;
  }
}

// ==========================
// USER DETAILS & SUBSCRIPTION
// ==========================
export async function getUserById(id: string): Promise<UserDetail> {
  try {
    const response = await axiosExtended.get(`/admin/experts/${id}`);
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
      params: { subscriptionStatus, subscriptionType },
    });
  } catch (error) {
    console.error("Failed to update subscription", error);
    throw error;
  }
};

// ==========================
// ✅ NEW ENDPOINTS
// ==========================

// 🔹 Change a user's password
export const updateUserPassword = async (id: string, newPassword: string): Promise<void> => {
  try {
    await axiosExtended.put(`/admin/users/${id}/password`, { newPassword });
  } catch (error: any) {
    console.error("Failed to update user password:", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 Delete a user
export const deleteUser = async (id: string): Promise<void> => {
  try {
    await axiosExtended.delete(`/admin/users/${id}/delete`);
  } catch (error: any) {
    console.error("Failed to delete user:", error.response?.data || error.message);
    throw error;
  }
};
