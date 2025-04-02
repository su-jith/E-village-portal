const mongoose = require('mongoose');

const rationNotificationSchema = new mongoose.Schema({
  entitlement: {
    type: String,
    required: true,
  },
  items: [
    {
      itemName: String,
      quantity: String,
    },
  ],
  lastPickupDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RationNotification = mongoose.model('RationNotification', rationNotificationSchema);

module.exports = RationNotification;
