import axios from 'axios';

const API_URL = '/api/v1/payments';

export interface PaymentInput {
  booking_id: string;
  payment_method: string;
  amount_paid: number | string;
  proof_image?: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const processPayment = async (data: PaymentInput) => {
  const response = await axios.post(API_URL, data, getAuthHeaders());
  return response.data.data;
};
