
# WAMP Server Deployment Instructions

## Prerequisites
1. WAMP Server installed and running
2. Apache and MySQL services started
3. Node.js installed for building the React app

## Step 1: Database Setup
1. Open phpMyAdmin (usually at http://localhost/phpmyadmin/)
2. Create a new database called `feedback_app`
3. Import or run the SQL script from `public/api/database/setup.sql`

## Step 2: Build React Application
```bash
# In your project directory
npm install
npm run build
```

## Step 3: Deploy to WAMP
1. Copy the contents of the `dist` folder to `C:\wamp64\www\` (or your WAMP www directory)
2. The API files in `public/api/` will be automatically included in the build

## Step 4: Configure Apache (if needed)
1. Ensure mod_rewrite is enabled in Apache
2. The `.htaccess` files are already configured for:
   - React Router support
   - API routing
   - CORS headers

## Step 5: Test the Application
1. Navigate to `http://localhost/` in your browser
2. Test the feedback form submission
3. Check the database in phpMyAdmin to verify data is being stored

## Troubleshooting
- If you get CORS errors, ensure the `.htaccess` files are being read by Apache
- If API calls fail, check that the `feedback_app` database exists and has the correct tables
- For permission issues, ensure the `www` directory has proper read/write permissions

## Production Considerations
- Change the default MySQL password
- Update database credentials in `api/config.php`
- Consider using environment variables for sensitive configuration
- Enable HTTPS for production use
