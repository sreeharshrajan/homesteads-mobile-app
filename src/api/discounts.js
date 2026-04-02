import apiClient from './client';

/**
 * Discounts API
 *
 * Provides methods for coupon validation and discount calculation.
 * All methods return the data directly (response interceptor extracts data.data).
 */
export const discountsApi = {
  /**
   * Validate a coupon code
   * @param {Object} data - Validation data
   * @param {string} data.code - Coupon code to validate (required)
   * @param {string} data.customerId - Customer ID (for registered users)
   * @param {string} data.sessionId - Session ID (for guest users)
   * @param {number} data.subtotal - Cart subtotal amount to calculate discount (required)
   * @returns {Promise<Object>} Coupon details and discount calculation
   */
  validateCoupon: async (data) => {
    const response = await apiClient.post('/store/coupons/validate', data);
    return response;
  },

  /**
   * Discount types
   */
  TYPES: {
    PERCENTAGE: 'PERCENTAGE',
    FIXED: 'FIXED',
  },

  /**
   * Calculate discount amount
   * @param {Object} coupon - Coupon data
   * @param {number} subtotal - Subtotal amount
   * @returns {number} Discount amount
   */
  calculateDiscount: (coupon, subtotal) => {
    if (!coupon || !coupon.value) return 0;

    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else if (coupon.type === 'FIXED') {
      discount = coupon.value;
    }

    return Math.min(discount, subtotal);
  },
};
