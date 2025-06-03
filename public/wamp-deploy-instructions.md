
# WAMP Server Deployment Instructions - Automated Setup

## Prerequisites
1. WAMP Server installed and running
2. Apache and MySQL services started
3. Node.js installed for building the React app

## Quick Deployment Steps

### Step 1: Build React Application
```bash
# In your project directory
npm install
npm run build
```

### Step 2: Deploy to WAMP (Simple Copy)
1. Copy the ENTIRE contents of the `dist` folder to `C:\wamp64\www\` (or your WAMP www directory)
2. That's it! The database will be set up automatically on first access.

### Step 3: Test the Application
1. Navigate to `http://localhost/` in your browser
2. The database will be automatically created on first page load
3. Test the feedback form submission
4. Check `http://localhost/api/setup` to verify database setup status

## What Happens Automatically

- **Database Creation**: The `feedback_app` database is created automatically
- **Table Setup**: All required tables are created with proper relationships
- **CORS Configuration**: Headers are automatically set for cross-origin requests
- **Error Handling**: Robust error handling with automatic retry mechanisms

## Manual Verification (Optional)

If you want to verify the database setup manually:
1. Open phpMyAdmin at `http://localhost/phpmyadmin/`
2. Look for the `feedback_app` database
3. Check that these tables exist:
   - `feedback`
   - `feedback_issues`
   - `feedback_images`
   - `customer_rewards`
   - `scanned_products`

## API Endpoints Available

- `GET /api/setup` - Check/run database setup
- `GET /api/feedback/test` - Test database connection
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - List all feedback

## Troubleshooting

### If the app doesn't load:
1. Ensure WAMP services (Apache, MySQL) are running (green icons)
2. Check that mod_rewrite is enabled in Apache
3. Verify the `www` directory permissions

### If database setup fails:
1. Check MySQL is running in WAMP
2. Verify default MySQL credentials (usually root with no password)
3. Visit `http://localhost/api/setup` directly to see setup status

### If API calls fail:
1. Check browser console for CORS errors
2. Verify `.htaccess` files are in place
3. Test API directly: `http://localhost/api/feedback/test`

## Production Considerations

- The auto-setup is perfect for development and testing
- For production, consider:
  - Changing the default MySQL password
  - Creating a dedicated database user
  - Enabling HTTPS
  - Adding input validation and sanitization

## File Structure After Deployment

```
C:\wamp64\www\
├── index.html (React app entry point)
├── assets/ (React app assets)
├── api/
│   ├── config.php (Main API router with auto-setup)
│   ├── setup.php (Automated database setup)
│   ├── feedback/
│   │   ├── submit.php
│   │   ├── list.php
│   │   └── test.php
│   └── .htaccess (API routing)
└── .htaccess (React Router support)
```

The setup is now completely automated - just copy the files and access your application!
