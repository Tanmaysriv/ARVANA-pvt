# 🛠️ Complete Setup Instructions for ARVANA

This guide will walk you through setting up the ARVANA AR Virtual Try-On platform from scratch.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v16.0.0 or higher)
  - Download from: https://nodejs.org/
  - Verify: `node --version`
  
- **npm** (comes with Node.js) or **yarn**
  - Verify: `npm --version`

- **Git** (optional, for version control)
  - Download from: https://git-scm.com/
  - Verify: `git --version`

### System Requirements
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+
- **Camera**: Working webcam or device camera
- **Internet**: For downloading dependencies

## 🚀 Installation Steps

### Step 1: Navigate to Project Directory

Open your terminal/command prompt and navigate to the ARVANA folder:

```bash
cd d:\ARVANA
```

### Step 2: Install Dependencies

Run the following command to install all required packages:

```bash
npm install
```

This will install:
- React and React DOM
- TensorFlow.js and ML models
- Three.js for 3D graphics
- TailwindCSS for styling
- Framer Motion for animations
- All other dependencies

**Expected time**: 2-5 minutes depending on your internet speed

**Troubleshooting**:
- If you get permission errors on Windows, run terminal as Administrator
- If you get EACCES errors on Mac/Linux, try: `sudo npm install`
- If installation fails, delete `node_modules` and `package-lock.json`, then try again

### Step 3: Verify Installation

Check if all dependencies were installed correctly:

```bash
npm list --depth=0
```

You should see all packages listed without errors.

### Step 4: Start Development Server

Start the development server:

```bash
npm run dev
```

You should see output similar to:
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.x:3000/
  ➜  press h to show help
```

### Step 5: Open in Browser

1. Open your web browser
2. Navigate to: `http://localhost:3000`
3. You should see the ARVANA homepage

## 🎥 Testing AR Functionality

### First-Time Camera Setup

1. **Click on any product's camera icon** in the catalog
2. **Grant camera permissions** when prompted:
   - Chrome: Click "Allow" in the popup
   - Firefox: Click "Allow" in the notification bar
   - Safari: Go to Preferences > Websites > Camera > Allow

3. **Wait for AI model to load**:
   - You'll see "Loading AI Model..." message
   - First load takes 3-5 seconds
   - Models are cached for subsequent uses

4. **Position yourself**:
   - Ensure good lighting
   - Follow on-screen instructions for each category
   - Wait for detection (green indicator)

### Testing Each Category

#### 👟 Shoes
1. Select a shoe product
2. Point camera at your feet
3. Stand still for 2-3 seconds
4. You should see blue overlays on your ankles

#### 👜 Bags
1. Select a bag product
2. Show your hand or shoulder to camera
3. Keep hand steady
4. Purple hand tracking should appear

#### 👕 Clothes
1. Select a clothing item
2. Show upper body in frame
3. Stand still
4. Purple overlay should appear on torso

#### ⌚ Watches
1. Select a watch
2. Show your wrist to camera
3. Keep wrist steady
4. Watch overlay appears on wrist

## 🔧 Configuration (Optional)

### Adjusting Camera Quality

Edit `src/components/ARTryOn.jsx`:

```javascript
// Line ~50
video: {
  width: { ideal: 1280 },   // Lower for slower devices
  height: { ideal: 720 },   // Lower for slower devices
  facingMode: 'user'        // 'environment' for back camera
}
```

### Changing Theme Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    600: '#0ea5e9',  // Change this hex color
    // ... other shades
  }
}
```

### Adding Custom Products

Edit `src/data/products.js`:

```javascript
{
  id: 13,
  name: 'Your Product Name',
  category: 'shoes', // or 'bags', 'clothes', 'watches'
  price: 99,
  image: 'https://your-image-url.com/image.jpg',
  description: 'Product description',
  colors: ['Black', 'White'],
  sizes: ['S', 'M', 'L']
}
```

## 📱 Testing on Mobile Devices

### Local Network Testing

1. **Find your computer's IP address**:

   **Windows**:
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

   **Mac/Linux**:
   ```bash
   ifconfig | grep "inet "
   ```

2. **Ensure mobile device is on same WiFi network**

3. **Open browser on mobile device**:
   ```
   http://YOUR_IP_ADDRESS:3000
   ```
   Example: `http://192.168.1.100:3000`

