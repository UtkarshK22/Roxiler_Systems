import axiosInstance from './axiosInstance';
import { AuthResponse, User } from '../types';

export const authAPI = {
  login: (email: string, password: string) =>
    axiosInstance.post<AuthResponse>('/auth/login', { email, password }),

  signup: (data: {
    name: string;
    email: string;
    password: string;
    address?: string;
  }) => axiosInstance.post<{ message: string }>('/auth/signup', data),

  changePassword: (data: {
    current_password: string;
    new_password: string;
  }) =>
    axiosInstance.post<{ message: string }>('/auth/password', data),

  getProfile: () => axiosInstance.get<User>('/users/me'),
};