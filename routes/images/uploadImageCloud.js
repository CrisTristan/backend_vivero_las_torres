import { Router } from 'express';
import multer from 'multer';
import ImageUploaderController from '../../controllers/images/image_uploader_controller.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.post('/images/uploadImageCloud', upload.single('imageFile'), async (req, res) => {
  try {
    const file = req.file;
    const folder = req.body?.folder?.trim();
    const publicId = req.body?.publicId?.trim();
    const format = req.body?.format?.trim();

    if (!file) {
      return res.status(400).json({ error: 'El archivo de la imagen es obligatorio en el campo imageFile' });
    }

    if (!file.mimetype?.startsWith('image/')) {
      return res.status(400).json({ error: 'El archivo debe ser una imagen valida' });
    }

    if (folder && !/^[a-zA-Z0-9_\-/]+$/.test(folder)) {
      return res.status(400).json({
        error: 'El folder contiene caracteres invalidos. Usa solo letras, numeros, _, -, /'
      });
    }

    const uploadedImage = await ImageUploaderController.uploadImageBuffer(file.buffer, {
      publicId: publicId || file.originalname?.replace(/\.[^.]+$/, ''),
      folder,
      format
    });

    res.json({
      imageUrl: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
      originalName: file.originalname,
      size: file.size,
      type: file.mimetype
    });
  } catch (error) {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'La imagen excede el limite permitido de 5MB' });
    }

    res.status(500).json({ error: error.message || 'Error al procesar la imagen' });
  }
});

export default router;