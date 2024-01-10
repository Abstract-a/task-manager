const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  // here we check if we have a token in our request headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // extracting the token from the auth headers
    try {
      token = req.headers.authorization.split(' ')[1];
      // validating the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // fetching user details from the database based on the decoded user id excluding the password
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.log(error);
      res.status(400);
      throw new Error('You are not authorized');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('not authorized, no token');
  }
});

module.exports = { protect };
