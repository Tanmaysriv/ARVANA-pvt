import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true
  },
  name: String,
  brand: String,
  price: Number,
  originalPrice: Number,
  image: String,
  category: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
})

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  items: {
    type: [cartItemSchema],
    default: []
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

const Cart = mongoose.model('Cart', cartSchema)
export default Cart
