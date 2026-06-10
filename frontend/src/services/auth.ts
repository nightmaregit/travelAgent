import axios from 'axios';

const API_URL = '/api/v1/auth';

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
    token: string;
  } | null;
}

export const registerUser = async (data: any) => {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data;
};

export const loginUser = async (data: any): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/login`, data);
  return response.data;
};
