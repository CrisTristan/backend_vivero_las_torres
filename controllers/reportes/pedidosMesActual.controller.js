import PedidosMesActualModel from "../../models/reportes/pedidosMesActual.mode.js";

export default class PedidosMesActualController {
    constructor() {}
    
    async getPedidosMesActual() {
        try {
            const pedidosMesActualModel = new PedidosMesActualModel();
            const pedidosMesActual = await pedidosMesActualModel.getPedidosMesActual();
            return pedidosMesActual;
        } catch (error) {
            console.error("Error en PedidosMesActualController.getPedidosMesActual:", error);
            throw new Error(`Error al obtener los pedidos del mes actual: ${error.message}`);
        }
    }
}