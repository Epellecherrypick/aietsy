const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getSellerOrders,
} = require('../controllers/orderController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/', authenticate, createOrder);
router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrderById);
router.put('/:id', authenticate, updateOrderStatus);
router.get('/seller/my-orders', authenticate, getSellerOrders);

module.exports = router;
