# ARVANA - AR Virtual Try-On Platform

![ARVANA](https://img.shields.io/badge/ARVANA-AR%20Virtual%20Try--On-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.15.0-orange)
![License](https://img.shields.io/badge/license-MIT-green)

A cutting-edge augmented reality virtual try-on platform that allows users to try shoes, bags, clothes, and watches using advanced AI and computer vision technology.

## 🌟 Features

### Core Functionality
- **Real-Time AR Try-On**: Experience products in real-time using your device camera
- **Multi-Category Support**: Try on shoes, bags, clothes, and watches
- **AI-Powered Detection**: Advanced pose, hand, and face detection using TensorFlow.js
- **Instant Capture**: Take photos of your virtual try-on experience
- **Share & Download**: Save and share your try-on photos

### Technical Features
- **Pose Detection**: Full-body tracking for shoes and clothes
- **Hand Tracking**: Precise wrist detection for watches and bags
- **Face Mesh**: Facial landmark detection for accessories
- **Privacy-First**: All processing happens locally on your device
- **Mobile Optimized**: Works seamlessly on desktop and mobile devices
- **Zero Lag**: Real-time rendering with optimized performance

### UI/UX Features
- **Modern Design**: Beautiful, responsive interface built with TailwindCSS
- **Smooth Animations**: Framer Motion powered transitions
- **Category Filters**: Easy product browsing by category
- **Product Catalog**: Extensive collection with detailed information
- **Interactive Controls**: Zoom, capture, and share controls

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Modern web browser with camera access
- Good lighting for optimal AR experience

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd d:\ARVANA
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

5. **Grant camera permissions**
   Allow camera access when prompted for AR functionality

## 📱 Usage

### Trying On Products

1. **Browse Products**: Scroll through the product catalog on the homepage
2. **Select Category**: Filter by shoes, bags, clothes, or watches
3. **Click Try-On**: Click the camera icon on any product
4. **Position Yourself**: Follow the on-screen instructions for optimal detection
5. **Capture Photo**: Take a snapshot when you're happy with the result
6. **Share or Download**: Save your try-on photo or share it with friends

### Category-Specific Instructions

#### 👟 Shoes
- Stand in a well-lit area
- Point camera at your feet
- Stand still for best results
- The AR overlay will appear on your ankles/feet

#### 👜 Bags
- Show your hand or shoulder to the camera
- Keep your hand steady
- The bag will overlay on your hand/shoulder area

#### 👕 Clothes
- Position yourself showing upper body
- Stand in good lighting
- Keep torso visible in frame
- The clothing will overlay on your body

#### ⌚ Watches
- Show your wrist to the camera
- Keep your hand steady
- The watch will appear on your wrist

## 🛠️ Technology Stack

### Frontend
- **React 18.2**: Modern UI framework
- **Vite**: Lightning-fast build tool
- **React Router**: Client-side routing
- **TailwindCSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Lucide React**: Beautiful icon set

### AI & Computer Vision
- **TensorFlow.js**: Machine learning in the browser
- **Pose Detection**: MoveNet model for body tracking
- **Hand Pose Detection**: MediaPipe Hands for wrist tracking
- **Face Landmarks**: MediaPipe Face Mesh for facial tracking

### 3D & AR
- **Three.js**: 3D graphics library
- **React Three Fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers for R3F

## 📂 Project Structure

```
ARVANA/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── ProductCatalog.jsx
│   │   ├── ARTryOn.jsx
│   │   └── Footer.jsx
│   ├── hooks/          # Custom React hooks
│   │   └── useARDetection.js
│   ├── data/           # Product data
│   │   └── products.js
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Customization

### Adding New Products

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

### Customizing AR Overlays

Modify the overlay functions in `src/hooks/useARDetection.js`:
- `drawShoeOverlay()` - Customize shoe appearance
- `drawClothesOverlay()` - Customize clothing appearance
- `drawWatchOverlay()` - Customize watch appearance
- `drawBagOverlay()` - Customize bag appearance

### Styling

All styles are in:
- `src/index.css` - Global styles and Tailwind directives
- `tailwind.config.js` - Tailwind configuration
- Component files - Component-specific styles

## 🔧 Configuration

### Camera Settings

Adjust camera quality in `src/components/ARTryOn.jsx`:

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: { ideal: 1280 },  // Adjust resolution
    height: { ideal: 720 },
    facingMode: 'user'       // 'user' or 'environment'
  }
})
```

### AI Model Settings

Configure detection models in `src/hooks/useARDetection.js`:

```javascript
// Pose detection sensitivity
detectorRef.current = await poseDetection.createDetector(
  poseDetection.SupportedModels.MoveNet,
  {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
    // Options: SINGLEPOSE_LIGHTNING, SINGLEPOSE_THUNDER
  }
)
```

## 📊 Performance Optimization

### Tips for Best Performance

1. **Use good lighting** - Improves detection accuracy
2. **Stable camera position** - Reduces jitter
3. **Clear background** - Helps with detection
4. **Modern device** - Better processing power
5. **Close other tabs** - Free up resources

### Model Selection

- **Lightning models**: Faster, less accurate (mobile)
- **Thunder models**: Slower, more accurate (desktop)

## 🔒 Privacy & Security

- **Local Processing**: All AI processing happens on your device
- **No Data Storage**: Images are never uploaded to servers
- **Camera Permissions**: Only used when explicitly granted
- **Secure Connection**: Use HTTPS in production

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Environment Variables

For production, set:
- `VITE_API_URL` - Backend API URL (if applicable)
- `VITE_ANALYTICS_ID` - Analytics tracking ID

## 🐛 Troubleshooting

### Camera Not Working
- Check browser permissions
- Ensure HTTPS connection (required for camera access)
- Try different browser
- Check if camera is being used by another app

### AR Detection Not Working
- Ensure good lighting
- Check if you're in frame
- Wait for model to load (check "Ready" indicator)
- Try refreshing the page

### Performance Issues
- Close other browser tabs
- Use a more powerful device
- Reduce camera resolution in settings
- Switch to Lightning model

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **TensorFlow.js Team** - For amazing ML models
- **MediaPipe** - For pose and hand tracking
- **React Team** - For the excellent framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Wanna Fashion** - For inspiration

## 📧 Contact

For questions or support:
- Email: support@arvana.com
- Website: https://arvana.com
- Twitter: @arvana_ar

## 🗺️ Roadmap

- [ ] Add more product categories (jewelry, hats, glasses)
- [ ] Implement size recommendation AI
- [ ] Add social sharing features
- [ ] Multi-language support
- [ ] Virtual fitting room with multiple products
- [ ] AR filters and effects
- [ ] Integration with e-commerce platforms
- [ ] Mobile app (iOS/Android)

---

**Made with ❤️ by the ARVANA Team**

*Try before you buy with AR magic!* ✨
