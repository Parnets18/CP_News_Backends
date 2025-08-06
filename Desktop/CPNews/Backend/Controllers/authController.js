const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const AppError = require('../Utils/appError');
const catchAsync = require('../Utils/catchAsync');

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;

if (!ACCESS_SECRET) {
  console.error('FATAL: ACCESS_TOKEN_SECRET is not defined in environment');
  process.exit(1);
}

// Main authentication middleware
const authMiddleware = catchAsync(async (req, res, next) => {
  // 1) Get token
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not logged in!', 401));
  }

  // 2) Verify token
  const decoded = jwt.verify(token, ACCESS_SECRET);

  // 3) Check user exists
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('User no longer exists!', 401));
  }

  // 4) Grant access
  req.user = user;
  next();
});

// Login controller remains the same
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, ACCESS_SECRET, { expiresIn: '24h' });
  
  res.json({ 
    accessToken: token,
    userId: user._id
  });
};

module.exports = {
  authMiddleware, // Now properly exported as a named function
  login,
  protect: authMiddleware // Alias for backwards compatibility
};