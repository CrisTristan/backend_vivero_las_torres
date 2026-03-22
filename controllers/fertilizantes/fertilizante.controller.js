import FertilizanteModel from "../../models/fertilizantes/fertilizante.model.js";

export default class FertilizanteController {
  async createNewFertilizer(payload) {
    try {
      const fertilizanteModel = new FertilizanteModel();
      const newFertilizer = await fertilizanteModel.createNewFertilizer(payload);
      return newFertilizer;
    } catch (error) {
      throw new Error(`Error al crear el fertilizante: ${error.message}`);
    }
  }
}