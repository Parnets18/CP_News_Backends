const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');

const ACCESS_SECRET = process.env.ACCESS_SECRET || 'myaccesssecret';

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, ACCESS_SECRET, { expiresIn: '24h' });
  res.json({ accessToken: token });
};
