# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Start the App

```bash
cd /mnt/Personal/Work/Homesteads/website/mobile-app/homesteads-viands-app
npx expo start
```

### 2. Open on Device

**Option A: Physical Device**
- Install "Expo Go" from App Store (iOS) or Play Store (Android)
- Scan the QR code shown in terminal

**Option B: Emulator**
- Press `a` for Android emulator
- Press `i` for iOS simulator (macOS only)

### 3. Test the App

The app currently uses **sample data** for demonstration:

**Login Screen:**
- Enter any email and password
- Currently will attempt API call (which will fail without real backend)
- To test navigation, you need to either:
  - Connect to a real backend API, OR
  - Temporarily mock the login (see below)

**Mock Login for Testing:**

Edit `src/store/authStore.js` and replace the `login` function with:

```javascript
login: async (email, password) => {
  // TEMPORARY: Mock successful login for testing UI
  const mockResponse = {
    token: 'mock-jwt-token-12345',
    user: { 
      id: 1, 
      name: 'Test User', 
      email: email 
    }
  };
  
  await AsyncStorage.setItem('authToken', mockResponse.token);
  await AsyncStorage.setItem('user', JSON.stringify(mockResponse.user));
  
  set({ 
    token: mockResponse.token, 
    user: mockResponse.user, 
    isAuthenticated: true 
  });
  
  return { success: true };
},
```

Now you can use any credentials to login and explore the app!

### 4. Explore Features

Once logged in:
- ✅ View customer list with search
- ✅ Create/edit customers (forms with validation)
- ✅ View billing records
- ✅ View invoice details
- ✅ Logout and see token persistence

### 5. Connect to Real API

When ready to connect to your backend:

1. **Update API URL** in `src/api/client.js`:
   ```javascript
   const BASE_URL = 'https://your-actual-api.com';
   ```

2. **Remove the mock login** from `authStore.js` (restore original)

3. **Update screens to use real data:**
   ```javascript
   // In CustomerListScreen.js
   import { useCustomers } from '../hooks/useCustomers';
   
   // Replace sample data with:
   const { customers, loading, error, refetch } = useCustomers();
   ```

4. **Test each endpoint** to ensure response format matches

## 📁 Key Files to Know

| File                             | Purpose                             |
| -------------------------------- | ----------------------------------- |
| `App.js`                         | Root component with Paper Provider  |
| `src/navigation/AppNavigator.js` | Navigation and auth routing         |
| `src/store/authStore.js`         | Authentication state management     |
| `src/api/client.js`              | Axios instance with JWT interceptor |
| `src/api/*.js`                   | API endpoint definitions            |
| `src/screens/*.js`               | All app screens                     |

## 🔧 Common Commands

```bash
# Start development server
npx expo start

# Clear cache and restart
npx expo start -c

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios

# Install new package
npx expo install package-name

# Check for issues
npx expo doctor
```

## 🐛 Troubleshooting

**"Network Error" when calling API:**
- Make sure API URL is correct
- Check if backend is running
- For local development, use your computer's IP (not localhost)

**App won't start:**
```bash
# Clear cache
npx expo start -c

# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Changes not showing:**
- Press `r` in terminal to reload
- Clear cache: `npx expo start -c`

## 📖 Full Documentation

- **README.md** - Complete project overview
- **DEVELOPMENT.md** - Detailed development guide
- **APP_SUMMARY.md** - What was built and next steps
- **CHECKLIST.md** - Development checklist

## 💡 Tips

1. **Use the mock login** to test the UI before connecting to backend
2. **Check sample data** in screens to understand expected data structure
3. **Read API files** to see what endpoints are expected
4. **Use React DevTools** in Chrome for debugging
5. **Check Expo console** for errors and logs

## 🎯 Your Next Steps

1. [ ] Start the app and explore with mock data
2. [ ] Review the code structure
3. [ ] Update API base URL when ready
4. [ ] Connect to your real backend
5. [ ] Replace sample data with real API calls
6. [ ] Customize UI colors and branding
7. [ ] Add your app icon and splash screen

---

**Need Help?** Check the full documentation or create an issue!

**Happy Coding! 🎉**

