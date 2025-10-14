# 🚀 ARVANA Quick Start Guide

Get your AR virtual try-on platform running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including React, TensorFlow.js, and other dependencies.

## Step 2: Start Development Server

```bash
npm run dev
```

The app will start at `http://localhost:3000`

## Step 3: Open in Browser

1. Open your browser and go to `http://localhost:3000`
2. You'll see the ARVANA homepage with the hero section

## Step 4: Try the AR Feature

1. Scroll down to the product catalog
2. Click on any product's camera icon
3. **Grant camera permissions** when prompted
4. Wait for the AI model to load (you'll see "Ready" indicator)
5. Position yourself according to the product category:
   - **Shoes**: Show your feet
   - **Bags**: Show your hand/shoulder
   - **Clothes**: Show your upper body
   - **Watches**: Show your wrist

## Step 5: Capture & Share

1. Click the camera button to capture
2. Download or share your try-on photo

## 🎯 First Time Tips

### For Best Results:
- ✅ Use good lighting
- ✅ Stand in front of a clear background
- ✅ Keep steady for a few seconds
- ✅ Make sure the relevant body part is visible

### Common Issues:
- **Camera not working?** Check browser permissions
- **Model not loading?** Wait a few seconds, it's downloading
- **Detection not working?** Improve lighting and positioning

## 📱 Testing on Mobile

1. Find your local IP address:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. Open `http://YOUR_IP:3000` on your mobile device

3. Make sure both devices are on the same network

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🎨 Customization Quick Tips

### Add a New Product

Edit `src/data/products.js`:

```javascript
{
  id: 13,
  name: 'New Product',
  category: 'shoes',
  price: 99,
  image: 'https://image-url.com/image.jpg',
  description: 'Description here',
  colors: ['Black', 'White'],
  sizes: ['S', 'M', 'L']
}
```

### Change Theme Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    600: '#your-color-here',
  }
}
```

### Adjust Camera Quality

Edit `src/components/ARTryOn.jsx`:

```javascript
video: {
  width: { ideal: 1280 },  // Change this
  height: { ideal: 720 },  // And this
}
```

## 🚀 Deploy to Production

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### Manual Deploy

```bash
npm run build
# Upload the 'dist' folder to your hosting provider
```

## 📚 Next Steps

1. Read the full [README.md](README.md) for detailed documentation
2. Explore the code in `src/components/`
3. Customize products in `src/data/products.js`
4. Modify AR overlays in `src/hooks/useARDetection.js`
5. Style the app in `src/index.css` and component files

## 🆘 Need Help?

- Check [README.md](README.md) for detailed docs
- Look at the troubleshooting section
- Open an issue on GitHub
- Contact: support@arvana.com

---

**Happy coding! 🎉**
