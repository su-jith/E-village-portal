const express = require('express');
const RationNotification = require('../models/RationNotification');

const router = express.Router();

router.post('/notify', async (req, res) => {
  const { entitlement, items, lastPickupDate } = req.body;

  if (!entitlement || !items || items.length === 0 || !lastPickupDate) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newNotification = new RationNotification({
      entitlement,
      items,
      lastPickupDate,
    });

    await newNotification.save();

    res.status(201).json({ message: 'Notification saved successfully!' });
  } catch (error) {
    console.error('Error saving notification:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


router.get('/notifications', async (req, res) => {
  try {
    const notifications = await RationNotification.find();
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});


module.exports = router;
