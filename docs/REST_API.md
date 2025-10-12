# REST API Documentation for External Integration

This document provides comprehensive documentation for the REST API endpoints that allow external applications to integrate with the admin panel for invoice and customer management.

## Base URL

```
https://admin.homesteadsviands.com/api
```

## Authentication

All REST API endpoints require authentication using an API key. API keys can be generated and managed through the admin panel.

### API Key Format

API keys follow this format: `hv_<64-character-hex-string>`

### Authentication Header

Include your API key in the `Authorization` header of each request:

```
Authorization: Bearer hv_your_api_key_here
```

### Managing API Keys

API keys can be managed through the admin panel:

1. Navigate to Settings → API Keys
2. Click "Create New API Key"
3. Provide a name and set permissions
4. Save the generated key securely (it will only be shown once)

## Permissions

API keys require specific permissions to access different endpoints:

- `invoices:read` - List and view invoices
- `invoices:create` - Create new invoices
- `invoices:update` - Update existing invoices
- `invoices:delete` - Delete invoices
- `customers:read` - List and view customers
- `customers:create` - Create new customers
- `customers:update` - Update existing customers
- `customers:delete` - Delete customers
- `admin` or `*` - Full access to all endpoints

---

## Invoice Endpoints

### 1. List Invoices

**GET** `/api/invoices`

Retrieve a paginated list of invoices with optional filtering.

**Required Permission:** `invoices:read`

**Query Parameters:**

| Parameter       | Type   | Description                                                        | Default   |
| --------------- | ------ | ------------------------------------------------------------------ | --------- |
| `page`          | number | Page number                                                        | 1         |
| `limit`         | number | Items per page (max 100)                                           | 20        |
| `search`        | string | Search in invoice number, status note, customer name, order number | -         |
| `customerId`    | string | Filter by customer ID                                              | -         |
| `status`        | string | Filter by status: DRAFT, SENT, PAID, CANCELLED                     | -         |
| `dateFrom`      | string | Filter invoices from date (ISO 8601)                               | -         |
| `dateTo`        | string | Filter invoices to date (ISO 8601)                                 | -         |
| `sortField`     | string | Field to sort by                                                   | createdAt |
| `sortDirection` | string | Sort direction: asc, desc                                          | desc      |

**Example Request:**

