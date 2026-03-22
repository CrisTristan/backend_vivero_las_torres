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
}
