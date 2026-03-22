import HerbicidaModel from "../../models/herbicidas/herbicida.model.js";

export default class HerbicidaController {
  async createNewHerbicide(payload) {
    try {
      const herbicidaModel = new HerbicidaModel();
      const newHerbicide = await herbicidaModel.createNewHerbicide(payload);
      return newHerbicide;
    } catch (error) {
      throw new Error(`Error al crear el herbicida: ${error.message}`);
    }
  }
}
