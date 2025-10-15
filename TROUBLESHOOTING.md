# Troubleshooting Guide

## TensorFlow.js Issues

### Error: "Could not resolve @tensorflow/tfjs-backend-webgpu"

**Cause**: The TensorFlow models try to import WebGPU backend which is not installed.

**Solution**: 

1. **Stop the dev server** (Ctrl+C)

2. **Clear Vite cache** - Choose one method:
   
   **Method A - Windows Batch Script:**
   ```bash
   clear-cache.bat
   ```
   
   **Method B - Manual deletion:**
   - Navigate to `d:\ARVANA\node_modules\.vite`
   - Delete the `.vite` folder
   - Run `npm run dev`
   
   **Method C - NPM script:**
   ```bash
   npm run dev:clean
   ```

3. **Restart the dev server**:
   ```bash
   npm run dev
   ```

The Vite configuration now aliases WebGPU to WebGL, so the app will use WebGL backend instead.

### Error: "504 Outdated Optimize Dep"

**Cause**: Vite's dependency optimization cache is stale.

**Solution**: Same as above - clear the Vite cache.

### Error: Model loading fails or takes too long

**Possible causes and solutions**:

1. **Network issues** - Models load from CDN
   - Check internet connection
   - Check browser console for CORS errors
   - Try using a VPN if CDN is blocked

2. **Browser compatibility**
   - Ensure WebGL is supported: Visit `https://get.webgl.org/`
   - Try a different browser (Chrome/Edge recommended)
   - Update graphics drivers

3. **Memory issues**
   - Close other tabs/applications
   - Increase `frameSkip` in `useARDetection.js`
   - Restart browser

### Error: High memory usage or crashes

**Solutions**:

1. **Increase frame skipping**:
   ```javascript
   // In src/hooks/useARDetection.js
   const INFERENCE_CONFIG = {
     frameSkip: 3, // Increase from 2 to 3 or 4
     minConfidence: 0.5,
     maxPoses: 1,
     maxHands: 2
   }
   ```

2. **Reduce video resolution**:
   ```javascript
   // In src/components/ARTryOn.jsx
   const stream = await navigator.mediaDevices.getUserMedia({
     video: {
       width: { ideal: 640 },  // Reduced from 1280
       height: { ideal: 480 }, // Reduced from 720
       facingMode: 'user'
     }
   })
   ```

3. **Clear browser cache**:
   - Chrome: Ctrl+Shift+Delete
   - Clear cached images and files
   - Restart browser

### Error: Low FPS or laggy detection

**Solutions**:

1. **Increase frame skipping** (see above)

2. **Close other applications** using GPU

3. **Check GPU acceleration**:
   - Chrome: Visit `chrome://gpu`
   - Ensure "WebGL" and "WebGL2" are enabled

4. **Use lighter models** (already configured):
   - Pose: MoveNet SINGLEPOSE_LIGHTNING ✓
   - Hand: MediaPipeHands Lite ✓

## Camera Issues

### Error: "Unable to access camera"

**Solutions**:

1. **Grant camera permissions**:
   - Click the camera icon in browser address bar
   - Allow camera access
   - Refresh the page

2. **Check if camera is in use**:
   - Close other apps using camera (Zoom, Teams, etc.)
   - Restart browser

3. **Check browser settings**:
   - Chrome: Settings > Privacy and security > Site Settings > Camera
   - Ensure camera is not blocked

### Error: Camera shows black screen

**Solutions**:

1. **Check camera hardware**:
   - Test camera in another app
   - Restart computer

2. **Update drivers**:
   - Update webcam drivers
   - Update graphics drivers

## Build Issues

### Error: Build fails with TensorFlow errors

**Solution**:

1. **Clear node_modules and reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Clear Vite cache**:
   ```bash
   rm -rf node_modules/.vite
   ```

3. **Try building again**:
   ```bash
   npm run build
   ```

## Performance Optimization

### For slower devices:

1. **Increase frame skip to 4**:
   ```javascript
   frameSkip: 4
   ```

2. **Reduce video resolution to 640x480**

3. **Disable smoothing**:
   ```javascript
   // In loadPoseModel()
   enableSmoothing: false
   ```

### For faster devices:

1. **Decrease frame skip to 1**:
   ```javascript
   frameSkip: 1
   ```

2. **Increase video resolution to 1920x1080**

3. **Use full models** (not recommended for real-time):
   ```javascript
   modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER
   ```

## Quick Fixes Checklist

- [ ] Stop dev server
- [ ] Delete `node_modules/.vite` folder
- [ ] Run `npm run dev:clean`
- [ ] Clear browser cache
- [ ] Check camera permissions
- [ ] Verify WebGL support
- [ ] Close other GPU-intensive apps
- [ ] Restart browser
- [ ] Restart computer (if all else fails)

## Getting Help

If issues persist:

1. Check browser console for errors (F12)
2. Check `tf.memory()` output in console
3. Verify TensorFlow backend: Should show "webgl"
4. Check network tab for failed model downloads
5. Review `TENSORFLOW_OPTIMIZATION.md` for configuration details

## Useful Commands

```bash
# Start dev server
npm run dev

# Start with cache clearing
npm run dev:clean

# Clear cache (Windows)
clear-cache.bat

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Browser Console Commands

```javascript
// Check TensorFlow backend
tf.getBackend()

// Check memory usage
tf.memory()

// List available backends
tf.engine().registryFactory

// Force backend switch
await tf.setBackend('webgl')
```
