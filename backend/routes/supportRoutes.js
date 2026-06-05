const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const SupportTicket = require('../models/SupportTicket');

// @route   POST /api/support
// @desc    Submit a new support ticket
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    const newTicket = new SupportTicket({
      user: req.user.id,
      subject,
      message
    });

    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (err) {
    console.error('Support Ticket Error:', err.message);
    res.status(500).json({ message: 'Server error while submitting ticket' });
  }
});

// @route   GET /api/support/me
// @desc    Get all support tickets for the logged in user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error('Fetch Support Tickets Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
