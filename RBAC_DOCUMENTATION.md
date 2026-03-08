# Role-Based Access Control (RBAC) Documentation

## Overview

The Travel Planner application now supports **User and Admin roles** with proper access control.

## Features

### 🔐 User Roles

- **User (default)**: Can create itineraries, use chatbot, view their own data
- **Admin**: All user permissions + can view all registered users

### 🛡️ Security Implementation

- JWT tokens include role information
- Backend validates admin role before returning sensitive data
- Frontend shows appropriate UI based on user role
- Non-admin users cannot access admin-only pages

---

## How to Create an Admin User

### Method 1: Using the Admin Creation Script

1. **Navigate to backend folder:**

   ```bash
   cd backend
   ```

2. **Run the admin creation script:**

   ```bash
   node createAdmin.js
   ```

3. **Default admin credentials will be created:**
   - **Username:** `admin`
   - **Email:** `admin@travelplanner.com`
   - **Password:** `admin123`
   - **Role:** `admin`

4. **⚠️ Change the password after first login!**

### Method 2: Promote Existing User via MongoDB

1. **Connect to MongoDB** (using Compass or mongosh):

   ```bash
   mongosh mongodb://localhost:27017/travel_planner
   ```

2. **Update user role:**
   ```javascript
   db.users.updateOne(
     { email: "user@example.com" },
     { $set: { role: "admin" } },
   );
   ```

### Method 3: Modify createAdmin.js Script

1. **Edit `backend/createAdmin.js`**
2. **Uncomment lines 50-56 and add your email:**
   ```javascript
   const userEmail = "your-email@example.com";
   const user = await User.findOne({ email: userEmail });
   if (user) {
     user.role = "admin";
     await user.save();
     console.log(`✅ User ${user.username} promoted to admin!`);
   }
   ```
3. **Run the script:**
   ```bash
   node createAdmin.js
   ```

---

## Testing the Implementation

### Test Case 1: Admin Access ✅

1. **Register/Login as admin** (`admin@travelplanner.com` / `admin123`)
2. **Navigate to `/users` page**
3. **Result:** Should see a table with all registered users including their roles

### Test Case 2: Regular User Access 🚫

1. **Register/Login as a regular user**
2. **Navigate to `/users` page**
3. **Result:** Should see "Access Denied" screen with:
   - Shield lock icon
   - "Access Denied" message
   - Role information (Regular User vs Administrator)
   - "Return to Home" button

### Test Case 3: Direct API Access 🚫

1. **Login as regular user** and get token
2. **Try to access API directly:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        http://localhost:5000/api/auth/users
   ```
3. **Expected Response:**
   ```json
   {
     "error": "Access denied. Admin privileges required.",
     "requiresAdmin": true
   }
   ```

---

## Implementation Details

### Backend Changes

#### 1. User Model (`models/User.js`)

```javascript
role: {
  type: String,
  enum: ["user", "admin"],
  default: "user"
}
```

#### 2. Admin Middleware (`middleware/auth.js`)

- New `requireAdmin` middleware checks user role
- Returns 403 Forbidden if not admin

#### 3. Protected Routes (`routes/authRoutes.js`)

```javascript
router.get("/users", authenticateToken, async (req, res) => {
  // Admin check logic
  if (user.role !== "admin") {
    return res.status(403).json({
      error: "Access denied. Admin privileges required.",
    });
  }
  // Return users...
});
```

#### 4. JWT Token Updates

- Login and Register now include `role` in JWT payload
- Token payload: `{ id, username, email, role }`

### Frontend Changes

#### 1. Users Page (`Pages/Users.jsx`)

- Checks `localStorage` for user role
- Shows "Access Denied" screen for non-admin users
- Displays role badge for each user (👤 User / 👑 Admin)
- Added Role column to users table

#### 2. Access Control Flow

```
User loads /users page
     ↓
Check localStorage for user.role
     ↓
     ├─→ role === "admin" → Fetch and display users
     └─→ role !== "admin" → Show Access Denied screen
```

---

## User Interface

### Admin View

- Full user table with columns: #, Username, Full Name, Email, **Role**, Registered, Last Login
- Role badges:
  - 👑 Admin (red badge)
  - 👤 User (blue badge)

### Regular User View

- Access Denied screen with:
  - 🛡️ Shield lock icon
  - Clear error message
  - User role information
  - "Return to Home" button

---

## Security Checklist

- [x] Role field in User model
- [x] Admin middleware for route protection
- [x] Backend validates admin role before sending data
- [x] JWT includes role information
- [x] Frontend checks role before making API calls
- [x] Access denied UI for unauthorized users
- [x] No user data exposed to non-admin users

---

## Future Enhancements

### Possible Admin Features

- [ ] User management (ban/unban users)
- [ ] View user itineraries
- [ ] Analytics dashboard
- [ ] Feedback management
- [ ] System settings configuration
- [ ] Audit logs

### Additional Roles

- [ ] Moderator role
- [ ] Premium user role
- [ ] Content creator role

---

## Troubleshooting

### Issue: "Access Denied" for admin user

**Solution:**

- Clear localStorage: `localStorage.clear()`
- Login again to get updated token with role

### Issue: Admin script fails

**Solution:**

- Ensure backend server is NOT running
- Check MongoDB connection in `config.js`
- Verify MongoDB is running: `mongosh`

### Issue: Role not showing in frontend

**Solution:**

- Check browser console for user object
- Verify `data.user.role` is saved to localStorage
- Re-login to refresh user data

---

## API Endpoints

| Endpoint             | Method | Auth | Role      | Description                            |
| -------------------- | ------ | ---- | --------- | -------------------------------------- |
| `/api/auth/register` | POST   | No   | -         | Register new user (default: user role) |
| `/api/auth/login`    | POST   | No   | -         | Login and get token (includes role)    |
| `/api/auth/users`    | GET    | Yes  | **Admin** | Get all users (admin only)             |
| `/api/auth/me`       | GET    | Yes  | Any       | Get current user info                  |

---

## Conclusion

The RBAC system is now fully implemented with:

- ✅ Secure backend role validation
- ✅ Frontend role-based UI
- ✅ Admin user creation script
- ✅ Access denied handling
- ✅ JWT-based authentication with roles

**Next Steps:**

1. Run `node createAdmin.js` to create admin user
2. Test both admin and regular user flows
3. Consider adding more admin features as needed
