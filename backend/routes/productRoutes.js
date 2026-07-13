const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  addReview,
} = require('../controllers/productController');
const authenticate = require('../middleware/authenticate');
const { createProductUploadMiddleware } = require('../config/cloudinary');

const upload = createProductUploadMiddleware();

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, upload.array('images', 6), createProduct);
router.put('/:id', authenticate, upload.array('images', 6), updateProduct);
router.delete('/:id', authenticate, deleteProduct);
router.get('/seller/my-products', authenticate, getSellerProducts);
router.post('/:id/review', authenticate, addReview);

module.exports = router;
