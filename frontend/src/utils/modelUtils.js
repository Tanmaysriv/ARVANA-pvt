/**
 * Utility functions for 3D Model Generation
 */

// Color name to hex conversion map
export const colorNameToHex = (colorName) => {
  const colorMap = {
    'Black': '#1f2937',
    'White': '#f9fafb',
    'Red': '#ef4444',
    'Blue': '#3b82f6',
    'Navy': '#1e3a8a',
    'Gray': '#6b7280',
    'Brown': '#92400e',
    'Tan': '#d2b48c',
    'Silver': '#c0c0c0',
    'Gold': '#ffd700',
    'Rose Gold': '#b76e79',
    'Light Blue': '#93c5fd',
    'Floral': '#ec4899',
    'Dark Gray': '#374151',
    'Light Gray': '#d1d5db',
    'Beige': '#f5f5dc',
    'Cream': '#fffdd0',
    'Green': '#22c55e',
    'Dark Green': '#166534',
    'Pink': '#ec4899',
    'Purple': '#a855f7',
    'Orange': '#f97316',
    'Yellow': '#eab308',
  }
  
  // If it's already a hex color, return as is
  if (colorName?.startsWith('#')) {
    return colorName
  }
  
  return colorMap[colorName] || colorName || '#3b82f6'
}

/**
 * Get appropriate scale and position for a model based on category
 * Can be overridden by product-specific settings
 */
export const getCategoryDefaults = (category) => {
  const defaults = {
    shoes: {
      scale: 1.5,
      position: [0, -0.5, 0],
      lighting: 'neutral'
    },
    bags: {
      scale: 1.2,
      position: [0, -1, 0],
      lighting: 'warm'
    },
    clothes: {
      scale: 1.3,
      position: [0, -0.5, 0],
      lighting: 'neutral'
    },
    watch: {
      scale: 3,
      position: [0, 0, 0],
      lighting: 'bright'
    },
    watches: {
      scale: 3,
      position: [0, 0, 0],
      lighting: 'bright'
    },
    accessories: {
      scale: 2,
      position: [0, 0, 0],
      lighting: 'bright'
    },
    jewellery: {
      scale: 2.5,
      position: [0, 0, 0],
      lighting: 'bright'
    },
    jewelry: {
      scale: 2.5,
      position: [0, 0, 0],
      lighting: 'bright'
    },
  }
  
  return defaults[category?.toLowerCase()] || {
    scale: 1,
    position: [0, 0, 0],
    lighting: 'neutral'
  }
}

/**
 * Generate a unique cache key for a product's 3D model
 * Useful for caching generated models
 */
export const generateModelCacheKey = (productId, category, color) => {
  return `model-${productId}-${category}-${color}`.toLowerCase().replace(/\s+/g, '-')
}

/**
 * Detect if a color is dark or light
 * Useful for automated material adjustments
 */
export const isDarkColor = (hexColor) => {
  if (!hexColor || !hexColor.startsWith('#')) return false
  
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness < 128
}

/**
 * Map product types to their appropriate 3D representations
 */
export const productTypeToCategory = (productType) => {
  const typeMap = {
    'shoe': 'shoes',
    'shoes': 'shoes',
    'sneaker': 'shoes',
    'boot': 'shoes',
    'sandal': 'shoes',
    
    'bag': 'bags',
    'bags': 'bags',
    'backpack': 'bags',
    'tote': 'bags',
    'crossbody': 'bags',
    
    'shirt': 'clothes',
    'clothes': 'clothes',
    'clothing': 'clothes',
    't-shirt': 'clothes',
    'tshirt': 'clothes',
    'jacket': 'clothes',
    'coat': 'clothes',
    'dress': 'clothes',
    'pants': 'clothes',
    'jeans': 'clothes',
    
    'watch': 'watches',
    'watches': 'watches',
    'smartwatch': 'watches',
    
    'ring': 'jewelry',
    'necklace': 'jewelry',
    'bracelet': 'jewelry',
    'earring': 'jewelry',
    'jewelry': 'jewelry',
    'jewellery': 'jewelry',
    'accessory': 'accessories',
    'accessories': 'accessories',
  }
  
  return typeMap[productType?.toLowerCase()] || 'accessories'
}

/**
 * Generate a model component based on product category
 * @param {string} category - Product category
 * @returns {React.Component} React component for the 3D model (imported from modelGenerator)
 */
// This function is re-exported from modelGenerator.jsx
// It's defined there because it needs access to the component definitions
