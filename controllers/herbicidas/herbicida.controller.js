import HerbicidaModel from "../../models/herbicidas/herbicida.model.js";
import ImageDeleteController from "../images/image_delete_controller.js";

export default class HerbicidaController {
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

  async getHerbicidaById(herbicidaId) {
    try {
      const herbicidaModel = new HerbicidaModel();
      const herbicida = await herbicidaModel.getHerbicidaProductById(herbicidaId);
      return herbicida;
    } catch (error) {
      throw new Error(`Error al obtener el herbicida: ${error.message}`);
    }
  }

  async deleteHerbicidaById(herbicidaId) {
    try {
      const herbicidaModel = new HerbicidaModel();
      const herbicida = await this.getHerbicidaById(herbicidaId);
      if (!herbicida) return null;

      // if (herbicida.productos?.imagen) {
      //   const imageDeleteController = new ImageDeleteController();
      //   const publicId = this.extractCloudinaryPublicId(herbicida.productos.imagen);
      //   if (publicId) {
      //     await imageDeleteController.deleteImage(publicId);
      //   }
      // }

      return await herbicidaModel.deleteHerbicidaById(herbicidaId);
    } catch (error) {
      throw new Error(`Error al eliminar el herbicida: ${error.message}`);
    }
  }
  async createNewHerbicide(payload) {
    try {
      const herbicidaModel = new HerbicidaModel();
      const newHerbicide = await herbicidaModel.createNewHerbicide(payload);
      return newHerbicide;
    } catch (error) {
      throw new Error(`Error al crear el herbicida: ${error.message}`);
    }
  }

  async updateHerbicidaById(herbicidaId, herbicidaData) {
    try {
      const herbicidaModel = new HerbicidaModel();
      const updatedHerbicide = await herbicidaModel.updateHerbicidaById(
        herbicidaId,
        herbicidaData,
      );
      return updatedHerbicide;
    } catch (error) {
      throw new Error(`Error al actualizar el herbicida: ${error.message}`);
    }
  }
}
