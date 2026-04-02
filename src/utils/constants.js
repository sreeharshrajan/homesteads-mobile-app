// App constants
export const APP_NAME = 'Homesteads Viands';

// API Base URL
export const API_BASE_URL = 'https://admin.homesteadsviands.com/api';

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'user',
};

// Navigation routes
export const ROUTES = {
  LOGIN: 'Login',
  DASHBOARD: 'Dashboard',
  CUSTOMER_LIST: 'CustomerList',
  CUSTOMER_FORM: 'CustomerForm',
  BILLING: 'Billing',
  INVOICE: 'Invoice',
  INVOICE_CUSTOMER_SELECT: 'InvoiceCustomerSelect',
  INVOICE_PRODUCT_SELECT: 'InvoiceProductSelect',
  INVOICE_DISCOUNT: 'InvoiceDiscount',
  INVOICE_REVIEW: 'InvoiceReview',
  ORDERS: 'Orders',
  ORDER_DETAIL: 'OrderDetail',
  API_KEYS: 'ApiKeys',
  API_KEY_FORM: 'ApiKeyForm',
  SETTINGS: 'Settings',
};

// Invoice statuses
export const INVOICE_STATUS = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
};

// Invoice status labels
export const INVOICE_STATUS_LABELS = {
  [INVOICE_STATUS.DRAFT]: 'Draft',
  [INVOICE_STATUS.SENT]: 'Sent',
  [INVOICE_STATUS.PAID]: 'Paid',
  [INVOICE_STATUS.CANCELLED]: 'Cancelled',
};

// Invoice status colors
export const INVOICE_STATUS_COLORS = {
  [INVOICE_STATUS.DRAFT]: '#808080', // Gray
  [INVOICE_STATUS.SENT]: '#2196F3', // Blue
  [INVOICE_STATUS.PAID]: '#4CAF50', // Green
  [INVOICE_STATUS.CANCELLED]: '#F44336', // Red
};

// Payment methods
export const PAYMENT_METHOD = {
  BANK_TRANSFER: 'BANK_TRANSFER',
  UPI: 'UPI',
  CASH: 'CASH',
  CHEQUE: 'CHEQUE',
  CARD: 'CARD',
  OTHER: 'OTHER',
};

// Payment method labels
export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHOD.BANK_TRANSFER]: 'Bank Transfer',
  [PAYMENT_METHOD.UPI]: 'UPI',
  [PAYMENT_METHOD.CASH]: 'Cash',
  [PAYMENT_METHOD.CHEQUE]: 'Cheque',
  [PAYMENT_METHOD.CARD]: 'Card',
  [PAYMENT_METHOD.OTHER]: 'Other',
};

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
};

// Address types
export const ADDRESS_TYPE = {
  BILLING: 'BILLING',
  SHIPPING: 'SHIPPING',
  BOTH: 'BOTH',
};

// Order statuses
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  PACKED: 'PACKED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

// Order status labels
export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.CONFIRMED]: 'Confirmed',
  [ORDER_STATUS.PROCESSING]: 'Processing',
  [ORDER_STATUS.PACKED]: 'Packed',
  [ORDER_STATUS.SHIPPED]: 'Shipped',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.COMPLETED]: 'Completed',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Date formats
export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm';
export const API_DATE_FORMAT = 'YYYY-MM-DD';

// Indian states (for GST)
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];
