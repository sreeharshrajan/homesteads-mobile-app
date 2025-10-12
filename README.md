# Homesteads Viands App

A React Native mobile application built with Expo for billing and customer management.

## Features

- **Authentication**: JWT-based authentication with token persistence
- **Customer Management**: Create, view, edit, and manage customer records
- **Billing**: View and manage billing records
- **Invoices**: Create and track invoices with detailed line items
- **Modern UI**: Built with React Native Paper for a professional look

## Tech Stack

- **Framework**: Expo (React Native)
- **Navigation**: React Navigation (Native Stack)
- **HTTP Client**: Axios with request/response interceptors
- **Storage**: AsyncStorage for JWT token persistence
- **UI Library**: React Native Paper
- **Form Handling**: Formik + Yup validation
- **State Management**: Zustand (lightweight global state)

## Project Structure

```
src/
├── api/              # API client and endpoint definitions
│   ├── client.js     # Axios instance with interceptors
│   ├── auth.js       # Authentication endpoints
│   ├── customers.js  # Customer endpoints
│   ├── billing.js    # Billing endpoints
│   └── invoices.js   # Invoice endpoints
├── screens/          # App screens
│   ├── LoginScreen.js
│   ├── CustomerListScreen.js
│   ├── CustomerFormScreen.js
│   ├── BillingScreen.js
│   └── InvoiceScreen.js
├── components/       # Reusable UI components
│   ├── LoadingScreen.js
│   └── EmptyState.js
├── navigation/       # Navigation configuration
│   └── AppNavigator.js
├── store/            # Zustand stores
│   └── authStore.js
├── hooks/            # Custom React hooks
│   ├── useCustomers.js
│   └── useBilling.js
└── utils/            # Utilities and helpers
    ├── constants.js
    └── formatters.js
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (installed globally): `npm install -g expo-cli`
- Expo Go app on your mobile device (for testing)

### Installation

1. Navigate to the project directory:
   ```bash
   cd homesteads-viands-app
   ```

2. Install dependencies (already done):
   ```bash
   npm install
   ```

### Configuration

The app is pre-configured to connect to the production API:

**API Base URL**: `https://admin.homesteadsviands.com/api`

To change the environment, update `src/config/index.js`:
```javascript
api: {
  baseURL: 'https://admin.homesteadsviands.com/api',
  timeout: 15000,
}
```

### Running the App

Start the Expo development server:

```bash
npm start
# or
npx expo start
```

This will open the Expo DevTools in your browser. You can then:
- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator
- Scan the QR code with Expo Go app on your physical device

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator (macOS only)
- `npm run web` - Run in web browser

## Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[Quick Start Guide](docs/QUICK_START.md)** - Get up and running in 5 minutes
- **[Development Guide](docs/DEVELOPMENT.md)** - Detailed development documentation with examples
- **[Project Summary](docs/APP_SUMMARY.md)** - Complete overview of what was built
- **[Development Checklist](docs/CHECKLIST.md)** - Track your development progress
- **[REST API Documentation](docs/REST_API.md)** - Complete REST API reference
- **[API Integration Guide](docs/API_INTEGRATION.md)** - How to use the API in the mobile app
- **[Integration Summary](docs/INTEGRATION_SUMMARY.md)** - Summary of API integration changes

## Authentication Flow

1. User enters email and password on LoginScreen
2. App sends POST request to `/auth/login`
3. On success, JWT token and user data are stored in AsyncStorage
4. Axios interceptor automatically adds token to all subsequent requests
5. User is navigated to CustomerListScreen
6. On logout, token is removed and user returns to LoginScreen

## API Integration

The app is fully integrated with the REST API at `https://admin.homesteadsviands.com/api`.

### Key Features

- ✅ **Automatic Response Handling** - Response interceptor extracts data automatically
- ✅ **Pagination Support** - All list endpoints support pagination with configurable page size
- ✅ **Search & Filtering** - Advanced search and filtering capabilities
- ✅ **Error Handling** - Standardized error format with detailed validation messages
- ✅ **Token Management** - Automatic JWT token injection and refresh
- ✅ **Comprehensive Documentation** - JSDoc comments on all API methods

### API Modules

```javascript
import { invoicesApi } from './src/api/invoices';
import { customersApi } from './src/api/customers';
import { billingApi } from './src/api/billing';
import { authApi } from './src/api/auth';
```

### Example Usage

```javascript
// List invoices with pagination and filters
const { invoices, pagination } = await invoicesApi.getAll({
  page: 1,
  limit: 20,
  status: 'PAID',
  search: 'INV-2025'
});

// Create a customer with addresses
const customer = await customersApi.create({
  name: 'Acme Corp',
  phone: '+1234567890',
  email: 'billing@acme.com',
  addresses: [{ type: 'BOTH', line1: '123 Street', city: 'Mumbai' }]
});
```

For complete API documentation, see [REST_API.md](docs/REST_API.md) and [API_INTEGRATION.md](docs/API_INTEGRATION.md).

## Development Notes

### Current State (v1.1.0)
- ✅ **API Integration Complete** - Fully connected to production REST API
- ✅ **Pagination Support** - API layer supports pagination for all list endpoints
- ✅ **Search & Filtering** - API methods support advanced filtering
- ✅ **Comprehensive Documentation** - All API methods documented with JSDoc
- ⚠️ **UI Implementation Pending** - Screens still using sample data

### Next Steps
1. ✅ ~~API Integration~~ (COMPLETED)
2. Update screens to use real API calls instead of sample data
3. Implement pagination UI in customer and billing lists
4. Add search bars with debouncing
5. Add filter dropdowns for status, date range, etc.
6. Implement proper loading states with skeletons
7. Add error handling UI components (toast notifications)
8. Add pull-to-refresh functionality
9. Implement offline support with caching
10. Add unit tests for API modules

### TypeScript Migration
The project is structured to be TypeScript-ready. To migrate:
1. Rename files from `.js` to `.tsx`/`.ts`
2. Install TypeScript and types: `npm install -D typescript @types/react @types/react-native`
3. Create `tsconfig.json`
4. Add type definitions incrementally

## Contributing

When adding new features:
1. Create new API endpoint files in `src/api/`
2. Add corresponding screens in `src/screens/`
3. Create reusable components in `src/components/`
4. Add custom hooks for data fetching in `src/hooks/`
5. Update navigation in `src/navigation/AppNavigator.js`

## License

Proprietary - Homesteads Viands

## Changelog

### Version 1.1.0 (October 12, 2025)

**Added:**
- Full REST API integration with production environment (`https://admin.homesteadsviands.com/api`)
- Comprehensive API documentation (REST_API.md, API_INTEGRATION.md)
- Pagination support for all list endpoints
- Search and filtering capabilities
- Enhanced error handling with detailed messages
- Invoice and customer status constants
- Indian states constant for GST forms

**Changed:**
- API response format handling (automatic data extraction)
- All API modules updated with JSDoc documentation
- Increased API timeout from 10s to 15s

### Version 1.0.0 (Initial Release)
- Basic app structure with Expo
- Authentication flow with JWT
- Customer, billing, and invoice screens
- Sample data for demonstration

## Support

For technical support:
- **Email**: sreeharshkrajan@gmail.com
- **Admin Panel**: https://admin.homesteadsviands.com
- **Documentation**: See `/docs` folder

