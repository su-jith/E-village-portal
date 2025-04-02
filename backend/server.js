// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const wardRoutes = require("./routes/ward");
const adminRoutes = require("./routes/admin"); 
const employeeRoutes = require("./routes/employeeRoutes");
const healthcareWorkerRoutes = require("./routes/healthcareWorkerRoutes"); // ✅ Import the new routes
const rationOfficerRoutes = require("./routes/rationOfficerRoutes");
const houseRoutes = require('./routes/houseRoutes');
const familyRoutes = require('./routes/familyRoutes');
const healthDataRoutes = require('./routes/healthDataRoutes');
const rationNotificationRoutes = require('./routes/rationNotificationRoutes');
const jobRoutes = require('./routes/jobRoutes'); // ✅ Import the new routes
const jobApplicationRoutes = require('./routes/jobApplicationRoutes'); // ✅ Import the new routes
const complaintRoutes = require('./routes/complaintRoutes'); // ✅ Import the new routes



dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');

    // Optional: Create default admin after DB connection
    const createDefaultAdmin = require('./utils/createDefaultAdmin');
    createDefaultAdmin();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the e-Village Portal API');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', adminRoutes);  // ✅ No duplicate mount
app.use('/api/admin/ward', wardRoutes);  
app.use("/api/employees", employeeRoutes);

app.use("/api/healthcare-workers", healthcareWorkerRoutes); // ✅ Mount the new routes
app.use("/api/ration-officers", rationOfficerRoutes);
app.use('/api/employee', houseRoutes);
app.use('/api/employee/family', familyRoutes);
app.use('/api/healthcare-worker/healthdata', healthDataRoutes);
app.use('/api/ration', rationNotificationRoutes);
app.use('/api/job', jobRoutes); // ✅ Mount the new routes
app.use('/api/job-application', jobApplicationRoutes); // ✅ Mount the new routes
app.use('/api/complaints', complaintRoutes); // ✅ Mount the new routes


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on (http://localhost:${PORT})`));
