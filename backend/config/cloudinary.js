const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2; // Import Cloudinary SDK

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const createProductUploadMiddleware = () =>
  multer({
    storage: diskStorage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB max file size
    },
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
  });

const getLocalUploadUrl = (req, file) => {
  if (!file?.filename) return null;

  const host = req?.get?.('host');
  if (!host) {
    return `/uploads/${file.filename}`;
  }

  const forwardedProto = req?.headers?.['x-forwarded-proto'];
  const protocol = forwardedProto
    ? forwardedProto.split(',')[0].trim()
    : req.secure
      ? 'https'
      : req.protocol || 'http';

  return `${protocol}://${host}/uploads/${file.filename}`;
};

const getCloudinaryConfig = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUDNAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  return { cloudName, apiKey, apiSecret };
};

const isCloudinaryConfigured = () => {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  return Boolean(cloudName && apiKey && apiSecret);
};

// Configure Cloudinary once if credentials are available
if (isCloudinaryConfigured()) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true, // Always use HTTPS
  });
}

const uploadToCloudinary = async (file) => {
  if (!file || !file.path) return null;

  if (!isCloudinaryConfigured()) {
    return null;
  }

  try {
    const folder = process.env.CLOUDINARY_FOLDER || 'aietsy/products';
    const uploadOptions = {
      folder: folder,
      // You can add more options here, e.g., transformation, tags, public_id
      // resource_type: 'auto', // Automatically detect file type
      // public_id: path.parse(file.originalname).name, // Optional: use original filename as public_id
    };

    const result = await cloudinary.uploader.upload(file.path, uploadOptions);

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary SDK upload failed:', error.message);
    return null;
  } finally {
    // Always delete the local temporary file if Cloudinary was configured and attempted to upload
    if (file?.path && fs.existsSync(file.path) && isCloudinaryConfigured()) {
      fs.unlinkSync(file.path);
    }
  }
};

module.exports = {
  createProductUploadMiddleware,
  isCloudinaryConfigured,
  uploadToCloudinary,
  getLocalUploadUrl,
};
