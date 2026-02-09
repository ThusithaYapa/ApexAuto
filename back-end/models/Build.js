const mongoose = require('mongoose');

const buildSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    carModel: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      default: '#ffffff',
    },
    selectedParts: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

buildSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Build', buildSchema);
