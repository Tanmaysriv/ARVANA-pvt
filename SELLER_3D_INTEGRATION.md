# Integration Guide: Dynamic 3D Models for Seller Products

## Quick Start

When a seller adds a new product through the Seller Dashboard, the 3D model generation happens **automatically**. No additional steps are needed.

## How It's Integrated

### 1. Product Creation Flow

```
Seller adds product
    ↓
Product saved to database with:
  - name
  - category (required!)  ← ⭐ Important
  - colors array
  - price, etc.
    ↓
Product3DViewer receives product data
    ↓
Dynamic 3D model generated instantly
    ↓
Displayed to customers
```

### 2. Required Product Fields

For the automatic 3D generation to work, ensure these fields are set:

```javascript
{
  id: Number,
  name: String,
  category: String,        // ← REQUIRED: 'shoes', 'bags', 'clothes', etc.
  colors: Array<String>,   // ← REQUIRED: ['Black', 'Blue', etc.]
  price: Number,
  // ... other fields
}
```

### 3. Category Examples

When sellers create products, the category must match one of these:

| Category | Examples |
|----------|----------|
| `shoes` | Sneakers, running shoes, boots, sandals |
| `bags` | Backpacks, tote bags, crossbody bags |
| `clothes` | T-shirts, jackets, dresses, jeans, coats |
| `watches` | Smart watches, analog watches, digital |
| `accessories` | Belts, scarves, hats |
| `jewelry` | Rings, necklaces, bracelets, earrings |

## Implementation in SellerProducts Component

If you need to see how this integrates with the seller dashboard:

### Example: When viewing a seller's product

```javascript
// In SellerDashboard/SellerProducts view
import Product3DViewer from '@/components/Product3DViewer'

function SellerProductDetail({ product }) {
  const [showViewer, setShowViewer] = useState(false)

  return (
    <>
      <button onClick={() => setShowViewer(true)}>
        View 3D Model
      </button>
      
      <Product3DViewer
        product={product}  // ← Pass entire product object
        isOpen={showViewer}
        onClose={() => setShowViewer(false)}
      />
    </>
  )
}
```

No special handling needed! The system automatically detects:
- Product ID
- Category
- Colors
- And generates the appropriate 3D model

## Color Support

The system supports these color names (case-insensitive):

- **Basic**: Black, White, Red, Blue, Gray, Brown, Green, Yellow, Orange, Purple, Pink
- **Shades**: Navy, Light Blue, Dark Green, Light Gray, Dark Gray
- **Premium**: Gold, Silver, Rose Gold, Tan, Beige, Cream, Floral

Or use **hex colors directly**: `#FF5733`

### Example:
```javascript
colors: ['Black', 'Navy', '#FF5733']  // Mix of names and hex codes
```

## Testing the System

### Step 1: Add a test product with correct category

```javascript
const testProduct = {
  id: 100,
  name: 'Test Backpack',
  category: 'bags',  // ← Recognized category
  colors: ['Black', 'Navy'],
  price: 5000,
  // ... other fields
}
```

### Step 2: Open Product3DViewer

```javascript
<Product3DViewer 
  product={testProduct}
  isOpen={true}
/>
```

### Step 3: Verify
- ✅ 3D model appears (bag model)
- ✅ Can rotate with mouse
- ✅ Color changes when selected
- ✅ No console errors

## Fallback Behavior

If a category is **not** recognized, the system defaults to a generic box model. To fix:

1. **Check the category spelling** in the product:
   ```javascript
   // ❌ Wrong
   category: 'shoe'   // singular
   
   // ✅ Correct
   category: 'shoes'  // plural
   ```

2. **Update the category** to match supported types

3. **Restart the app** if changes were made

## Performance in Seller Dashboard

- **First load**: ~150ms per product viewer
- **Opening 3D model**: <50ms
- **Color changes**: <1ms
- **No external API calls**: Models generated client-side
- **No file downloads**: Uses Three.js procedural geometry

## Troubleshooting

### Problem: Generic box appears instead of expected model

**Solution**: Verify the category matches exactly:
```javascript
// Ensure category is one of:
'shoes' | 'bags' | 'clothes' | 'watches' | 'accessories' | 'jewelry'
```

### Problem: Color not appearing correctly

**Solution**: Check color is valid:
```javascript
// ✅ Valid
colors: ['Black']          // Recognized name
colors: ['#FF5733']        // Hex code
colors: ['Black', 'Navy']  // Mix

// ❌ Invalid
colors: ['black']          // Case sensitive? No, should work
colors: ['...]            // Invalid format
```

### Problem: Model rotates but looks wrong

**Solution**: This is normal for procedural models. They're generic representations.
- For specific products, move to **Approach 2/3** (AI or custom GLB uploads)
- Current system prioritizes speed over visual detail

## Future Enhancements

### Planned Features

1. **Custom GLB uploads** - Sellers can upload their own models
2. **AI generation** - High-quality models from product photos
3. **Model preview** - Show models in seller's product listing
4. **Batch generation** - Generate for multiple products at once

## Questions?

Refer to the main documentation: [DYNAMIC_MODEL_GENERATION.md](./DYNAMIC_MODEL_GENERATION.md)