```bash
curl -X GET "https://admin.homesteadsviands.com/api/invoices?page=1&limit=20&status=PAID" \
  -H "Authorization: Bearer hv_your_api_key_here"
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "cm...",
        "invoiceNo": "INV-2025-000001",
        "status": "PAID",
        "issueDate": "2025-01-15T00:00:00.000Z",
        "dueDate": "2025-02-15T00:00:00.000Z",
        "totalAmount": 10500.00,
        "customer": {
          "id": "cm...",
          "name": "Acme Corporation",
          "email": "billing@acme.com",
          "phone": "+1234567890",
          "companyName": "Acme Corp",
          "gstNumber": "29ABCDE1234F1Z5"
        },
        "order": {
          "id": "cm...",
          "orderNumber": "ORD-2025-000123",
          "status": "COMPLETED"
        },
        "payments": [
          {
            "id": "cm...",
            "amount": 10500.00,
            "method": "BANK_TRANSFER",
            "status": "SUCCESS",
            "paidAt": "2025-01-16T10:30:00.000Z"
          }
        ],
        "createdAt": "2025-01-15T09:00:00.000Z",
        "updatedAt": "2025-01-16T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

---

### 2. Get Invoice by ID

**GET** `/api/invoices/{id}`

Retrieve detailed information about a specific invoice.

**Required Permission:** `invoices:read`

**Example Request:**

```bash
curl -X GET "https://admin.homesteadsviands.com/api/invoices/cm..." \
  -H "Authorization: Bearer hv_your_api_key_here"
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "cm...",
    "invoiceNo": "INV-2025-000001",
    "status": "PAID",
    "issueDate": "2025-01-15T00:00:00.000Z",
    "dueDate": "2025-02-15T00:00:00.000Z",
    "totalAmount": 10500.00,
    "placeOfSupply": "Maharashtra",
    "statusNote": null,
    "remarks": "Thank you for your business",
    "poNumber": "PO-2025-001",
    "poDate": "2025-01-10T00:00:00.000Z",
    "customer": {
      "id": "cm...",
      "name": "Acme Corporation",
      "email": "billing@acme.com",
      "phone": "+1234567890",
      "companyName": "Acme Corp",
      "gstNumber": "29ABCDE1234F1Z5"
    },
    "order": {
      "id": "cm...",
      "orderNumber": "ORD-2025-000123",
      "status": "COMPLETED",
      "subtotal": 10000.00,
      "taxAmount": 1800.00,
      "discountAmt": 1300.00,
      "shippingAmt": 0.00,
      "orderItems": [
        {
          "id": "cm...",
          "quantity": 10,
          "unitPrice": 100.00,
          "taxAmount": 180.00,
          "netAmount": 1180.00,
          "discountAmt": 0.00,
          "variant": {
            "id": "cm...",
            "name": "250g Pack",
            "sku": "PROD-001-250G",
            "product": {
              "id": "cm...",
              "name": "Premium Spice Mix",
              "sku": "PROD-001",
              "hsnCode": "09109990"
            }
          }
        }
      ]
    },
    "payments": [
      {
        "id": "cm...",
        "amount": 10500.00,
        "method": "BANK_TRANSFER",
        "status": "SUCCESS",
        "paidAt": "2025-01-16T10:30:00.000Z",
        "transactionId": "TXN123456789"
      }
    ],
    "createdAt": "2025-01-15T09:00:00.000Z",
    "updatedAt": "2025-01-16T10:30:00.000Z"
  }
}
```

---

### 3. Create Invoice

**POST** `/api/invoices`

Create a new invoice.

**Required Permission:** `invoices:create`

**Request Body:**

```json
{
  "customerId": "cm...",
  "orderId": "cm...",
  "invoiceNo": "INV-2025-000002",
  "status": "DRAFT",
  "statusNote": "Pending approval",
  "issueDate": "2025-01-20T00:00:00.000Z",
  "dueDate": "2025-02-20T00:00:00.000Z",
  "totalAmount": 5000.00,
  "placeOfSupply": "Karnataka",
  "remarks": "Please pay within 30 days",
  "poNumber": "PO-2025-002",
  "poDate": "2025-01-18T00:00:00.000Z"
}
```

**Field Descriptions:**

| Field           | Type   | Required | Description                                     |
| --------------- | ------ | -------- | ----------------------------------------------- |
| `customerId`    | string | Yes      | Customer ID                                     |
| `orderId`       | string | No       | Order ID (if invoice is linked to an order)     |
| `invoiceNo`     | string | No       | Invoice number (auto-generated if not provided) |
| `status`        | string | No       | Invoice status (default: DRAFT)                 |
| `statusNote`    | string | No       | Optional status note                            |
| `issueDate`     | string | No       | Issue date (default: current date)              |
| `dueDate`       | string | No       | Due date                                        |
| `totalAmount`   | number | Yes      | Total invoice amount                            |
| `placeOfSupply` | string | No       | Place of supply for GST                         |
| `remarks`       | string | No       | Additional remarks                              |
| `poNumber`      | string | No       | Purchase order number                           |
| `poDate`        | string | No       | Purchase order date                             |

**Example Request:**

```bash
curl -X POST "https://admin.homesteadsviands.com/api/invoices" \
  -H "Authorization: Bearer hv_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cm...",
    "totalAmount": 5000.00,
    "status": "DRAFT"
  }'
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "cm...",
    "invoiceNo": "INV-2025-000002",
    "status": "DRAFT",
    "issueDate": "2025-01-20T00:00:00.000Z",
    "dueDate": "2025-02-20T00:00:00.000Z",
    "totalAmount": 5000.00,
    "customer": {
      "id": "cm...",
      "name": "XYZ Industries",
      "email": "accounts@xyz.com",
      "phone": "+9876543210",
      "companyName": "XYZ Industries Ltd",
      "gstNumber": "27XYZAB5678K1Z2"
    },
    "order": null,
    "createdAt": "2025-01-20T11:00:00.000Z",
    "updatedAt": "2025-01-20T11:00:00.000Z"
  }
}
```

---

### 4. Update Invoice

**PUT** `/api/invoices/{id}`

Update an existing invoice. Only DRAFT invoices can be fully updated. For other statuses, only `status` and `statusNote` can be updated.

**Required Permission:** `invoices:update`

**Request Body:**

```json
{
  "status": "SENT",
  "statusNote": "Invoice sent to customer",
  "dueDate": "2025-03-01T00:00:00.000Z",
  "totalAmount": 5500.00
}
```

**Example Request:**

```bash
curl -X PUT "https://admin.homesteadsviands.com/api/invoices/cm..." \
  -H "Authorization: Bearer hv_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "SENT",
    "statusNote": "Invoice sent to customer"
  }'
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "cm...",
    "invoiceNo": "INV-2025-000002",
    "status": "SENT",
    "statusNote": "Invoice sent to customer",
    "issueDate": "2025-01-20T00:00:00.000Z",
    "dueDate": "2025-03-01T00:00:00.000Z",
    "totalAmount": 5500.00,
    "customer": {
      "id": "cm...",
      "name": "XYZ Industries",
      "email": "accounts@xyz.com"
    },
    "updatedAt": "2025-01-21T14:30:00.000Z"
  }
}
```

---

### 5. Delete Invoice

**DELETE** `/api/invoices/{id}`

Delete an invoice (soft delete). Only DRAFT invoices can be deleted.

**Required Permission:** `invoices:delete`

**Example Request:**

```bash
curl -X DELETE "https://admin.homesteadsviands.com/api/invoices/cm..." \
  -H "Authorization: Bearer hv_your_api_key_here"
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Invoice deleted successfully"
}
```

---

## Customer Endpoints

### 1. List Customers

**GET** `/api/customers`

Retrieve a paginated list of customers with optional filtering.

**Required Permission:** `customers:read`

**Query Parameters:**

| Parameter       | Type    | Description                                            | Default   |
| --------------- | ------- | ------------------------------------------------------ | --------- |
| `page`          | number  | Page number                                            | 1         |
| `limit`         | number  | Items per page (max 100)                               | 20        |
| `search`        | string  | Search in name, email, phone, company name, GST number | -         |
| `isActive`      | boolean | Filter by active status                                | -         |
| `sortField`     | string  | Field to sort by                                       | createdAt |
| `sortDirection` | string  | Sort direction: asc, desc                              | desc      |

**Example Request:**

```bash
curl -X GET "https://admin.homesteadsviands.com/api/customers?page=1&limit=20&isActive=true" \
  -H "Authorization: Bearer hv_your_api_key_here"
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": "cm...",
        "name": "Acme Corporation",
        "email": "billing@acme.com",
        "phone": "+1234567890",
        "companyName": "Acme Corp",
        "gstNumber": "29ABCDE1234F1Z5",
        "panNumber": "ABCDE1234F",
        "isActive": true,
        "addresses": [
          {
            "id": "cm...",
            "type": "BILLING",
            "line1": "123 Business Park",
            "line2": "Suite 400",
            "city": "Mumbai",
            "state": "Maharashtra",
            "postalCode": "400001",
            "country": "India",
            "isDefault": true
          }
        ],
        "contacts": [
          {
            "id": "cm...",
            "name": "John Doe",
            "email": "john@acme.com",
            "phone": "+1234567891",
            "designation": "Accounts Manager",
            "isPrimary": true
          }
        ],
        "_count": {
          "orders": 25,
          "invoices": 30
        },
        "createdAt": "2024-06-15T10:00:00.000Z",
        "updatedAt": "2025-01-10T15:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 245,
      "totalPages": 13
    }
  }
}
```

---

### 2. Get Customer by ID

**GET** `/api/customers/{id}`

Retrieve detailed information about a specific customer, including recent orders and invoices.

**Required Permission:** `customers:read`

**Example Request:**

```bash
curl -X GET "https://admin.homesteadsviands.com/api/customers/cm..." \
  -H "Authorization: Bearer hv_your_api_key_here"
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "cm...",
    "name": "Acme Corporation",
    "email": "billing@acme.com",
    "phone": "+1234567890",
    "companyName": "Acme Corp",
    "gstNumber": "29ABCDE1234F1Z5",
    "panNumber": "ABCDE1234F",
    "isActive": true,
    "addresses": [...],
    "contacts": [...],
    "orders": [
      {
        "id": "cm...",
        "orderNumber": "ORD-2025-000123",
        "status": "COMPLETED",
        "totalAmount": 10500.00,
        "createdAt": "2025-01-15T09:00:00.000Z"
      }
    ],
    "invoices": [
      {
        "id": "cm...",
        "invoiceNo": "INV-2025-000001",
        "status": "PAID",
        "totalAmount": 10500.00,
        "createdAt": "2025-01-15T09:00:00.000Z"
      }
    ],
    "createdAt": "2024-06-15T10:00:00.000Z",
    "updatedAt": "2025-01-10T15:30:00.000Z"
  }
}
```

---

### 3. Create Customer

**POST** `/api/customers`

Create a new customer with optional addresses and contacts.

**Required Permission:** `customers:create`

**Request Body:**

```json
{
  "name": "New Customer Inc",
  "email": "contact@newcustomer.com",
  "phone": "+9876543210",
  "companyName": "New Customer Incorporated",
  "gstNumber": "27NEWCU1234P1Z5",
  "panNumber": "NEWCU1234P",
  "isActive": true,
  "addresses": [
    {
      "type": "BOTH",
      "line1": "456 Commerce Street",
      "line2": "Floor 3",
      "city": "Bangalore",
      "state": "Karnataka",
      "postalCode": "560001",
      "country": "India",
      "isDefault": true
    }
  ],
  "contacts": [
    {
      "name": "Jane Smith",
      "email": "jane@newcustomer.com",
      "phone": "+9876543211",
      "designation": "Purchase Manager",
      "isPrimary": true
    }
  ]
}
```

**Field Descriptions:**

| Field         | Type    | Required | Description                   |
| ------------- | ------- | -------- | ----------------------------- |
| `name`        | string  | Yes      | Customer name                 |
| `email`       | string  | No       | Email address                 |
| `phone`       | string  | Yes      | Phone number                  |
| `companyName` | string  | No       | Company name                  |
| `gstNumber`   | string  | No       | GST number                    |
| `panNumber`   | string  | No       | PAN number                    |
| `isActive`    | boolean | No       | Active status (default: true) |
| `addresses`   | array   | No       | Array of address objects      |
| `contacts`    | array   | No       | Array of contact objects      |

**Example Request:**

```bash
curl -X POST "https://admin.homesteadsviands.com/api/customers" \
  -H "Authorization: Bearer hv_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Customer Inc",
    "email": "contact@newcustomer.com",
    "phone": "+9876543210",
    "isActive": true
  }'
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "cm...",
    "name": "New Customer Inc",
    "email": "contact@newcustomer.com",
    "phone": "+9876543210",
    "companyName": null,
    "gstNumber": null,
    "panNumber": null,
    "isActive": true,
    "addresses": [],
    "contacts": [],
    "createdAt": "2025-01-22T10:00:00.000Z",
    "updatedAt": "2025-01-22T10:00:00.000Z"
  }
}
```

---

### 4. Update Customer

**PUT** `/api/customers/{id}`

Update an existing customer's information.

**Required Permission:** `customers:update`

**Request Body:**

```json
{
  "name": "Updated Customer Name",
  "email": "newemail@customer.com",
  "isActive": true
}
```

**Example Request:**

```bash
curl -X PUT "https://admin.homesteadsviands.com/api/customers/cm..." \
  -H "Authorization: Bearer hv_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newemail@customer.com"
  }'
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "cm...",
    "name": "New Customer Inc",
    "email": "newemail@customer.com",
    "phone": "+9876543210",
    "isActive": true,
    "addresses": [...],
    "contacts": [...],
    "updatedAt": "2025-01-22T14:30:00.000Z"
  }
}
```

---

### 5. Delete Customer

**DELETE** `/api/customers/{id}`

Delete a customer (soft delete). Cannot delete customers with active orders or invoices.

**Required Permission:** `customers:delete`

**Example Request:**

```bash
curl -X DELETE "https://admin.homesteadsviands.com/api/customers/cm..." \
  -H "Authorization: Bearer hv_your_api_key_here"
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

