import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
    index: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    default: ''
  },
  product: {
    type: String,
    default: ''
  },
  verified: {
    type: Boolean,
    default: false
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  avatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

const Review = mongoose.model('Review', reviewSchema)
export default Review
