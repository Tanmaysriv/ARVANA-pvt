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
    scale: 2,
    position: [0, -1, 0]
  },
  2: {
    // Adidas Ultraboost
    url: '/models/adidas-ultraboost.glb',
    fallbackUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/running-shoe.glb',
    scale: 2,
    position: [0, -1, 0]
  },
  3: {
    // Converse Chuck Taylor
    url: '/models/converse.glb',
    fallbackUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/sneaker.glb',
    scale: 2,
    position: [0, -1, 0]
  },

  // Bags
  4: {
    // Leather Tote Bag
    url: '/models/tote-bag.glb',
    fallbackUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bag.glb',
    scale: 1.5,
    position: [0, 0, 0]
  },
  5: {
    // Designer Backpack
    url: '/models/backpack.glb',
    fallbackUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/backpack.glb',
    scale: 1.5,
    position: [0, 0, 0]
  },
  6: {
    // Crossbody Bag
    url: '/models/crossbody.glb',
    fallbackUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/handbag.glb',
    scale: 1.5,
    position: [0, 0, 0]
  },

  // Clothes
  7: {
    // Classic T-Shirt
    url: '/models/tshirt.glb',
    fallbackUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tshirt.glb',
    scale: 1.8,
    position: [0, 0, 0]
  },
  8: {
    // Denim Jacket
    url: '/models/jacket.glb',
    fallbackUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/jacket.glb',
    scale: 1.8,
    position: [0, 0, 0]
  },
  9: {
    // Summer Dress
    url: '/models/dress.glb',
    fallbackUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/dress.glb',
    scale: 1.8,
    position: [0, 0, 0]
  },

  // Watches
  10: {
    // Smart Watch Pro
    url: '/models/smartwatch.glb',
    fallbackUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/watch.glb',
    scale: 3,
    position: [0, 0, 0]
  },
  11: {
    // Classic Analog Watch
    url: '/models/analog-watch.glb',
    fallbackUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/classic-watch.glb',
    scale: 3,
    position: [0, 0, 0]
  },
  12: {
    // Sport Watch
    url: '/models/sport-watch.glb',
    fallbackUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/sport-watch.glb',
    scale: 3,
    position: [0, 0, 0]
  }
}

// Helper function to get model config
export const getModelConfig = (productId) => {
  return modelUrls[productId] || modelUrls[1]
}
