const mongoose = require('mongoose');

const claimRequestSchema = new mongoose.Schema({
  claimantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foundItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  lostItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  identifyingDetail: { type: String, required: true },
  message: { type: String },
  proofImage: { type: String }, // Cloudinary URL
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ClaimRequest', claimRequestSchema);
