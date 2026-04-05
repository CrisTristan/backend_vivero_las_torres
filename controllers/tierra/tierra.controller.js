import TierraModel from "../../models/tierra/tierra.model.js";
import ImageDeleteController from "../images/image_delete_controller.js";

export default class TierraController {
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

  async getTierraById(tierraId) {
    try {
      const tierraModel = new TierraModel();
      const tierra = await tierraModel.getTierraProductById(tierraId);
      return tierra;
    } catch (error) {
      throw new Error(`Error al obtener la tierra: ${error.message}`);
    }
  }

  async deleteTierraById(tierraId) {
    try {
      const tierraModel = new TierraModel();
      const tierra = await this.getTierraById(tierraId);
      if (!tierra) return null;

      if (tierra.productos?.imagen) {
        const imageDeleteController = new ImageDeleteController();
        const publicId = this.extractCloudinaryPublicId(tierra.productos.imagen);
        if (publicId) {
          await imageDeleteController.deleteImage(publicId);
        }
      }

      return await tierraModel.deleteTierraById(tierraId);
    } catch (error) {
      throw new Error(`Error al eliminar la tierra: ${error.message}`);
    }
  }
  async createNewSoil(payload) {
    try {
      const tierraModel = new TierraModel();
      const newSoil = await tierraModel.createNewSoil(payload);
      return newSoil;
    } catch (error) {
      throw new Error(`Error al crear la tierra: ${error.message}`);
    }
  }

  async updateTierraById(tierraId, tierraData) {
    try {
      const tierraModel = new TierraModel();
      const updatedSoil = await tierraModel.updateTierraById(tierraId, tierraData);
      return updatedSoil;
    } catch (error) {
      throw new Error(`Error al actualizar la tierra: ${error.message}`);
    }
  }
}