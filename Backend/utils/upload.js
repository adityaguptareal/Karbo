const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const path = require('path');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // ✅ Check file type
    const isPDF = file.mimetype === 'application/pdf';
    const isDoc = file.mimetype.includes('document') || file.mimetype.includes('msword');

    // ✅ Get file extension
    const fileExtension = path.extname(file.originalname);
    const rawName = path.basename(file.originalname, fileExtension);
    const fileName = rawName.replace(/[^a-zA-Z0-9]/g, "_");

    // ✅ Different params for PDFs vs Images
    if (isPDF || isDoc) {
      return {
        folder: 'karbo/farmland',
        resource_type: 'raw',
        allowed_formats: ['pdf', 'doc', 'docx'],
        public_id: `${fileName}_${Date.now()}${fileExtension}`, // ✅ Include extension in public_id
      };
    } else {
      return {
        folder: 'karbo/farmland',
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 800, height: 800, crop: 'limit' }],
      };
    }
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

module.exports = upload;
