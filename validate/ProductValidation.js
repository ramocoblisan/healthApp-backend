import mongoose from 'mongoose';

export const productSchema = new mongoose.Schema({
  categories: {
    type: String,
  },
  weight: {
    type: Number,
  },
  title: {
    type: String,
  },
  calories: {
    type: Number,
  },
  groupBloodNotAllowed: {
    type: [Boolean],
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema, 'productsDB');
export default Product;
