import mongoose from 'mongoose';
import { HelpRequestStatus } from './help.interfaces';

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
    status: {
      type: String,
      enum: Object.values(HelpRequestStatus),
      default: HelpRequestStatus.UNDER_REVIEW,
    },

    supportingDocument: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true, versionKey: false },
);

export const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);
