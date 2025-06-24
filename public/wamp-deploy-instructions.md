
# WAMP Server Deployment Instructions - Updated for Blank Page Issues

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

### Step 2: Deploy to WAMP (CRITICAL STEPS)
1. **STOP Apache service** in WAMP before copying files
2. **Clear the www directory**: Delete ALL contents of `C:\wamp64\www\`
3. **Copy the ENTIRE contents** of the `dist` folder (not the folder itself) to `C:\wamp64\www\`
   - Copy `index.html` directly to `C:\wamp64\www\index.html`
   - Copy `assets` folder to `C:\wamp64\www\assets\`
   - Copy `.htaccess` file to `C:\wamp64\www\.htaccess`
   - Copy `api` folder to `C:\wamp64\www\api\`

### Step 3: Enable Required Apache Modules
1. Click on WAMP tray icon
2. Go to Apache → Apache Modules
3. **ENSURE these modules are enabled (checked)**:
   - ✅ rewrite_module (CRITICAL for React Router)
   - ✅ headers_module (CRITICAL for CORS)
   - ✅ expires_module
   - ✅ deflate_module

### Step 4: Restart Apache
1. **Restart Apache service** after enabling modules
2. Wait for WAMP icon to turn green

### Step 5: Test the Application
1. Navigate to `http://localhost/` in your browser
2. You should see the feedback form (not a blank page)
3. Test the API: `http://localhost/api/setup`
4. Test database connection: `http://localhost/api/feedback/test`

## Troubleshooting Blank Page Issues

### Most Common Causes & Fixes:

#### 1. **mod_rewrite Not Enabled** (Most Common)
- **Symptom**: Blank page on `http://localhost/`
- **Fix**: Enable `rewrite_module` in WAMP → Apache → Apache Modules
- **Test**: After enabling, restart Apache

#### 2. **Incorrect File Structure**
- **Symptom**: 404 errors or blank page
- **Fix**: Ensure your `C:\wamp64\www\` looks exactly like this:
```
C:\wamp64\www\
├── index.html (the main React app file)
├── .htaccess (Apache configuration)
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
└── api/
    ├── config.php
    ├── setup.php
    ├── .htaccess
    └── feedback/
        ├── submit.php
        ├── list.php
        └── test.php
```

#### 3. **Apache Error Logs Check**
- Open WAMP → Apache → Apache Error Log
- Look for rewrite errors or permission issues
- Common error: "Invalid command 'RewriteEngine'"

#### 4. **Browser Cache Issues**
- **Hard refresh**: Ctrl+F5
- **Clear cache**: Clear browser cache completely
- **Try incognito mode**: Test in private browsing

#### 5. **Port Conflicts**
- Ensure no other software is using port 80
- Check Skype, IIS, or other web servers
- Test: `netstat -an | findstr :80`

### Step-by-Step Debugging:

#### Test 1: Check Apache Status
- WAMP icon should be **green**
- If orange/red: Fix Apache configuration first

#### Test 2: Test Direct File Access
```
http://localhost/index.html
```
- If this works but `http://localhost/` doesn't → rewrite issue
- If this doesn't work → file structure issue

#### Test 3: Check .htaccess
- Ensure `.htaccess` exists in `C:\wamp64\www\.htaccess`
- Check file is not named `.htaccess.txt`
- Verify mod_rewrite is enabled

#### Test 4: Browser Console
- Press F12 → Console tab
- Look for JavaScript errors
- Check Network tab for failed requests

#### Test 5: API Test
```
http://localhost/api/setup
```
- Should return JSON response
- If 404 error → API routing issue

### Emergency Fixes:

#### Fix 1: Simple .htaccess Test
Create a minimal `.htaccess` in `C:\wamp64\www\`:
```apache
RewriteEngine On
RewriteRule ^.*$ index.html [L]
```

#### Fix 2: Check File Permissions
- Run WAMP as Administrator
- Ensure Apache can read all files

#### Fix 3: Alternative Port Test
- Change Apache port to 8080
- Test `http://localhost:8080/`

## Production Notes

- Database setup is automated via `/api/setup`
- CORS headers configured for development
- Error logging enabled for debugging
- All modules properly configured

## Still Having Issues?

1. **Restart everything**: Stop WAMP, restart computer, start WAMP
2. **Check Windows Firewall**: Ensure Apache is allowed
3. **Try different browser**: Rule out browser issues
4. **Check WAMP logs**: Look in `C:\wamp64\logs\apache_error.log`

**Most blank page issues are caused by mod_rewrite not being enabled!**
