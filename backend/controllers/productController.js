const Product = require('../models/Product');
const { uploadToCloudinary, getLocalUploadUrl } = require('../config/cloudinary');

const normalizeUploadedImages = async (req, files = []) => {
  if (files.length && !isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured for image uploads');
  }

  const uploadedImages = await Promise.all(
    files.map(async (file) => {
      if (file?.secure_url) return file.secure_url;
      if (file?.path && typeof file.path === 'string') {
        const cloudinaryUrl = await uploadToCloudinary(file);
        return cloudinaryUrl || getLocalUploadUrl(req, file);
      }
      return getLocalUploadUrl(req, file);
    })
  );

  return uploadedImages.filter(Boolean);
};

exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    let query = {};

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('sellerId', 'username profileImage');

    const total = await Product.countDocuments(query);

    res.json({
      products,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('sellerId');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, category, images, inventory, tags } = req.body;

    // Support file uploads (via Cloudinary or local storage) + optional image URL list
    const uploadedImages = await normalizeUploadedImages(req, req.files);

    let parsedImages = [];
    if (images) {
      try {
        parsedImages = typeof images === 'string' ? JSON.parse(images) : images;
      } catch {
        parsedImages = typeof images === 'string' ? images.split(',').map((img) => img.trim()) : images;
      }
    }

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      images: [...uploadedImages, ...(parsedImages || [])],
      inventory,
      tags: tags ? (typeof tags === 'string' ? tags.split(',').map((tag) => tag.trim()) : tags) : [],
      sellerId: req.userId,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.sellerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, description, price, category, images, inventory, tags } = req.body;

    const uploadedImages = await normalizeUploadedImages(req, req.files);

    let parsedImages = [];
    if (images) {
      try {
        parsedImages = typeof images === 'string' ? JSON.parse(images) : images;
      } catch {
        parsedImages = typeof images === 'string' ? images.split(',').map((img) => img.trim()) : images;
      }
    }

    Object.assign(product, {
      title,
      description,
      price,
      category,
      images: [...(product.images || []), ...uploadedImages, ...(parsedImages || [])],
      inventory,
      tags: tags ? (typeof tags === 'string' ? tags.split(',').map((tag) => tag.trim()) : tags) : product.tags,
    });

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.sellerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.userId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = {
      userId: req.userId,
      rating,
      comment,
      createdAt: new Date(),
    };

    product.reviews.push(review);
    product.rating = (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1);

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
