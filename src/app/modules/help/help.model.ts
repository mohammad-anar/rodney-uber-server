import mongoose from 'mongoose';

const helpRequestSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    helpAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    supportingDocument: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);