4. **Grant camera permissions on mobile**

### Mobile-Specific Tips
- Use good lighting
- Hold device steady
- Use rear camera for better quality (if supported)
- Close other apps to free up memory

## 🏗️ Building for Production

### Create Production Build

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

Opens the production build at `http://localhost:4173`

### Deploy to Hosting

#### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Follow the prompts to complete deployment.

#### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Option 3: Manual Deployment

1. Run `npm run build`
2. Upload the `dist/` folder to your web host
3. Ensure HTTPS is enabled (required for camera access)
4. Configure server to serve `index.html` for all routes

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Issue: "npm: command not found"
**Solution**: Install Node.js from https://nodejs.org/

#### Issue: "Port 3000 is already in use"
**Solution**: 
- Kill the process using port 3000
- Or change port in `vite.config.js`:
  ```javascript
  server: {
    port: 3001  // Change to any available port
  }
  ```

#### Issue: Camera not working
**Solutions**:
- Check browser permissions
- Ensure HTTPS (or localhost)
- Try different browser
- Check if camera is used by another app
- Restart browser

#### Issue: AR detection not working
**Solutions**:
- Improve lighting
- Ensure you're in frame
- Wait for model to fully load
- Check console for errors (F12)
- Try refreshing the page

#### Issue: Slow performance
**Solutions**:
- Close other browser tabs
- Lower camera resolution (see Configuration)
- Use Chrome for best performance
- Ensure good internet connection (first load)
- Clear browser cache

#### Issue: Build errors
**Solutions**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Or on Windows
rmdir /s /q node_modules
del package-lock.json
npm install
```

#### Issue: "Module not found" errors
**Solution**: Ensure all files are in correct locations as per project structure

## 📊 Performance Tips

### For Best Experience
1. **Use Chrome browser** - Best TensorFlow.js performance
2. **Good lighting** - Improves detection accuracy
3. **Stable camera** - Reduces jitter
4. **Clear background** - Helps with detection
5. **Close unnecessary tabs** - Frees up resources

### Optimization Settings
- Lower camera resolution for slower devices
- Use Lightning models instead of Thunder
- Reduce detection frequency if needed
- Enable hardware acceleration in browser

## 🔐 Security Notes

### Development
- Camera access works on `localhost` without HTTPS
- All processing happens locally
- No data is sent to external servers

### Production
- **HTTPS is required** for camera access
- Obtain SSL certificate from your hosting provider
- Use Let's Encrypt for free SSL certificates

## 📚 Next Steps

After successful setup:

1. ✅ Explore the codebase in `src/`
2. ✅ Read [README.md](README.md) for detailed documentation
3. ✅ Check [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) for architecture
4. ✅ Try customizing products in `src/data/products.js`
5. ✅ Experiment with AR overlays in `src/hooks/useARDetection.js`
6. ✅ Modify styles in `src/index.css` and Tailwind config

## 🆘 Getting Help

If you encounter issues:

1. **Check documentation**:
   - README.md
   - QUICKSTART.md
   - PROJECT_OVERVIEW.md

2. **Search for errors**:
   - Check browser console (F12)
   - Search error messages online

3. **Community support**:
   - Open GitHub Issue
   - Email: support@arvana.com
   - Check existing issues for solutions

4. **Debug mode**:
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

## ✅ Setup Verification Checklist

Before considering setup complete, verify:

- [ ] Node.js and npm are installed
- [ ] All dependencies installed successfully
- [ ] Development server starts without errors
- [ ] Homepage loads in browser
- [ ] Camera permissions granted
- [ ] AI models load successfully
- [ ] AR detection works for at least one category
- [ ] Can capture and download photos
- [ ] Responsive design works on mobile
- [ ] No console errors

## 🎉 Success!

If all steps completed successfully, you now have a fully functional AR virtual try-on platform!

**Enjoy building with ARVANA!** 🚀

---

**Need more help?** Contact us at support@arvana.com
