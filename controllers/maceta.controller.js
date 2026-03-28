import MacetaModel from "../models/maceta.model.js";

export default class MacetaController {
  async deleteMacetaById(macetaId) {
    try {
      const macetaModel = new MacetaModel();
      return await macetaModel.deleteMacetaById(macetaId);
    } catch (error) {
      throw new Error(`Error al eliminar la maceta: ${error.message}`);
    }
  }
  async createNewPot(payload) {
    try {
      const macetaModel = new MacetaModel();
      const newPot = await macetaModel.createNewPot(payload);
      return newPot;
    } catch (error) {
      throw new Error(`Error al crear la maceta: ${error.message}`);
    }
  }

  async updateMacetaById(macetaId, macetaData) {
    try {
      const macetaModel = new MacetaModel();
      const updatedPot = await macetaModel.updateMacetaById(macetaId, macetaData);
      return updatedPot;
    } catch (error) {
      throw new Error(`Error al actualizar la maceta: ${error.message}`);
    }
  }
}