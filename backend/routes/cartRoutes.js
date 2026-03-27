const express = require('express');
const { getCart, addToCart, removeFromCart, updateCartItem, clearCart } = require('../controllers/cartController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get('/', authenticate, getCart);
router.post('/add', authenticate, addToCart);
router.post('/remove', authenticate, removeFromCart);
router.put('/update', authenticate, updateCartItem);
router.delete('/clear', authenticate, clearCart);

module.exports = router;
