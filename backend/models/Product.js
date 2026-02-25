import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['shoes', 'bags', 'clothes', 'watches']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  colors: {
    type: [String],
    default: []
  },
  sizes: {
    type: [String],
    default: []
  },
  badge: {
    type: String,
    default: null
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Text index for search
productSchema.index({ name: 'text', brand: 'text', description: 'text' })

const Product = mongoose.model('Product', productSchema)
export default Product
