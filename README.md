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

1. Update the API base URL in `src/api/client.js`:
   ```javascript
   const BASE_URL = 'https://your-api-endpoint.com';
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

## Authentication Flow

1. User enters email and password on LoginScreen
2. App sends POST request to `/auth/login`
3. On success, JWT token and user data are stored in AsyncStorage
4. Axios interceptor automatically adds token to all subsequent requests
5. User is navigated to CustomerListScreen
6. On logout, token is removed and user returns to LoginScreen

## API Integration

The app is structured to connect to REST APIs with the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user info

### Customers
- `GET /customers` - Get all customers
- `GET /customers/:id` - Get customer by ID
- `POST /customers` - Create new customer
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

### Billing
- `GET /billing` - Get all billing records
- `GET /billing/:id` - Get billing by ID
- `GET /billing/customer/:customerId` - Get billing for a customer
- `POST /billing` - Create billing record
- `PUT /billing/:id` - Update billing record

### Invoices
- `GET /invoices` - Get all invoices
- `GET /invoices/:id` - Get invoice by ID
- `GET /invoices/customer/:customerId` - Get invoices for a customer
- `POST /invoices` - Create invoice
- `PUT /invoices/:id` - Update invoice
- `POST /invoices/:id/paid` - Mark invoice as paid

## Development Notes

### Current State
- The app currently uses **sample data** for demonstration
- All screens are functional with mock data
- Ready to be connected to real API endpoints

### Next Steps
1. Replace sample data with real API calls in screens
2. Add error handling UI components
3. Implement proper loading states
4. Add pull-to-refresh functionality
5. Implement search and filtering
6. Add form validation refinements
7. Set up environment variables for API URLs
8. Add unit tests
9. Implement offline support with caching
10. Add push notifications

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

## Support

For issues or questions, contact the development team.

