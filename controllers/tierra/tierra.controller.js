import TierraModel from "../../models/tierra/tierra.model.js";

export default class TierraController {
  async createNewSoil(payload) {
    try {
      const tierraModel = new TierraModel();
      const newSoil = await tierraModel.createNewSoil(payload);
      return newSoil;
    } catch (error) {
      throw new Error(`Error al crear la tierra: ${error.message}`);
    }
  }
}