const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require('../controllers/userController');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/current', protect, getCurrentUser);
module.exports = router;
