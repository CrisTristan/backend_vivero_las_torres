import PlaguicidaModel from "../../models/plaguicidas/plaguicida.model.js";

export default class PlaguicidaController {
  async createNewPesticide(payload) {
    try {
      const plaguicidaModel = new PlaguicidaModel();
      const newPesticide = await plaguicidaModel.createNewPesticide(payload);
      return newPesticide;
    } catch (error) {
      throw new Error(`Error al crear el plaguicida: ${error.message}`);
    }
  }

  async updatePlaguicidaById(plaguicidaId, plaguicidaData) {
    try {
      const plaguicidaModel = new PlaguicidaModel();
      const updatedPesticide = await plaguicidaModel.updatePlaguicidaById(
        plaguicidaId,
        plaguicidaData,
      );
      return updatedPesticide;
    } catch (error) {
      throw new Error(`Error al actualizar el plaguicida: ${error.message}`);
    }
  }
}
