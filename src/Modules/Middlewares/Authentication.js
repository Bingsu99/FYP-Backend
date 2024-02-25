'use strict';
const jwt = require('jsonwebtoken');

// Middleware to verify access token
function verifyAccessToken(req, res, next) {
    const accessToken = req.headers.authorization;
  
    if (!accessToken) {
      return res.status(401).json({ message: 'Access token not provided' });
    }
  
    jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
          console.log(accessToken)
        return res.status(401).json({ message: 'Invalid access token' });
      }
      // If the token is valid, you can access the user's ID in decoded.userId
  
      // You can perform additional authorization checks here if needed
  
      next(); // Proceed to the protected route
    });
  }
  
module.exports = verifyAccessToken