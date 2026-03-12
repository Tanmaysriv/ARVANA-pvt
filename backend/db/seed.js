import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import Review from '../models/Review.js'

dotenv.config()

const products = [
  {
    productId: 1,
    name: 'Nike Air Max 270',
    brand: 'Nike',
    category: 'shoes',
    price: 10799,
    originalPrice: 12999,
    rating: 4.7,
    reviewCount: 2340,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    description: 'Comfortable running shoes with air cushioning technology for all-day comfort',
    colors: ['Black', 'White', 'Red'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    badge: 'Bestseller',
    inStock: true
  },
  {
    productId: 2,
    name: 'Adidas Ultraboost',
    brand: 'Adidas',
    category: 'shoes',
    price: 13299,
    originalPrice: 14999,
    rating: 4.8,
    reviewCount: 1856,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500',
    description: 'Premium running shoes with boost technology for responsive cushioning',
    colors: ['Black', 'White', 'Blue'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    badge: 'New',
    inStock: true
  },
  {
    productId: 3,
    name: 'Converse Chuck Taylor',
    brand: 'Converse',
    category: 'shoes',
    price: 4599,
    originalPrice: 5399,
    rating: 4.5,
    reviewCount: 4120,
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=500',
    description: 'Classic canvas sneakers — timeless style for every occasion',
    colors: ['Black', 'White', 'Red'],
    sizes: ['6', '7', '8', '9', '10', '11'],
    badge: 'Sale',
    inStock: true
  },
  {
    productId: 4,
    name: 'Leather Tote Bag',
    brand: 'ARVANA',
    category: 'bags',
    price: 8299,
    originalPrice: 9999,
    rating: 4.6,
    reviewCount: 780,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
    description: 'Elegant leather tote for everyday use with spacious compartments',
    colors: ['Brown', 'Black', 'Tan'],
    sizes: ['One Size'],
    badge: null,
    inStock: true
  },
  {
    productId: 5,
    name: 'Crossbody Bag',
    brand: 'ARVANA',
    category: 'bags',
    price: 5799,
    originalPrice: 6999,
    rating: 4.3,
    reviewCount: 340,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500',
    description: 'Compact crossbody for essentials — perfect for on-the-go style',
    colors: ['Black', 'Brown', 'Red'],
    sizes: ['Small', 'Medium'],
    badge: 'Sale',
    inStock: true
  },
  {
    productId: 6,
    name: 'Classic White T-Shirt',
    brand: 'ARVANA',
    category: 'clothes',
    price: 2099,
    originalPrice: 2499,
    rating: 4.2,
    reviewCount: 1580,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    description: 'Premium 100% cotton t-shirt with a relaxed fit for everyday wear',
    colors: ['White', 'Black', 'Gray'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    badge: null,
    inStock: true
  },
  {
    productId: 7,
    name: 'Denim Jacket',
    brand: 'ARVANA',
    category: 'clothes',
    price: 6699,
    originalPrice: 7499,
    rating: 4.6,
    reviewCount: 920,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500',
    description: 'Vintage style denim jacket with a modern slim fit',
    colors: ['Blue', 'Black', 'Light Blue'],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'Bestseller',
    inStock: true
  },
  {
    productId: 8,
    name: 'Summer Dress',
    brand: 'ARVANA',
    category: 'clothes',
    price: 4999,
    originalPrice: 6299,
    rating: 4.5,
    reviewCount: 670,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
    description: 'Flowy summer dress with a flattering silhouette and breathable fabric',
    colors: ['Floral', 'White', 'Blue'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'New',
    inStock: true
  },
  {
    productId: 9,
    name: 'Smart Watch Pro',
    brand: 'ARVANA',
    category: 'watches',
    price: 28999,
    originalPrice: 34999,
    rating: 4.8,
    reviewCount: 3200,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    description: 'Advanced smartwatch with health tracking, GPS, and 5-day battery life',
    colors: ['Black', 'Silver', 'Gold'],
    sizes: ['40mm', '44mm'],
    badge: 'Bestseller',
    inStock: true
  },
  {
    productId: 10,
    name: 'Classic Analog Watch',
    brand: 'ARVANA',
    category: 'watches',
    price: 18299,
    originalPrice: 21999,
    rating: 4.7,
    reviewCount: 890,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500',
    description: 'Elegant analog timepiece with sapphire crystal and leather strap',
    colors: ['Silver', 'Gold', 'Rose Gold'],
    sizes: ['One Size'],
    badge: null,
    inStock: true
  },
  {
    productId: 11,
    name: 'Sport Watch',
    brand: 'ARVANA',
    category: 'watches',
    price: 10799,
    originalPrice: 12499,
    rating: 4.4,
    reviewCount: 1120,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500',
    description: 'Durable sports watch — water-resistant to 100m with stopwatch',
    colors: ['Black', 'Blue', 'Red'],
    sizes: ['One Size'],
    badge: 'Sale',
    inStock: true
  }
]

const categories = [
  { categoryId: 'all', name: 'All Products', icon: '🛍️' },
  { categoryId: 'shoes', name: 'Shoes', icon: '👟' },
  { categoryId: 'bags', name: 'Bags', icon: '👜' },
  { categoryId: 'clothes', name: 'Clothes', icon: '👕' },
  { categoryId: 'watches', name: 'Watches', icon: '⌚' }
]

const reviews = [
  {
    productId: 1,
    userName: 'Sarah J.',
    rating: 5,
    comment: "The AR try-on is incredible! I could see exactly how the sneakers looked on me before buying. No more guessing sizes.",
    verified: true,
    date: '2026-01-15',
    product: 'Nike Air Max 270',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    productId: 10,
    userName: 'Michael C.',
    rating: 5,
    comment: "I was hesitant to buy a watch online, but the virtual try-on showed me exactly how it looks on my wrist. Spot on!",
    verified: true,
    date: '2026-01-22',
    product: 'Smart Watch Pro',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    productId: 4,
    userName: 'Emma W.',
    rating: 5,
    comment: "Bought a bag for my mom using AR and it looked even better in person! Delivery was fast and packaging was gorgeous.",
    verified: true,
    date: '2026-02-01',
    product: 'Leather Tote Bag',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    productId: 2,
    userName: 'David R.',
    rating: 4,
    comment: "Great shoes, super comfortable. The AR try-on helped me pick the right color. Only wish there were more sizes.",
    verified: true,
    date: '2026-02-05',
    product: 'Adidas Ultraboost',
    avatar: 'https://i.pravatar.cc/150?img=7'
  },
  {
    productId: 8,
    userName: 'Lisa K.',
    rating: 5,
    comment: "This denim jacket fits perfectly. The virtual try-on was so accurate — what you see is what you get!",
    verified: true,
    date: '2026-02-08',
    product: 'Denim Jacket',
    avatar: 'https://i.pravatar.cc/150?img=9'
  }
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    await Product.deleteMany({})
    await Category.deleteMany({})
    await Review.deleteMany({})
    console.log('🗑️  Cleared existing data')

    // Insert seed data
    await Product.insertMany(products)
    console.log(`📦 Seeded ${products.length} products`)

    await Category.insertMany(categories)
    console.log(`📂 Seeded ${categories.length} categories`)

    await Review.insertMany(reviews)
    console.log(`⭐ Seeded ${reviews.length} reviews`)

    console.log('\n✅ Database seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed error:', error.message)
    process.exit(1)
  }
}

seed()
