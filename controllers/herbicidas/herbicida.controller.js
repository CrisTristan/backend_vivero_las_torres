import HerbicidaModel from "../../models/herbicidas/herbicida.model.js";

export default class HerbicidaController {
  async deleteHerbicidaById(herbicidaId) {
    try {
      const herbicidaModel = new HerbicidaModel();
      return await herbicidaModel.deleteHerbicidaById(herbicidaId);
    } catch (error) {
      throw new Error(`Error al eliminar el herbicida: ${error.message}`);
    }
  }
  async createNewHerbicide(payload) {
    try {
      const herbicidaModel = new HerbicidaModel();
      const newHerbicide = await herbicidaModel.createNewHerbicide(payload);
      return newHerbicide;
    } catch (error) {
      throw new Error(`Error al crear el herbicida: ${error.message}`);
    }
  }

  async updateHerbicidaById(herbicidaId, herbicidaData) {
    try {
      const herbicidaModel = new HerbicidaModel();
      const updatedHerbicide = await herbicidaModel.updateHerbicidaById(
        herbicidaId,
        herbicidaData,
      );
      return updatedHerbicide;
    } catch (error) {
      throw new Error(`Error al actualizar el herbicida: ${error.message}`);
    }
  }
}
