const express = require('express');
const { register, login, getProfile, updateProfile, becomeSeller } = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/become-seller', authenticate, becomeSeller);

module.exports = router;
