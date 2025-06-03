const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
// Routes
const crimeRoutes = require('./Routes/crimeRoutes');
const viralRoutes = require('./Routes/viralRoutes');
const sportsRoutes =require('./Routes/sportsRoutes');
const worldRoutes = require('./Routes/worldRoutes');
const businessRoutes = require('./Routes/businessRoutes');
const authRoutes = require('./Routes/authRoutes');
const videoRoutes = require('./Routes/videoRoutes');
const webRoutes = require('./Routes/webRoutes');
const photoRoutes = require('./Routes/photoRoutes');

app.use('/api/web', webRoutes);

app.use('/api/videos', videoRoutes);

app.use('/api/auth', authRoutes);


app.use('/api/business', businessRoutes);
app.use('/api/crimes', crimeRoutes);
app.use('/api/viral',    viralRoutes);
app.use('/api/sports', sportsRoutes);
app.use('/api/world', worldRoutes);
// app.use('/api/web', webRoutes);
app.use('/api/photos', photoRoutes);

app.use('/api/india', require('./Routes/indiaRoutes'));
app.use('/api/realestate', require('./Routes/realEstateRoutes'));
app.use('/api/mobility', require('./Routes/mobilityRoutes'));
app.use('/api/entertainment', require('./Routes/entertainmentRoutes'));




mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));




// Health Check
app.get('/', (req, res) => res.send('🚓  API is live!'));


app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
