import apiClient from './client';

export const billingApi = {
  getAll: async () => {
    const response = await apiClient.get('/billing');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/billing/${id}`);
    return response.data;
  },
  
  getByCustomer: async (customerId) => {
    const response = await apiClient.get(`/billing/customer/${customerId}`);
    return response.data;
  },
  
  create: async (billingData) => {
    const response = await apiClient.post('/billing', billingData);
    return response.data;
  },
  
  update: async (id, billingData) => {
    const response = await apiClient.put(`/billing/${id}`, billingData);
    return response.data;
  },
};

