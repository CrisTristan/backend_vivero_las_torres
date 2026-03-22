import MacetaModel from "../models/maceta.model.js";

export default class MacetaController {
  async createNewPot(payload) {
    try {
      const macetaModel = new MacetaModel();
      const newPot = await macetaModel.createNewPot(payload);
      return newPot;
    } catch (error) {
      throw new Error(`Error al crear la maceta: ${error.message}`);
    }
  }
}