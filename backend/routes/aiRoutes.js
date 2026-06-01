const express = require('express');
const multer = require('multer');
const auth = require('../middleware/authMiddleware');
const { extractItemDetailsFromImage } = require('../services/visionService');

const router = express.Router();

// Use memory storage so we don't save to Cloudinary just for analysis
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   POST /api/ai/analyze-image
// @desc    Analyze an uploaded image and return extracted item details
// @access  Private
router.post('/analyze-image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const { buffer, mimetype } = req.file;
    const extractedData = await extractItemDetailsFromImage(buffer, mimetype);

    res.json(extractedData);
  } catch (err) {
    console.error('AI Analysis Route Error:', err);
    res.status(500).json({ message: 'Failed to analyze image' });
  }
});

module.exports = router;
