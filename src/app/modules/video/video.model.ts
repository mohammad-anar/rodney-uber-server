import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    url: {
      type: String,
      required: true,
    },

    thumbnail: String,

    duration: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Video = mongoose.model('Video', videoSchema);
