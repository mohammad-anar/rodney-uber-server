import { Schema, model, Types } from 'mongoose';

const notificationSchema = new Schema(
  {
    user: {
      type: String,

      required: true,
    },

    type: {
      type: String,
      enum: ['ORDER'],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    data: {
      type: Schema.Types.Mixed,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Notification = model('Notification', notificationSchema);
