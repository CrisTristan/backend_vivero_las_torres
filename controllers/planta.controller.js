import PlantaModel from "../models/planta.model.js";
import ImageDeleteController from "./images/image_delete_controller.js";

export default class PlantaController {
  /**
   * Extrae el publicId de una URL de Cloudinary
   * @param {string} imageUrl - URL completa de la imagen
   * @returns {string} publicId en minúsculas sin extensión
   * Ej: "https://res.cloudinary.com/.../viverolastorres/plantas/interior/cactus_mini.webp"
   * Retorna: "viverolastorres/plantas/interior/cactus_mini"
   */
  extractCloudinaryPublicId(imageUrl) {
    if (!imageUrl) return null;
    
    // Buscar "viverolastorres" case-insensitive
    const startIndex = imageUrl.toLowerCase().indexOf("viverolastorres");
    if (startIndex === -1) return null;
    
    // Extraer desde "viverolastorres" en adelante (usando la posición encontrada)
    let publicId = imageUrl.substring(startIndex);
    
    // Convertir a minúsculas
    publicId = publicId.toLowerCase();
    
    // Remover la extensión (.jpg, .png, .webp, etc.)
    publicId = publicId.replace(/\.[^/.]+$/, "");
    
    return publicId;
  }

  async deletePlantById(plantId) {
    try {
      const plantaModel = new PlantaModel();
      //Ver si la planta existe antes de intentar eliminarla
      const plant = await this.getPlantById(plantId);
      console.log('Planta encontrada:', plant);
      if (!plant) {
        return null; // O lanzar un error específico si prefieres
      }

      //Eliminar primero la imagen del producto asociado a la planta
      if (plant.productos?.imagen) {
        const imageDeleteController = new ImageDeleteController();
        const publicId = this.extractCloudinaryPublicId(plant.productos.imagen);
        console.log('Public ID extraído:', publicId);
        await imageDeleteController.deleteImage(publicId);
      }


      return await plantaModel.deletePlantById(plantId);
    } catch (error) {
      throw new Error(`Error al eliminar la planta: ${error.message}`);
    }
  }
  async getAllPlantsWithProducts() {
    try {
      const plantaModel = new PlantaModel();
      const plantas = await plantaModel.getAllPlantsWithProducts();
      return plantas;
    } catch (error) {
      throw new Error(`Error al obtener las plantas: ${error.message}`);
    }
  }

  async createNewPlant(payload) {
    try {
      const plantaModel = new PlantaModel();
      const newPlant = await plantaModel.createNewPlant(payload);
      return newPlant;
    } catch (error) {
      throw new Error(`Error al crear la planta: ${error.message}`);
    }
  }

  async updatePlantById(plantId, plantData) {
    try {
      const plantaModel = new PlantaModel();
      const updatedPlant = await plantaModel.updatePlantById(plantId, plantData);
      return updatedPlant;
    } catch (error) {
      throw new Error(`Error al actualizar la planta: ${error.message}`);
    }
  }

  async getPlantById(plantId) {
    try {
      const plantaModel = new PlantaModel();
      const plant = await plantaModel.getPlantProductById(plantId);
      return plant;
    } catch (error) {
      throw new Error(`Error al obtener la planta: ${error.message}`);
    }
  }
}
