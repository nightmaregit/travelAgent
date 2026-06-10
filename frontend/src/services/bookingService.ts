import axios from 'axios';

const API_URL = '/api/v1/bookings';

export interface Booking {
  id: string;
  user_id: string;
  tour_package_id: string;
  booking_code: string;
  booking_date: string;
  total_pax: number;
  total_amount: number | string;
  status: string;
  package_title?: string;
  destination?: string;
  start_date?: string;
  end_date?: string;
  payment_status?: string;
  proof_image?: string;
  payment_id?: string;
}

export interface BookingInput {
  tour_package_id: string;
  total_pax: number;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const createBooking = async (data: BookingInput) => {
  const response = await axios.post(API_URL, data, getAuthHeaders());
  return response.data.data;
};

export const getBookings = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data.data;
};

export const getBookingById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
  return response.data.data;
};

export const updateBookingStatus = async (id: string, status: string) => {
  const response = await axios.put(`${API_URL}/${id}/status`, { status }, getAuthHeaders());
  return response.data.data;
};
