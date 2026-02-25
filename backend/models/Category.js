import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  categoryId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    default: '🛍️'
  }
}, {
  timestamps: true
})

const Category = mongoose.model('Category', categorySchema)
export default Category
