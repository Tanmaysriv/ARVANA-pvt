import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from './backend/models/User.js'
import Product from './backend/models/Product.js'

dotenv.config({ path: './backend/.env' })

const testStockUpdate = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://arvana:arvana123@ac-bnwkqlw.bbmggek.mongodb.net/arvana?retryWrites=true&w=majority')
    console.log('✅ Connected to MongoDB')

    // Find a seller
    const seller = await User.findOne({ role: 'seller', sellerStatus: 'approved' })
    if (!seller) {
      console.log('❌ No approved sellers found')
      process.exit(1)
    }
    console.log(`✅ Found seller: ${seller._id} (${seller.name})`)

    // Find products by this seller
    const products = await Product.find({ seller: seller._id }).limit(5)
    if (products.length === 0) {
      console.log('❌ No products found for this seller')
      process.exit(1)
    }
    console.log(`✅ Found ${products.length} products`)

    // Test updating the first product
    const product = products[0]
    console.log(`\n📦 Testing product: ${product.name} (${product._id})`)
    console.log(`   Current stock: ${product.stock}`)

    // Update stock
    const newStock = (product.stock || 0) + 10
    product.stock = newStock
    await product.save()

    console.log(`   New stock: ${product.stock}`)
    console.log(`   inStock flag: ${product.inStock}`)
    console.log('✅ Stock update successful!')

    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

testStockUpdate()
