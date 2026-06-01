const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const ContactRequest = require('../models/ContactRequest');
const Item = require('../models/Item');
const Notification = require('../models/Notification');

// @route   POST /api/contact
// @desc    Send a secure message to an item owner
router.post('/', auth, async (req, res) => {
  try {
    const { itemId, message } = req.body;

    const item = await Item.findById(itemId).populate('user');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const contactReq = new ContactRequest({
      senderId: req.user.id,
      recipientId: item.user._id,
      itemId: item._id,
      message
    });
    
    await contactReq.save();

    // Create a notification for the owner
    const notification = new Notification({
      userId: item.user._id,
      title: 'New Secure Message',
      message: `Someone sent you a message regarding your post: "${item.title}". Message: "${message}"`
    });
    await notification.save();

    res.status(201).json(contactReq);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/contact/received
// @desc    Get messages sent to the current user
router.get('/received', auth, async (req, res) => {
  try {
    const requests = await ContactRequest.find({ recipientId: req.user.id })
      .populate('senderId', 'name email phone')
      .populate('itemId', 'title image type')
      .sort({ createdAt: -1 });

    const sanitized = requests.map(req => {
      const r = req.toObject();
      if (r.status !== 'approved' && r.senderId) {
        delete r.senderId.email;
        delete r.senderId.phone;
      }
      return r;
    });

    res.json(sanitized);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/contact/submitted
// @desc    Get messages submitted by the current user
router.get('/submitted', auth, async (req, res) => {
  try {
    const requests = await ContactRequest.find({ senderId: req.user.id })
      .populate('recipientId', 'name email phone')
      .populate('itemId', 'title image type')
      .sort({ createdAt: -1 });

    const sanitized = requests.map(req => {
      const r = req.toObject();
      if (r.status !== 'approved' && r.recipientId) {
        delete r.recipientId.email;
        delete r.recipientId.phone;
      }
      return r;
    });

    res.json(sanitized);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/contact/:id/status
// @desc    Approve or reject a contact request
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const contactReq = await ContactRequest.findById(req.params.id).populate('itemId');
    
    if (!contactReq) return res.status(404).json({ message: 'Request not found' });
    
    // Ensure the user updating the status is the recipient
    if (contactReq.recipientId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    contactReq.status = status;
    await contactReq.save();

    if (status === 'approved') {
      const notification = new Notification({
        userId: contactReq.senderId,
        title: 'Message Accepted! 💬',
        message: `The owner of "${contactReq.itemId.title}" accepted your message. Their contact details are now available in your dashboard.`,
      });
      await notification.save();
    } else if (status === 'rejected') {
      const notification = new Notification({
        userId: contactReq.senderId,
        title: 'Message Declined',
        message: `The owner of "${contactReq.itemId.title}" declined your message request.`,
      });
      await notification.save();
    }

    res.json(contactReq);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
