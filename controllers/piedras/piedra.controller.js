import PiedraModel from "../../models/piedras/piedra.model.js";

export default class PiedraController {
  async createNewStone(payload) {
    try {
      const piedraModel = new PiedraModel();
      const newStone = await piedraModel.createNewStone(payload);
      return newStone;
    } catch (error) {
      throw new Error(`Error al crear la piedra: ${error.message}`);
    }
  }
}
