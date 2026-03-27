const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const items = cart.items.map(item => ({
      productId: item.productId._id,
      title: item.productId.title,
      price: item.productId.price,
      quantity: item.quantity,
      sellerId: item.productId.sellerId,
    }));

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = new Order({
      userId: req.userId,
      items,
      totalPrice,
      shippingAddress,
      status: 'pending',
    });

    await newOrder.save();
    await Cart.findByIdAndUpdate(cart._id, { items: [] });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).populate('items.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is the seller for any items or the buyer
    const isSeller = order.items.some(item => item.sellerId.toString() === req.userId);
    const isBuyer = order.userId.toString() === req.userId;

    if (!isSeller && !isBuyer) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    order.status = status;
    order.updatedAt = new Date();
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'items.sellerId': req.userId }).populate('items.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
