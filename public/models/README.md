# 3D Models Directory

This directory contains GLTF/GLB 3D model files for products.

## How to Add 3D Models

### Option 1: Download Free Models

1. **Sketchfab** (https://sketchfab.com)
   - Search for products (shoes, bags, watches, clothes)
   - Filter by "Downloadable" and "CC License"
   - Download as GLB format
   - Place files in this directory

2. **Poly Pizza** (https://poly.pizza)
   - Browse free 3D models
   - Download GLB files
   - Rename to match product names

3. **glTF Sample Models** (https://github.com/KhronosGroup/glTF-Sample-Models)
   - Official glTF test models
   - High quality examples

### Option 2: Create Your Own Models

Use 3D modeling software:
- **Blender** (Free) - Export as GLB
- **SketchUp** - Export as GLB
- **Tinkercad** - Export as GLB

### File Naming Convention

Place your GLB files with these names:
- `nike-air-max.glb` - Nike Air Max 270
- `adidas-ultraboost.glb` - Adidas Ultraboost
- `converse.glb` - Converse Chuck Taylor
- `tote-bag.glb` - Leather Tote Bag
- `backpack.glb` - Designer Backpack
- `crossbody.glb` - Crossbody Bag
- `tshirt.glb` - Classic T-Shirt
- `jacket.glb` - Denim Jacket
- `dress.glb` - Summer Dress
- `smartwatch.glb` - Smart Watch Pro
- `analog-watch.glb` - Classic Analog Watch
- `sport-watch.glb` - Sport Watch

### Model Requirements

- **Format**: GLB (preferred) or GLTF
- **Size**: Keep under 5MB per model
- **Polygon Count**: 10k-50k triangles recommended
- **Textures**: Embedded in GLB or separate files
- **Scale**: Will be adjusted in code
- **Orientation**: Y-up recommended

### Testing Your Models

1. Place GLB file in this directory
2. Update `src/data/modelUrls.js` if needed
3. Refresh the app
4. Click the 3D cube icon on a product
5. Model should load automatically

### Fallback System

If a GLTF model fails to load, the app will automatically fall back to procedural 3D models created with Three.js geometry.

### Example Free Models to Download

**Shoes:**
- Search "sneaker" or "running shoe" on Sketchfab
- Look for CC0 or CC-BY licensed models

**Bags:**
- Search "handbag", "backpack", or "tote bag"
- Download GLB format

**Watches:**
- Search "watch" or "smartwatch"
- Choose models with PBR materials

**Clothes:**
- Search "t-shirt", "jacket", or "dress"
- Look for rigged or static models

## Current Status

✅ GLTF loader implemented
✅ Automatic fallback to procedural models
✅ Error handling
✅ Loading states
⏳ Waiting for actual GLTF files to be added

## Need Help?

Check the documentation:
- Three.js GLTF Loader: https://threejs.org/docs/#examples/en/loaders/GLTFLoader
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
- useGLTF Hook: https://github.com/pmndrs/drei#usegltf
