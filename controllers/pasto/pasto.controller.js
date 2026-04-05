import PastoModel from "../../models/pasto/pasto.model.js";
import ImageDeleteController from "../images/image_delete_controller.js";

export default class PastoController {
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

  async getPastoById(pastoId) {
    try {
      const pastoModel = new PastoModel();
      const pasto = await pastoModel.getPastoProductById(pastoId);
      return pasto;
    } catch (error) {
      throw new Error(`Error al obtener el pasto: ${error.message}`);
    }
  }

  async deletePastoById(pastoId) {
    try {
      const pastoModel = new PastoModel();
      const pasto = await this.getPastoById(pastoId);
      if (!pasto) return null;

      if (pasto.productos?.imagen) {
        const imageDeleteController = new ImageDeleteController();
        const publicId = this.extractCloudinaryPublicId(pasto.productos.imagen);
        if (publicId) {
          await imageDeleteController.deleteImage(publicId);
        }
      }

      return await pastoModel.deletePastoById(pastoId);
    } catch (error) {
      throw new Error(`Error al eliminar el pasto: ${error.message}`);
    }
  }
  async createNewGrass(payload) {
    try {
      const pastoModel = new PastoModel();
      const newGrass = await pastoModel.createNewGrass(payload);
      return newGrass;
    } catch (error) {
      throw new Error(`Error al crear el pasto: ${error.message}`);
    }
  }

  async updatePastoById(pastoId, pastoData) {
    console.log("PastoController - updatePastoById called with:", pastoId, pastoData);
    try {
      const pastoModel = new PastoModel();
      const updatedGrass = await pastoModel.updatePastoById(pastoId, pastoData);
      return updatedGrass;
    } catch (error) {
      throw new Error(`Error al actualizar el pasto: ${error.message}`);
    }
  }
}
