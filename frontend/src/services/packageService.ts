import axios from 'axios';

const API_URL = '/api/v1/packages';

// -- Types & Interfaces --

export interface Package {
  id: string;
  title: string;
  destination: string;
  description: string;
  price: string | number;
  quota: number;
  start_date: string;
  end_date: string;
  is_active: boolean | number;
  created_at: string;
  updated_at: string;
}

export interface PackageInput {
  title: string;
  destination: string;
  description: string;
  price: number;
  quota: number;
  start_date: string;
  end_date: string;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// -- API Functions --

// Get all packages (Public) - supports optional destination filter
export const getPackages = async (destination?: string) => {
  let url = API_URL;
  if (destination) {
    url += `?destination=${encodeURIComponent(destination)}`;
  }
  const response = await axios.get(url);
  return response.data.data;
};

// Get single package detail (Public)
export const getPackageById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data.data;
};

// Create new package (Admin only)
export const createPackage = async (data: PackageInput) => {
  const response = await axios.post(API_URL, data, getAuthHeaders());
  return response.data.data;
};

// Update existing package (Admin only)
export const updatePackage = async (id: string, data: Partial<PackageInput>) => {
  const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
  return response.data.data;
};

// Delete/Deactivate package (Admin only)
export const deletePackage = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data.data;
};
