// utils/createDefaultAdmin.js
const User = require('../models/User');

const createDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin1@gmail.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = new User({ email: adminEmail, password: 'admin123', role: 'admin' });
      await admin.save();
      console.log('Default admin account created:', adminEmail);
    } else {
      console.log('Default admin account already exists');
    }
  } catch (err) {
    console.error('Error creating default admin:', err);
  }
};

module.exports = createDefaultAdmin;