---

## Error Responses

All endpoints return consistent error responses:

### Error Response Format

```json
{
  "error": "Error message describing what went wrong"
}
```

Or with validation errors:

```json
{
  "error": "Validation error",
  "details": [
    {
      "path": ["fieldName"],
      "message": "Error message"
    }
  ]
}
```

### HTTP Status Codes

| Status Code | Description                               |
| ----------- | ----------------------------------------- |
| 200         | Success                                   |
| 201         | Created                                   |
| 400         | Bad Request (validation errors)           |
| 401         | Unauthorized (invalid or missing API key) |
| 403         | Forbidden (insufficient permissions)      |
| 404         | Not Found                                 |
| 409         | Conflict (duplicate resource)             |
| 500         | Internal Server Error                     |

---

## API Key Management Endpoints

These endpoints are for admin users to manage their API keys through the admin panel. They require session-based authentication (not API key authentication).

### List API Keys

**GET** `/api/admin/api-keys`

List all API keys for the authenticated admin user.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "cm...",
      "name": "Production API Key",
      "permissions": ["invoices:read", "invoices:create", "customers:read"],
      "isActive": true,
      "expiresAt": "2026-01-01T00:00:00.000Z",
      "lastUsedAt": "2025-01-22T10:30:00.000Z",
      "createdAt": "2025-01-01T09:00:00.000Z",
      "updatedAt": "2025-01-22T10:30:00.000Z"
    }
  ]
}
```

### Create API Key

**POST** `/api/admin/api-keys`

Create a new API key.

**Request Body:**

```json
{
  "name": "Production API Key",
  "permissions": ["invoices:read", "invoices:create"],
  "expiresAt": "2026-01-01T00:00:00.000Z"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "cm...",
    "name": "Production API Key",
    "key": "hv_1234567890abcdef...",
    "permissions": ["invoices:read", "invoices:create"],
    "isActive": true,
    "expiresAt": "2026-01-01T00:00:00.000Z",
    "createdAt": "2025-01-22T11:00:00.000Z"
  },
  "message": "API key created successfully. Save this key securely - it won't be shown again."
}
```

### Update API Key

**PUT** `/api/admin/api-keys/{id}`

Update an API key's permissions or status.

### Delete API Key

**DELETE** `/api/admin/api-keys/{id}`

Delete an API key.

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **General endpoints**: 100 requests per minute per API key
- **Creation endpoints**: 20 requests per minute per API key

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705924800
```

