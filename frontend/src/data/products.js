export const products = [
  // Shoes
  {
    id: 1,
    name: 'Nike Air Max 270',
    brand: 'Nike',
    category: 'shoes',
    price: 10799,
    originalPrice: 12999,
    rating: 4.7,
    reviewCount: 2340,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500',
      'https://images.unsplash.com/photo-1552346154-21d32810baa3?w=500'
    ],
    description: 'Comfortable running shoes with air cushioning technology for all-day comfort',
    colors: ['Black', 'White', 'Red'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    badge: 'Bestseller',
    inStock: true
  },
  {
    id: 2,
    name: 'Adidas Ultraboost',
    brand: 'Adidas',
    category: 'shoes',
    price: 13299,
    originalPrice: 14999,
    rating: 4.8,
    reviewCount: 1856,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500',
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500',
      'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=500',
      'https://images.unsplash.com/photo-1584735174965-48c48d7028a9?w=500'
    ],
    description: 'Premium running shoes with boost technology for responsive cushioning',
    colors: ['Black', 'White', 'Blue'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    badge: 'New',
    inStock: true
  },
  {
    id: 3,
    name: 'Converse Chuck Taylor',
    brand: 'Converse',
    category: 'shoes',
    price: 4599,
    originalPrice: 5399,
    rating: 4.5,
    reviewCount: 4120,
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=500',
    images: [
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=500',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500',
      'https://images.unsplash.com/photo-1610486303254-8c8861fb16a1?w=500'
    ],
    description: 'Classic canvas sneakers — timeless style for every occasion',
    colors: ['Black', 'White', 'Red'],
    sizes: ['6', '7', '8', '9', '10', '11'],
    badge: 'Sale',
    inStock: true
  },

  // Bags
  {
    id: 4,
    name: 'Leather Tote Bag',
    brand: 'ARVANA',
    category: 'bags',
    price: 8299,
    originalPrice: 9999,
    rating: 4.6,
    reviewCount: 780,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500',
      'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500'
    ],
    description: 'Elegant leather tote for everyday use with spacious compartments',
    colors: ['Brown', 'Black', 'Tan'],
    sizes: ['One Size'],
    badge: null,
    inStock: true
  },
  {
    id: 5,
    name: 'Crossbody Bag',
    brand: 'ARVANA',
    category: 'bags',
    price: 5799,
    originalPrice: 6999,
    rating: 4.3,
    reviewCount: 340,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500',
      'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500'
    ],
    description: 'Compact crossbody for essentials — perfect for on-the-go style',
    colors: ['Black', 'Brown', 'Red'],
    sizes: ['Small', 'Medium'],
    badge: 'Sale',
    inStock: true
  },

  // Clothes
  {
    id: 6,
    name: 'Classic White T-Shirt',
    brand: 'ARVANA',
    category: 'clothes',
    price: 2099,
    originalPrice: 2499,
    rating: 4.2,
    reviewCount: 1580,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500'
    ],
    description: 'Premium 100% cotton t-shirt with a relaxed fit for everyday wear',
    colors: ['White', 'Black', 'Gray'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    badge: null,
    inStock: true
  },
  {
    id: 7,
    name: 'Denim Jacket',
    brand: 'ARVANA',
    category: 'clothes',
    price: 6699,
    originalPrice: 7499,
    rating: 4.6,
    reviewCount: 920,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=500'
    ],
    description: 'Vintage style denim jacket with a modern slim fit',
    colors: ['Blue', 'Black', 'Light Blue'],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'Bestseller',
    inStock: true
  },
  {
    id: 8,
    name: 'Summer Dress',
    brand: 'ARVANA',
    category: 'clothes',
    price: 4999,
    originalPrice: 6299,
    rating: 4.5,
    reviewCount: 670,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500',
      'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500'
    ],
    description: 'Flowy summer dress with a flattering silhouette and breathable fabric',
    colors: ['Floral', 'White', 'Blue'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'New',
    inStock: true
  },

  // Watches
  {
    id: 9,
    name: 'Smart Watch Pro',
    brand: 'ARVANA',
    category: 'watches',
    price: 28999,
    originalPrice: 34999,
    rating: 4.8,
    reviewCount: 3200,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500'
    ],
    description: 'Advanced smartwatch with health tracking, GPS, and 5-day battery life',
    colors: ['Black', 'Silver', 'Gold'],
    sizes: ['40mm', '44mm'],
    badge: 'Bestseller',
    inStock: true
  },
  {
    id: 10,
    name: 'Classic Analog Watch',
    brand: 'ARVANA',
    category: 'watches',
    price: 18299,
    originalPrice: 21999,
    rating: 4.7,
    reviewCount: 890,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500',
      'https://images.unsplash.com/photo-1587836141338-04e339b36d0b?w=500',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500'
    ],
    description: 'Elegant analog timepiece with sapphire crystal and leather strap',
    colors: ['Silver', 'Gold', 'Rose Gold'],
    sizes: ['One Size'],
    badge: null,
    inStock: true
  },
  {
    id: 11,
    name: 'Sport Watch',
    brand: 'ARVANA',
    category: 'watches',
    price: 10799,
    originalPrice: 12499,
    rating: 4.4,
    reviewCount: 1120,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500'
    ],
    description: 'Durable sports watch — water-resistant to 100m with stopwatch',
    colors: ['Black', 'Blue', 'Red'],
    sizes: ['One Size'],
    badge: 'Sale',
    inStock: true
  }
]

export const categories = [
  { id: 'all', name: 'All Products', icon: '🛍️' },
  { id: 'shoes', name: 'Shoes', icon: '👟' },
  { id: 'bags', name: 'Bags', icon: '👜' },
  { id: 'clothes', name: 'Clothes', icon: '👕' },
  { id: 'watches', name: 'Watches', icon: '⌚' }
]
