// Load dependencies FIRST
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables immediately after
dotenv.config({ path: path.join(__dirname, '.env') });

// Now load other dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Configuration checks
const REQUIRED_ENV = ['MONGODB_URI', 'ACCESS_TOKEN_SECRET'];
REQUIRED_ENV.forEach(variable => {
  if (!process.env[variable]) {
    console.error(`FATAL ERROR: ${variable} is not defined in environment`);
    process.exit(1);
  }
});

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Routes - manual loading for better control
app.use('/api/auth', require('./Routes/authRoutes'));
// app.use('/api/news', require('./Routes/newsRoutes'));
app.use('/api/business', require('./Routes/businessRoutes'));
app.use('/api/crimes', require('./Routes/crimeRoutes'));
app.use('/api/viral', require('./Routes/viralRoutes'));
app.use('/api/sports', require('./Routes/sportsRoutes'));
app.use('/api/world', require('./Routes/worldRoutes'));
app.use('/api/web', require('./Routes/webRoutes'));
app.use('/api/photos', require('./Routes/photoRoutes'));
app.use('/api/videos', require('./Routes/videoRoutes'));
app.use('/api/india', require('./Routes/indiaRoutes'));
app.use('/api/realestate', require('./Routes/realEstateRoutes'));
app.use('/api/mobility', require('./Routes/mobilityRoutes'));
app.use('/api/entertainment', require('./Routes/entertainmentRoutes'));
app.use('/api/navigation', require('./Routes/navigation')); 
app.use('/api', require('./Routes/categoryRoutes'));
// Health check
app.get('/', (req, res) => res.send('🚀 API is live!'));

// Error handling
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  Server running on port ${PORT}
  MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}
  Environment: ${process.env.NODE_ENV || 'development'}
  `);
});