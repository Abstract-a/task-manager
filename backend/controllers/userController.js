const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const registerUser = asyncHandler(async (req, res) => {
  // checking if the user provided name,email,password
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('All fields are mandatory');
  }

  // checking if the user exists already
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User Exists');
  }
  // encrypting our password using bcrypt and a salt
  const salt = await bcrypt.genSalt(11);
  const hashedPassword = await bcrypt.hash(password, salt);

  // creating the user in our db
  const user = await User.create({ name, email, password: hashedPassword });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateJWTtoken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // checking if the user exists in our db
  const user = await User.findOne({ email });

  // checking if the password provided in the request is the same as the password in the database of the user we just fetched
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateJWTtoken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid data');
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({ message: 'Current user data' });
});
// generating a JWT token that we then pass to the user when the login or the registring is successful thus authenticating the user
const generateJWTtoken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '5d' });

module.exports = { registerUser, loginUser, getCurrentUser };