---

## Best Practices

1. **Secure API Keys**: Store API keys securely using environment variables or secret management systems
2. **Use HTTPS**: Always use HTTPS for API requests
3. **Handle Errors**: Implement proper error handling for all status codes
4. **Pagination**: Use pagination for list endpoints to avoid large responses
5. **Idempotency**: Invoice creation includes duplicate checking based on orderId
6. **Webhooks**: Consider implementing webhooks for real-time updates (coming soon)

---

## Mobile App Integration

This REST API is integrated into the Homesteads Viands mobile app. The mobile app uses the following API client modules:

### API Client Configuration

The API client is configured in `src/config/index.js` with the base URL `https://admin.homesteadsviands.com/api`.

### API Modules

- **`src/api/client.js`** - Base axios client with request/response interceptors
- **`src/api/invoices.js`** - Invoice management endpoints
- **`src/api/customers.js`** - Customer management endpoints
- **`src/api/auth.js`** - Authentication endpoints

### Usage Example

```javascript
import { invoicesApi } from './src/api/invoices';
import { customersApi } from './src/api/customers';

// List invoices with pagination
const invoices = await invoicesApi.getAll({
  page: 1,
  limit: 20,
  status: 'PAID'
});

// Create a customer
const customer = await customersApi.create({
  name: 'New Customer',
  phone: '+1234567890',
  email: 'customer@example.com'
});
```

---

## Support

For API support and questions:
- Email: sreeharshkrajan@gmail.com
- Admin Panel: https://admin.homesteadsviands.com
- Documentation: https://docs.homesteadsviands.com/rest-api

## Changelog

### Version 1.0.0 (2025-01-12)
- Initial REST API release
- Invoice management endpoints (CRUD)
- Customer management endpoints (CRUD)
- API key authentication system
- Permission-based access control
- Mobile app integration

---

© 2024 Homesteads Viands. All rights reserved.

