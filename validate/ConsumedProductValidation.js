import mongoose from 'mongoose';

const consumedProductSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  consumedDate: {
    type: Date,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const ConsumedProduct = mongoose.model('ConsumedProduct', consumedProductSchema);
export default ConsumedProduct;