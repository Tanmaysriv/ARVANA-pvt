// 3D Model URLs - You can replace these with your own GLTF/GLB files
// Free 3D models can be found at:
// - https://sketchfab.com (CC licensed models)
// - https://poly.pizza (free 3D models)
// - https://market.pmnd.rs (React Three Fiber models)
// - https://github.com/KhronosGroup/glTF-Sample-Models

export const modelUrls = {
  // Shoes
  1: {
    // Nike Air Max - Replace with actual model URL
    url: '/models/nike-air-max.glb',
    fallbackUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/nike-shoe.glb',
    scale: 0.1,
    position: [0, -1, -1]
  },
  2: {
    // Adidas Ultraboost
    url: '/models/adidas-ultraboost.glb',
    fallbackUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/running-shoe.glb',
    scale: 1.5,
    position: [0, -1, 0]
  },
  3: {
    // Converse Chuck Taylor
    url: '/models/converse.glb',
    fallbackUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/sneaker.glb',
    scale: 2,
    position: [0,0,0]
  },

  // Bags
  4: {
    // Leather Tote Bag
    url: '/models/tote-bag.glb',
    fallbackUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bag.glb',
    scale: 3,
    position: [0, 0, 0]
  },
  
  5: {
    // Crossbody Bag
    url: '/models/crossbody.glb',
    fallbackUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/handbag.glb',
    scale: 1,
    position: [0, -3, 0]
  },

  // Clothes
  6: {
    // Classic T-Shirt
    url: '/models/tshirt.glb',
    fallbackUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tshirt.glb',
    scale: 0.1,
    position: [0,-3,0]
  },
  7: {
    // Denim Jacket
    url: '/models/jacket.glb',
    fallbackUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/jacket.glb',
    scale: 7.5,
    position: [0,0,0]
  },
  8: {
    // Summer Dress
    url: '/models/dress.glb',
    fallbackUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/dress.glb',
    scale: 6,
    position: [0,-7,0]
  },

  // Watches
  9: {
    // Smart Watch Pro
    url: '/models/smartwatch.glb',
    fallbackUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/watch.glb',
    scale: 0.8,
    position: [0, -2, 0]
  },
  10: {
    // Classic Analog Watch
    url: '/models/analog-watch.glb',
    fallbackUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/classic-watch.glb',
    scale: 0.8,
    position: [0, -1, 0]
  },
  11: {
    // Sport Watch
    url: '/models/sport-watch.glb',
    fallbackUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/sport-watch.glb',
    scale: 50,
    position: [0, 0, 0]
  }
}

// Helper function to get model config
export const getModelConfig = (productId) => {
  return modelUrls[productId] || modelUrls[1]
}