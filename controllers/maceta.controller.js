import MacetaModel from "../models/maceta.model.js";
import ImageDeleteController from "./images/image_delete_controller.js";

export default class MacetaController {
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

  async getMacetaById(macetaId) {
    try {
      const macetaModel = new MacetaModel();
      const maceta = await macetaModel.getMacetaProductById(macetaId);
      return maceta;
    } catch (error) {
      throw new Error(`Error al obtener la maceta: ${error.message}`);
    }
  }

  async deleteMacetaById(macetaId) {
    try {
      const macetaModel = new MacetaModel();
      const maceta = await this.getMacetaById(macetaId);
      if (!maceta) return null;

      if (maceta.productos?.imagen) {
        const imageDeleteController = new ImageDeleteController();
        const publicId = this.extractCloudinaryPublicId(maceta.productos.imagen);
        if (publicId) {
          await imageDeleteController.deleteImage(publicId);
        }
      }

      return await macetaModel.deleteMacetaById(macetaId);
    } catch (error) {
      throw new Error(`Error al eliminar la maceta: ${error.message}`);
    }
  }
  async createNewPot(payload) {
    try {
      const macetaModel = new MacetaModel();
      const newPot = await macetaModel.createNewPot(payload);
      return newPot;
    } catch (error) {
      throw new Error(`Error al crear la maceta: ${error.message}`);
    }
  }

  async updateMacetaById(macetaId, macetaData) {
    try {
      const macetaModel = new MacetaModel();
      const updatedPot = await macetaModel.updateMacetaById(macetaId, macetaData);
      return updatedPot;
    } catch (error) {
      throw new Error(`Error al actualizar la maceta: ${error.message}`);
    }
  }
}