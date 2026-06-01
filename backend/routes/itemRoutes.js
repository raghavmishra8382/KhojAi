const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Item = require('../models/Item');
const auth = require('../middleware/authMiddleware');
const { generateEmbedding } = require('../services/embeddingService');
const { findMatches } = require('../services/matchingService');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'khojai_items',
    allowedFormats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

const upload = multer({ storage: storage });

// @route   POST /api/items
// @desc    Create an item (with image upload)
// @access  Private
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, type, category, location, date } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = req.file.path; // URL from Cloudinary
    }

    const newItem = new Item({
      title,
      description,
      type,
      category,
      location,
      image: imageUrl,
      date,
      user: req.user.id, // from auth middleware
    });

    // Generate embedding before saving
    const embedding = await generateEmbedding(newItem);
    if (embedding && embedding.length > 0) {
      newItem.embedding = embedding;
    }

    const savedItem = await newItem.save();

    // Auto-match if this is a found item
    if (type === 'found') {
      try {
        const matches = await findMatches(savedItem);
        // Notify the top 3 highly likely matches
        const topMatches = matches.slice(0, 3);
        const Notification = require('../models/Notification');
        
        for (const match of topMatches) {
          if (match.score > 0.6 && match.item.user) {
            const notification = new Notification({
              userId: match.item.user,
              title: 'Possible Match Found! 🔍',
              message: `A newly found item "${savedItem.title}" matches the description of your lost item "${match.item.title}". Check your matches!`
            });
            await notification.save();
          }
        }
      } catch (matchErr) {
        console.error("Error generating matches on creation:", matchErr);
      }
    }

    res.json(savedItem);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/items/quick-found
// @desc    Quickly post a found item and notify the lost item owner
// @access  Private
router.post('/quick-found', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, location, date, lostItemId } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = req.file.path;
    }

    const newItem = new Item({
      title,
      description,
      type: 'found',
      category,
      location,
      image: imageUrl,
      date,
      user: req.user.id,
    });

    const embedding = await generateEmbedding(newItem);
    if (embedding && embedding.length > 0) {
      newItem.embedding = embedding;
    }

    const savedItem = await newItem.save();

    // Notify original lost-item owner
    if (lostItemId) {
      const lostItem = await Item.findById(lostItemId).populate('user');
      if (lostItem && lostItem.user) {
        const Notification = require('../models/Notification');
        const notification = new Notification({
          userId: lostItem.user._id,
          title: 'Someone may have found your item!',
          message: `A user just reported finding an item that matches your lost post: "${lostItem.title}". Check your matches!`,
        });
        await notification.save();
      }
    }

    res.json(savedItem);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/items
// @desc    Get all items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 }).populate('user', 'name');
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/items/:id
// @desc    Get item by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('user', '_id name email');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ message: 'Item not found' });
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/items/:id/matches
// @desc    Get AI matches for an item
// @access  Public
router.get('/:id/matches', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    const matches = await findMatches(item);
    res.json(matches);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ message: 'Item not found' });
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/items/:id/resolve
// @desc    Mark an item as resolved (returned successfully)
// @access  Private
router.put('/:id/resolve', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Verify ownership
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    item.status = 'resolved';
    await item.save();

    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete an item and its associated requests
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Verify ownership
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete associated claims
    const ClaimRequest = require('../models/ClaimRequest');
    await ClaimRequest.deleteMany({ $or: [{ foundItemId: item._id }, { lostItemId: item._id }] });

    // Delete associated contact requests
    const ContactRequest = require('../models/ContactRequest');
    await ContactRequest.deleteMany({ itemId: item._id });

    // Delete the item
    await item.deleteOne();

    res.json({ message: 'Item removed completely' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
