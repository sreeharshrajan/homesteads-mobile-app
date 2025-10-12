import apiClient from './client';

export const invoicesApi = {
  getAll: async () => {
    const response = await apiClient.get('/invoices');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/invoices/${id}`);
    return response.data;
  },
  
  getByCustomer: async (customerId) => {
    const response = await apiClient.get(`/invoices/customer/${customerId}`);
    return response.data;
  },
  
  create: async (invoiceData) => {
    const response = await apiClient.post('/invoices', invoiceData);
    return response.data;
  },
  
  update: async (id, invoiceData) => {
    const response = await apiClient.put(`/invoices/${id}`, invoiceData);
    return response.data;
  },
  
  markAsPaid: async (id) => {
    const response = await apiClient.post(`/invoices/${id}/paid`);
    return response.data;
  },
};

