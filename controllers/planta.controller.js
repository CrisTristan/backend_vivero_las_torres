import PlantaModel from "../models/planta.model.js";

export default class PlantaController {
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
}
