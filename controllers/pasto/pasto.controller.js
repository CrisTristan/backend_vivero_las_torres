import PastoModel from "../../models/pasto/pasto.model.js";

export default class PastoController {
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
