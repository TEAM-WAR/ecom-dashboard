# Services Documentation

## Authentication Service

The authentication system has been implemented with the following components:

### Files Created/Modified:

1. **`src/services/authService.js`** - API service for authentication operations
2. **`src/contexts/AuthContext.jsx`** - React context for managing authentication state
3. **`src/components/ProtectedRoute.jsx`** - Component for protecting routes
4. **`src/pages/Login.jsx`** - Updated login page with actual authentication
5. **`src/components/TopBar.jsx`** - Updated with logout functionality
6. **`src/App.jsx`** - Updated with AuthProvider and ProtectedRoute

### Features Implemented:

#### Login Functionality
- **Endpoint**: `POST /admin/login`
- **Credentials**: Email/Telephone and Password
- **Response**: JWT token stored as HTTP-only cookie
- **Redirect**: After successful login, redirects to intended page or dashboard

#### Authentication Verification
- **Endpoint**: `GET /admin/verify`
- **Purpose**: Verify if user is authenticated on app load
- **Automatic**: Runs on every app initialization

#### Protected Routes
- All routes except `/login` are now protected
- Unauthenticated users are redirected to login page
- Loading state shown during authentication check

#### Logout Functionality
- **Endpoint**: `POST /admin/logout`
- **Clears**: JWT cookie and local state
- **Redirect**: Automatically redirects to login page

#### User Profile Display
- Shows authenticated user's name in TopBar
- User information available throughout the app via AuthContext

### Usage:

#### Using the Auth Context:
```javascript
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Access user data
  console.log(user?.name, user?.email);
  
  // Check authentication status
  if (isAuthenticated) {
    // User is logged in
  }
};
```

#### Protecting Routes:
```javascript
import ProtectedRoute from '../components/ProtectedRoute';

<Route path="/protected" element={
  <ProtectedRoute>
    <MyProtectedComponent />
  </ProtectedRoute>
} />
```

### Environment Variables Required:

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_APP_API_URL=http://localhost:3000/api
VITE_APP_API_KEY=your_api_key_here
```

### Backend Integration:

The frontend expects the following backend endpoints:

- `POST /admin/login` - Login with email/telephone and password
- `POST /admin/logout` - Logout and clear session
- `GET /admin/verify` - Verify authentication status
- `GET /admin/profile` - Get user profile (protected)
- `PUT /admin/profile` - Update user profile (protected)
- `PUT /admin/change-password` - Change password (protected)

### Security Features:

1. **HTTP-only Cookies**: JWT tokens stored securely
2. **Automatic Token Verification**: Checks authentication on app load
3. **Route Protection**: All routes except login are protected
4. **Automatic Redirects**: Unauthenticated users redirected to login
5. **Loading States**: Proper loading indicators during auth checks

### Error Handling:

- Network errors are caught and displayed to users
- Authentication failures show appropriate error messages
- Automatic logout on token expiration
- Graceful fallbacks for missing user data 