export const products = [
  // Shoes
  {
    id: 1,
    name: 'Nike Air Max 270',
    category: 'shoes',
    price: 150,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    description: 'Comfortable running shoes with air cushioning',
    colors: ['Black', 'White', 'Red'],
    sizes: ['7', '8', '9', '10', '11', '12']
  },
  {
    id: 2,
    name: 'Adidas Ultraboost',
    category: 'shoes',
    price: 180,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500',
    description: 'Premium running shoes with boost technology',
    colors: ['Black', 'White', 'Blue'],
    sizes: ['7', '8', '9', '10', '11', '12']
  },
  {
    id: 3,
    name: 'Converse Chuck Taylor',
    category: 'shoes',
    price: 65,
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=500',
    description: 'Classic canvas sneakers',
    colors: ['Black', 'White', 'Red'],
    sizes: ['6', '7', '8', '9', '10', '11']
  },
  
  // Bags
  {
    id: 4,
    name: 'Leather Tote Bag',
    category: 'bags',
    price: 120,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
    description: 'Elegant leather tote for everyday use',
    colors: ['Brown', 'Black', 'Tan'],
    sizes: ['One Size']
  },
  {
    id: 5,
    name: 'Designer Backpack',
    category: 'bags',
    price: 200,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    description: 'Modern backpack with laptop compartment',
    colors: ['Black', 'Navy', 'Gray'],
    sizes: ['One Size']
  },
  {
    id: 6,
    name: 'Crossbody Bag',
    category: 'bags',
    price: 85,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500',
    description: 'Compact crossbody for essentials',
    colors: ['Black', 'Brown', 'Red'],
    sizes: ['Small', 'Medium']
  },
  
  // Clothes
  {
    id: 7,
    name: 'Classic White T-Shirt',
    category: 'clothes',
    price: 29,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    description: 'Premium cotton t-shirt',
    colors: ['White', 'Black', 'Gray'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 8,
    name: 'Denim Jacket',
    category: 'clothes',
    price: 89,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500',
    description: 'Vintage style denim jacket',
    colors: ['Blue', 'Black', 'Light Blue'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 9,
    name: 'Summer Dress',
    category: 'clothes',
    price: 75,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
    description: 'Flowy summer dress',
    colors: ['Floral', 'White', 'Blue'],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  
  // Watches
  {
    id: 10,
    name: 'Smart Watch Pro',
    category: 'watches',
    price: 399,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    description: 'Advanced smartwatch with health tracking',
    colors: ['Black', 'Silver', 'Gold'],
    sizes: ['40mm', '44mm']
  },
  {
    id: 11,
    name: 'Classic Analog Watch',
    category: 'watches',
    price: 250,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500',
    description: 'Elegant analog timepiece',
    colors: ['Silver', 'Gold', 'Rose Gold'],
    sizes: ['One Size']
  },
  {
    id: 12,
    name: 'Sport Watch',
    category: 'watches',
    price: 150,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500',
    description: 'Durable sports watch',
    colors: ['Black', 'Blue', 'Red'],
    sizes: ['One Size']
  }
]

export const categories = [
  { id: 'all', name: 'All Products', icon: '🛍️' },
  { id: 'shoes', name: 'Shoes', icon: '👟' },
  { id: 'bags', name: 'Bags', icon: '👜' },
  { id: 'clothes', name: 'Clothes', icon: '👕' },
  { id: 'watches', name: 'Watches', icon: '⌚' }
]
