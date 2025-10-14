# GLTF 3D Models Integration Guide

## ✅ What's Been Implemented

Your ARVANA app now supports **real GLTF/GLB 3D models**! The system includes:

1. **GLTF Loader Component** (`GLTFModelLoader.jsx`)
2. **Model URL Configuration** (`modelUrls.js`)
3. **Automatic Fallback System** (procedural models if GLTF fails)
4. **Error Handling** (graceful degradation)
5. **Loading States** (wireframe placeholder while loading)

## 📥 How to Add 3D Models

### Quick Start - Free Models

#### Option 1: Sketchfab (Recommended)

1. Go to https://sketchfab.com
2. Search for your product (e.g., "nike shoe", "backpack", "watch")
3. **Filter by:**
   - ✅ Downloadable
   - ✅ Free (or CC License)
4. Click on a model you like
5. Click **Download 3D Model**
6. Choose **glTF Binary (.glb)** format
7. Save to `public/models/` directory
8. Rename file to match the naming convention

**Example Searches:**
- "sneaker low poly"
- "running shoe"
- "leather bag"
- "smartwatch"
- "t-shirt"

#### Option 2: Poly Pizza

1. Go to https://poly.pizza
2. Browse categories or search
3. Download GLB files
4. Place in `public/models/`

#### Option 3: Free Model Libraries

- **Quaternius** - https://quaternius.com (CC0 models)
- **Kenney** - https://kenney.nl/assets (game assets)
- **glTF Sample Models** - https://github.com/KhronosGroup/glTF-Sample-Models

### File Naming Convention

Place your downloaded GLB files in `public/models/` with these exact names:

```
public/models/
├── nike-air-max.glb          (Product ID: 1)
├── adidas-ultraboost.glb     (Product ID: 2)
├── converse.glb              (Product ID: 3)
├── tote-bag.glb              (Product ID: 4)
├── backpack.glb              (Product ID: 5)
├── crossbody.glb             (Product ID: 6)
├── tshirt.glb                (Product ID: 7)
├── jacket.glb                (Product ID: 8)
├── dress.glb                 (Product ID: 9)
├── smartwatch.glb            (Product ID: 10)
├── analog-watch.glb          (Product ID: 11)
└── sport-watch.glb           (Product ID: 12)
```

## 🎨 Model Requirements

### Technical Specs
- **Format**: GLB (preferred) or GLTF + bin + textures
- **File Size**: < 5MB per model (smaller is better)
- **Polygons**: 10,000 - 50,000 triangles
- **Textures**: Embedded in GLB or separate PNG/JPG
- **Materials**: PBR materials work best
- **Orientation**: Y-up axis

### Quality Tips
- ✅ Look for "PBR" or "Physically Based Rendering" models
- ✅ Check preview before downloading
- ✅ Prefer models with textures included
- ✅ Avoid overly complex models (>100k polygons)
- ✅ Test in the app after adding

## 🔧 Configuration

### Update Model URLs (if needed)

Edit `src/data/modelUrls.js`:

```javascript
export const modelUrls = {
  1: {
    url: '/models/nike-air-max.glb',  // Your local file
    scale: 2,                          // Adjust size
    position: [0, -1, 0]               // Adjust position
  },
  // ... more products
}
```

### Adjust Scale and Position

If your model appears too big/small or off-center:

```javascript
{
  url: '/models/your-model.glb',
  scale: 1.5,              // Increase/decrease size
  position: [0, -0.5, 0]   // [x, y, z] position
}
```

## 🚀 Testing Your Models

1. **Add GLB file** to `public/models/`
2. **Refresh the app** (Ctrl+R)
3. **Click the purple 3D cube icon** on any product
4. **Model should load** in the 3D viewer
5. **Interact**: Drag to rotate, scroll to zoom

### Troubleshooting

**Model doesn't load?**
- Check browser console for errors
- Verify file path is correct
- Ensure file is valid GLB format
- App will fallback to procedural model

**Model too big/small?**
- Adjust `scale` in `modelUrls.js`

**Model off-center?**
- Adjust `position` array

**Model looks dark?**
- Model might need better materials
- Try a different model with PBR textures

## 📦 Example: Adding a Shoe Model

### Step-by-Step

1. **Download Model**
   ```
   Go to Sketchfab → Search "nike shoe"
   → Filter: Downloadable, Free
   → Download as GLB
   ```

2. **Save File**
   ```
   Save as: public/models/nike-air-max.glb
   ```

3. **Test**
   ```
   Refresh app → Click product #1 → Click 3D cube icon
   ```

4. **Adjust (if needed)**
   ```javascript
   // In src/data/modelUrls.js
   1: {
     url: '/models/nike-air-max.glb',
     scale: 2.5,  // Make bigger
     position: [0, -1.5, 0]  // Lower position
   }
   ```

## 🎯 Recommended Free Models

### Shoes
- Search: "sneaker", "running shoe", "nike", "adidas"
- Tags: low-poly, pbr, game-ready

### Bags
- Search: "backpack", "handbag", "tote bag"
- Tags: fashion, accessory

### Watches
- Search: "watch", "smartwatch", "wristwatch"
- Tags: accessory, jewelry

### Clothes
- Search: "t-shirt", "jacket", "dress"
- Tags: clothing, fashion, rigged

## 🔄 Fallback System

**Don't have GLTF models yet?** No problem!

The app automatically uses **procedural 3D models** (created with Three.js geometry) if:
- GLTF file doesn't exist
- GLTF file fails to load
- Network error

You can mix and match:
- Some products with GLTF models
- Some products with procedural models

## 📝 Current Status

✅ **Implemented:**
- GLTF loader with useGLTF hook
- Automatic fallback to procedural models
- Error boundaries
- Loading states
- Model configuration system
- Color customization
- Auto-rotation
- Professional lighting

⏳ **Next Steps:**
1. Download GLTF models from free sources
2. Place in `public/models/` directory
3. Test in the app
4. Adjust scale/position if needed

## 🆘 Need Help?

### Resources
- **Three.js Docs**: https://threejs.org/docs/#examples/en/loaders/GLTFLoader
- **React Three Fiber**: https://docs.pmnd.rs/react-three-fiber
- **Drei useGLTF**: https://github.com/pmndrs/drei#usegltf
- **Sketchfab Help**: https://help.sketchfab.com/hc/en-us/articles/202512396-Downloading-Models

### Common Issues

**"Failed to load model"**
- File path incorrect
- File corrupted
- Network issue
- → App will use fallback model

**Model appears black**
- Missing textures
- Needs better lighting
- Try different model

**Performance issues**
- Model too complex (>100k polygons)
- Use lower poly model
- Optimize textures

## 🎉 You're All Set!

Your app now supports:
- ✅ Real GLTF 3D models
- ✅ Automatic fallbacks
- ✅ Professional rendering
- ✅ Interactive controls

Just add your GLTF files and enjoy photorealistic 3D product visualization! 🚀
