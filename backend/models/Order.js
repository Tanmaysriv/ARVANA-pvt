import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: { type: String, required: true },
  brand: String,
  price: { type: Number, required: true },
  originalPrice: Number,
  image: String,
  category: String,
  size: String,
  color: String,
  quantity: {
    type: Number,
    min: 1,
    default: 1,
  },
})

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: 'India' },
}, { _id: false })

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  sellers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  items: {
    type: [orderItemSchema],
    required: true,
    validate: [arr => arr.length > 0, 'Order must have at least one item'],
  },
  shippingAddress: {
    type: addressSchema,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'card', 'upi', 'whatsapp'],
    default: 'cod',
  },
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  estimatedDelivery: { type: Date },
}, {
  timestamps: true,
})

const Order = mongoose.model('Order', orderSchema)
export default Order
