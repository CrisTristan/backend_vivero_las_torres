import PiedraModel from "../../models/piedras/piedra.model.js";

export default class PiedraController {
  async deletePiedraById(piedraId) {
    try {
      const piedraModel = new PiedraModel();
      return await piedraModel.deletePiedraById(piedraId);
    } catch (error) {
      throw new Error(`Error al eliminar la piedra: ${error.message}`);
    }
  }
  async createNewStone(payload) {
    try {
      const piedraModel = new PiedraModel();
      const newStone = await piedraModel.createNewStone(payload);
      return newStone;
    } catch (error) {
      throw new Error(`Error al crear la piedra: ${error.message}`);
    }
  }

  async updatePiedraById(piedraId, piedraData) {
    try {
      const piedraModel = new PiedraModel();
      const updatedStone = await piedraModel.updatePiedraById(piedraId, piedraData);
      return updatedStone;
    } catch (error) {
      throw new Error(`Error al actualizar la piedra: ${error.message}`);
    }
  }
}
