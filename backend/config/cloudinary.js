const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

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

const createProductUploadMiddleware = () => multer({ storage: diskStorage });

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

const uploadToCloudinary = async (file) => {
  if (!file || !file.path) return null;

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  if (!cloudName || !apiKey || !apiSecret) {
    return `/uploads/${file.filename}`;
  }

  try {
    const fileBuffer = fs.readFileSync(file.path);
    const formData = new FormData();
    formData.append('file', new Blob([fileBuffer]), file.originalname);

    const folder = process.env.CLOUDINARY_FOLDER || 'aietsy/products';
    const timestamp = Math.round(Date.now() / 1000);

    if (process.env.CLOUDINARY_UPLOAD_PRESET) {
      formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', folder);
    } else {
      const signature = crypto
        .createHash('sha256')
        .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
        .digest('hex');

      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('folder', folder);
      formData.append('signature', signature);
    }

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Cloudinary upload failed');
    }

    return data.secure_url || data.url;
  } catch (error) {
    console.error('Cloudinary upload failed:', error.message);
    return `/uploads/${file.filename}`;
  } finally {
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }
};

module.exports = {
  createProductUploadMiddleware,
  isCloudinaryConfigured,
  uploadToCloudinary,
};
