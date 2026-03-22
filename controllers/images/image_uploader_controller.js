import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export default class ImageUploaderController {

  static async uploadImageBuffer(fileBuffer, options = {}) {
    const folder = options.folder || 'ViveroLasTorres/plantas/interior'
    const publicId = options.publicId
    const format = options.format

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          format
        },
        (error, result) => {
          if (error) {
            return reject(new Error(`Error al subir la imagen: ${error.message}`))
          }
          return resolve(result)
        }
      )

      Readable.from(fileBuffer).pipe(uploadStream)
    })
  }
}