import PiedraModel from "../../models/piedras/piedra.model.js";
import ImageDeleteController from "../images/image_delete_controller.js";

export default class PiedraController {
  /**
   * Extrae el publicId de una URL de Cloudinary
   */
  extractCloudinaryPublicId(imageUrl) {
    if (!imageUrl) return null;
    const startIndex = imageUrl.toLowerCase().indexOf("viverolastorres");
    if (startIndex === -1) return null;
    let publicId = imageUrl.substring(startIndex);
    publicId = publicId.toLowerCase();
    publicId = publicId.replace(/\.[^/.]+$/, "");
    return publicId;
  }

  async getPiedraById(piedraId) {
    try {
      const piedraModel = new PiedraModel();
      const piedra = await piedraModel.getPiedraProductById(piedraId);
      return piedra;
    } catch (error) {
      throw new Error(`Error al obtener la piedra: ${error.message}`);
    }
  }

  async deletePiedraById(piedraId) {
    try {
      const piedraModel = new PiedraModel();
      const piedra = await this.getPiedraById(piedraId);
      if (!piedra) return null;

      if (piedra.productos?.imagen) {
        const imageDeleteController = new ImageDeleteController();
        const publicId = this.extractCloudinaryPublicId(piedra.productos.imagen);
        if (publicId) {
          await imageDeleteController.deleteImage(publicId);
        }
      }

      return await piedraModel.deletePiedraById(piedraId);
    } catch (error) {
      throw new Error(`Error al eliminar la piedra: ${error.message}`);
    }
  }
  async createNewStone(payload) {
    try {
      const piedraModel = new PiedraModel();
      const newStone = await piedraModel.createNewStone(payload);
      return newStone;
    } catch (error) {
      throw new Error(`Error al crear la piedra: ${error.message}`);
    }
  }

  async updatePiedraById(piedraId, piedraData) {
    try {
      const piedraModel = new PiedraModel();
      const updatedStone = await piedraModel.updatePiedraById(piedraId, piedraData);
      return updatedStone;
    } catch (error) {
      throw new Error(`Error al actualizar la piedra: ${error.message}`);
    }
  }
}
