const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Prefer CLOUDINARY_URL if provided (format: cloudinary://<key>:<secret>@<cloud_name>)
const CLOUDINARY_URL = (process.env.CLOUDINARY_URL || '').trim();
const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
const apiKey = (process.env.CLOUDINARY_API_KEY || '').trim();
const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim();

if (CLOUDINARY_URL) {
  cloudinary.config({ cloudinary_url: CLOUDINARY_URL, secure: true });
} else if (cloudName && apiKey && apiSecret) {
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
} else {
  console.error('Cloudinary credentials missing. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
}

// Upload single image
const uploadImage = async (imagePath, folder = 'nevyra/products') => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder,
      resource_type: 'image',
      transformation: [{ fetch_format: 'auto', quality: 'auto' }],
    });
    return { success: true, url: result.secure_url, public_id: result.public_id };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return { success: false, error: error.message };
  }
};

// Upload multiple images
const uploadMultipleImages = async (imagePaths, folder = 'nevyra/products') => {
  try {
    const results = await Promise.all(imagePaths.map(p => uploadImage(p, folder)));
    const urls = results.map(r => r.url).filter(Boolean);
    const errors = results.filter(r => !r.success).map(r => r.error);
    return { success: errors.length === 0 && urls.length > 0, urls, errors };
  } catch (error) {
    console.error('Multiple upload error:', error);
    return { success: false, error: error.message, urls: [], errors: [error.message] };
  }
};

// Delete image
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return { success: result.result === 'ok', result: result.result };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return { success: false, error: error.message };
  }
};

// Delete multiple images
const deleteMultipleImages = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return { success: true, deleted: result.deleted, not_found: result.not_found };
  } catch (error) {
    console.error('Multiple delete error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { uploadImage, uploadMultipleImages, deleteImage, deleteMultipleImages, cloudinary };
