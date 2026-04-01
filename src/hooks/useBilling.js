import { useState, useEffect } from 'react';
import { billingApi } from '@api/billing';

/**
 * Custom hook for managing billing data
 */
export const useBilling = () => {
  const [billingData, setBillingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBilling = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await billingApi.getAll();
      setBillingData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch billing data');
      console.error('Error fetching billing:', err);
    } finally {
      setLoading(false);
    }
  };

  const createBilling = async (billingInfo) => {
    try {
      const newBilling = await billingApi.create(billingInfo);
      setBillingData((prev) => [...prev, newBilling]);
      return { success: true, data: newBilling };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to create billing' };
    }
  };

  const updateBilling = async (id, billingInfo) => {
    try {
      const updatedBilling = await billingApi.update(id, billingInfo);
      setBillingData((prev) =>
        prev.map((billing) => (billing.id === id ? updatedBilling : billing))
      );
      return { success: true, data: updatedBilling };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to update billing' };
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  return {
    billingData,
    loading,
    error,
    refetch: fetchBilling,
    createBilling,
    updateBilling,
  };
};

