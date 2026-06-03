const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['lost', 'found'], required: true },
  category: { type: String, required: true },
  itemType: { type: String },
  brand: { type: String },
  color: { type: String },
  location: { type: String, required: true },
  image: { type: String }, // Cloudinary URL
  date: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  aiTags: { type: [String], default: [] },
  embedding: { type: [Number], default: [] }, // Important for future AI
  status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  lostItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Item', itemSchema);
