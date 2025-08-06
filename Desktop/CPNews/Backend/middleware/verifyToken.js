  // const jwt = require('jsonwebtoken');
  // const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;

  // module.exports = (req, res, next) => {
  //   const authHeader = req.headers.authorization;

  //   if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //     return res.status(401).json({ message: 'Access token missing or invalid' });
  //   }

  //   const token = authHeader.split(' ')[1];

  //   jwt.verify(token, ACCESS_SECRET, (err, decoded) => {
  //     if (err) return res.status(403).json({ message: 'Token is expired or invalid' });

  //     req.user = decoded; // You can use this in controllers
  //     next();
  //   });

  // // const decoded = jwt.verify(token, ACCESS_SECRET );
  // // req.user = decoded;

  // };


  // // {
  // //   "email": "admin@example.com",
  // //   "password": "admin1234"
  // // }
