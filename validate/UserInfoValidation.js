import mongoose from 'mongoose';

const userInfoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'User'
  },
  height: {
    type: Number,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  currentWeight: {
    type: Number,
    required: true
  },
  desiredWeight: {
    type: Number,
    required: true
  },
  bloodType: {
    type: String,
    required: true
  },
  calorieIntake: {
    type: Number,
    default: 2800 
  },
  notRecommendedProducts: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const UserInfo = mongoose.model('UserInfo', userInfoSchema);
export default UserInfo;
