import TotalClientesModel from "../../models/reportes/totalClientes.model.js";

export default class TotalClientesController {
    constructor() {}

    async getTotalClientes() {
        try {
            const totalClientesModel = new TotalClientesModel();
            const totalClientes = await totalClientesModel.getTotalUsuariosClientes();
            return totalClientes;
        } catch (error) {
            console.error("Error en TotalClientesController.getTotalClientes:", error);
            throw new Error(`Error al obtener el total de clientes: ${error.message}`);
        }
    }
}