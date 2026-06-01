const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const ClaimRequest = require('../models/ClaimRequest');
const Item = require('../models/Item');
const Notification = require('../models/Notification');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'khojai_claims',
    allowedFormats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});
const upload = multer({ storage: storage });

// @route   POST /api/claims
// @desc    Submit a new claim request
router.post('/', auth, upload.single('proofImage'), async (req, res) => {
  try {
    const { foundItemId, lostItemId, identifyingDetail, message } = req.body;
    let proofImage = '';
    if (req.file) {
      proofImage = req.file.path;
    }

    const claim = new ClaimRequest({
      claimantId: req.user.id,
      foundItemId,
      lostItemId,
      identifyingDetail,
      message,
      proofImage
    });

    const savedClaim = await claim.save();

    // Notify found item owner
    const foundItem = await Item.findById(foundItemId).populate('user');
    if (foundItem) {
      const notification = new Notification({
        userId: foundItem.user._id,
        title: 'New Claim Request',
        message: `Someone claimed the item "${foundItem.title}" you posted.`,
        relatedClaimId: savedClaim._id
      });
      await notification.save();
    }

    res.status(201).json(savedClaim);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/claims/received
// @desc    Get claims made on items the current user found
router.get('/received', auth, async (req, res) => {
  try {
    // Find all items posted by this user
    const userItems = await Item.find({ user: req.user.id });
    const itemIds = userItems.map(item => item._id);

    const claims = await ClaimRequest.find({ foundItemId: { $in: itemIds } })
      .populate('claimantId', 'name email phone')
      .populate('foundItemId')
      .populate('lostItemId')
      .sort({ createdAt: -1 });

    // Hide contact info unless approved
    const sanitizedClaims = claims.map(claim => {
      const c = claim.toObject();
      if (c.status !== 'approved' && c.claimantId) {
        delete c.claimantId.email;
        delete c.claimantId.phone;
      }
      return c;
    });

    res.json(sanitizedClaims);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/claims/submitted
// @desc    Get claims submitted by the current user
router.get('/submitted', auth, async (req, res) => {
  try {
    const claims = await ClaimRequest.find({ claimantId: req.user.id })
      .populate({
        path: 'foundItemId',
        populate: { path: 'user', select: 'name email phone' }
      })
      .populate('lostItemId')
      .sort({ createdAt: -1 });

    // Hide contact info unless approved
    const sanitizedClaims = claims.map(claim => {
      const c = claim.toObject();
      if (c.status !== 'approved' && c.foundItemId && c.foundItemId.user) {
        delete c.foundItemId.user.email;
        delete c.foundItemId.user.phone;
      }
      return c;
    });

    res.json(sanitizedClaims);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/claims/:id/status
// @desc    Approve or reject a claim
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const claim = await ClaimRequest.findById(req.params.id).populate('foundItemId');
    
    if (!claim) return res.status(404).json({ message: 'Claim not found' });
    
    // Ensure the user updating the status is the owner of the found item
    if (claim.foundItemId.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    claim.status = status;
    await claim.save();

    if (status === 'approved') {
      // Mark item as resolved
      claim.foundItemId.status = 'resolved';
      await claim.foundItemId.save();

      // Notify claimant
      const notification = new Notification({
        userId: claim.claimantId,
        title: 'Claim Approved! 🎉',
        message: `Your claim for "${claim.foundItemId.title}" was approved. Contact details are now available.`,
        relatedClaimId: claim._id
      });
      await notification.save();
    } else if (status === 'rejected') {
      const notification = new Notification({
        userId: claim.claimantId,
        title: 'Claim Rejected',
        message: `Your claim for "${claim.foundItemId.title}" was rejected by the finder.`,
        relatedClaimId: claim._id
      });
      await notification.save();
    }

    res.json(claim);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
