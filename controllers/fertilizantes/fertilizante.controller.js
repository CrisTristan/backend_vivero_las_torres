import FertilizanteModel from "../../models/fertilizantes/fertilizante.model.js";
import ImageDeleteController from "../images/image_delete_controller.js";

export default class FertilizanteController {
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

  async getFertilizanteById(fertilizanteId) {
    try {
      const fertilizanteModel = new FertilizanteModel();
      const fertilizante = await fertilizanteModel.getFertilizanteProductById(fertilizanteId);
      return fertilizante;
    } catch (error) {
      throw new Error(`Error al obtener el fertilizante: ${error.message}`);
    }
  }

  async deleteFertilizanteById(fertilizanteId) {
    try {
      const fertilizanteModel = new FertilizanteModel();
      const fertilizante = await this.getFertilizanteById(fertilizanteId);
      if (!fertilizante) return null;

      if (fertilizante.productos?.imagen) {
        const imageDeleteController = new ImageDeleteController();
        const publicId = this.extractCloudinaryPublicId(fertilizante.productos.imagen);
        if (publicId) {
          await imageDeleteController.deleteImage(publicId);
        }
      }

      return await fertilizanteModel.deleteFertilizanteById(fertilizanteId);
    } catch (error) {
      throw new Error(`Error al eliminar el fertilizante: ${error.message}`);
    }
  }
  async createNewFertilizer(payload) {
    try {
      const fertilizanteModel = new FertilizanteModel();
      const newFertilizer = await fertilizanteModel.createNewFertilizer(payload);
      return newFertilizer;
    } catch (error) {
      throw new Error(`Error al crear el fertilizante: ${error.message}`);
    }
  }

  async updateFertilizanteById(fertilizanteId, fertilizanteData) {
    try {
      const fertilizanteModel = new FertilizanteModel();
      const updatedFertilizer = await fertilizanteModel.updateFertilizanteById(
        fertilizanteId,
        fertilizanteData,
      );
      return updatedFertilizer;
    } catch (error) {
      throw new Error(`Error al actualizar el fertilizante: ${error.message}`);
    }
  }
}