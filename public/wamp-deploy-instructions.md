
# WAMP Server Deployment Instructions - Fixed for Blank Page Issues

## Prerequisites
1. WAMP Server installed and running
2. Apache and MySQL services started (green icons in WAMP)
3. Node.js installed for building the React app

## Step-by-Step Deployment

### Step 1: Build React Application
```bash
# In your project directory
npm install
npm run build
```

### Step 2: Deploy to WAMP
1. **IMPORTANT**: Copy the ENTIRE contents of the `dist` folder (not the folder itself) to `C:\wamp64\www\`
   - Copy `index.html` directly to `C:\wamp64\www\index.html`
   - Copy `assets` folder to `C:\wamp64\www\assets\`
   - Copy `api` folder to `C:\wamp64\www\api\`
   - Copy `.htaccess` file to `C:\wamp64\www\.htaccess`

### Step 3: Enable Required Apache Modules
1. Click on WAMP tray icon
2. Go to Apache → Apache Modules
3. Ensure these modules are enabled (checked):
   - ✅ rewrite_module
   - ✅ headers_module
   - ✅ expires_module
   - ✅ deflate_module

### Step 4: Test the Application
1. Navigate to `http://localhost/` in your browser
2. You should see the feedback form (not a blank page)
3. Test the API: `http://localhost/api/setup`
4. Test database connection: `http://localhost/api/feedback/test`

## Troubleshooting Blank Page Issues

### If you see a blank page:

#### 1. Check Apache Error Logs
- Open WAMP → Apache → Apache Error Log
- Look for any errors related to .htaccess or rewrite

#### 2. Verify File Structure
Your `C:\wamp64\www\` should look like:
```
C:\wamp64\www\
├── index.html (main React app file)
├── .htaccess (Apache configuration)
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── other assets...
└── api/
    ├── config.php
    ├── setup.php
    ├── .htaccess
    └── feedback/
        ├── submit.php
        ├── list.php
        └── test.php
```

#### 3. Check Browser Console
- Press F12 to open Developer Tools
- Look for any JavaScript errors in the Console tab
- Check the Network tab for failed requests

#### 4. Test Direct File Access
- Try accessing `http://localhost/index.html` directly
- If this works but `http://localhost/` doesn't, it's a rewrite issue

#### 5. Verify WAMP Configuration
- Ensure Apache is running (green icon)
- Check that port 80 is not blocked by other software
- Try accessing `http://localhost/` without any subpaths first

### Common Fixes:

#### Fix 1: Enable mod_rewrite
```apache
# In WAMP tray → Apache → Apache Modules → rewrite_module (check it)
```

#### Fix 2: Check .htaccess syntax
- Ensure the .htaccess file is properly formatted
- No extra spaces or characters

#### Fix 3: Clear browser cache
- Hard refresh: Ctrl+F5
- Or clear browser cache completely

#### Fix 4: Check file permissions
- Ensure WAMP has read access to all files
- Try running WAMP as administrator

## API Testing

Once the app loads:
- Submit a test feedback form
- Check `http://localhost/api/feedback/test` for database status
- View `http://localhost/api/setup` for setup confirmation

## Production Notes

- The database setup is completely automated
- CORS headers are configured for cross-origin requests
- Static file caching is enabled for better performance
- Security headers are set for basic protection

## Still Having Issues?

1. **Check WAMP services**: All should be green
2. **Restart Apache**: WAMP tray → Apache → Service → Restart Service
3. **Check port conflicts**: Ensure no other software is using port 80
4. **Try different browser**: Rule out browser-specific issues
5. **Check Windows firewall**: Ensure it's not blocking Apache

If problems persist, check the Apache error log for specific error messages.
