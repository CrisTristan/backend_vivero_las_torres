import PlaguicidaModel from "../../models/plaguicidas/plaguicida.model.js";
import ImageDeleteController from "../images/image_delete_controller.js";

export default class PlaguicidaController {
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

  async getPlaguicidaById(plaguicidaId) {
    try {
      const plaguicidaModel = new PlaguicidaModel();
      const plaguicida = await plaguicidaModel.getPlaguicidaProductById(plaguicidaId);
      return plaguicida;
    } catch (error) {
      throw new Error(`Error al obtener el plaguicida: ${error.message}`);
    }
  }

  async deletePlaguicidaById(plaguicidaId) {
    try {
      const plaguicidaModel = new PlaguicidaModel();
      const plaguicida = await this.getPlaguicidaById(plaguicidaId);
      if (!plaguicida) return null;

      if (plaguicida.productos?.imagen) {
        const imageDeleteController = new ImageDeleteController();
        const publicId = this.extractCloudinaryPublicId(plaguicida.productos.imagen);
        if (publicId) {
          await imageDeleteController.deleteImage(publicId);
        }
      }

      return await plaguicidaModel.deletePlaguicidaById(plaguicidaId);
    } catch (error) {
      throw new Error(`Error al eliminar el plaguicida: ${error.message}`);
    }
  }
  async createNewPesticide(payload) {
    try {
      const plaguicidaModel = new PlaguicidaModel();
      const newPesticide = await plaguicidaModel.createNewPesticide(payload);
      return newPesticide;
    } catch (error) {
      throw new Error(`Error al crear el plaguicida: ${error.message}`);
    }
  }

  async updatePlaguicidaById(plaguicidaId, plaguicidaData) {
    try {
      const plaguicidaModel = new PlaguicidaModel();
      const updatedPesticide = await plaguicidaModel.updatePlaguicidaById(
        plaguicidaId,
        plaguicidaData,
      );
      return updatedPesticide;
    } catch (error) {
      throw new Error(`Error al actualizar el plaguicida: ${error.message}`);
    }
  }
}
