const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');        // NEW
const hospitalRoutes = require('./routes/hospitalRoutes');  // NEW

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // NEW

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donor', donorRoutes);          // NEW
app.use('/api/hospital', hospitalRoutes);    // NEW

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: '🩸 Blood Donor Finder API',
    version: '1.0.0',
    status: 'Running'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Server error' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});