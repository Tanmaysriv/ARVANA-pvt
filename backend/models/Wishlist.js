import mongoose from 'mongoose'

const wishlistItemSchema = new mongoose.Schema({
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
  addedAt: {
    type: Date,
    default: Date.now
  }
})

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  items: {
    type: [wishlistItemSchema],
    default: []
  }
}, {
  timestamps: true
})

const Wishlist = mongoose.model('Wishlist', wishlistSchema)
export default Wishlist
