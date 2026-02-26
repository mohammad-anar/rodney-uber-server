import mongoose from 'mongoose';

const checkEmailSchema = new mongoose.Schema({
  oneTimeCode: {
    type: Number,
    default: null,
    required: true,
  },
  expireAt: {
    type: Date,
    default: null,
    required: true,
  },
});

export const CheckEmail = mongoose.model('CheckEmail', checkEmailSchema);
