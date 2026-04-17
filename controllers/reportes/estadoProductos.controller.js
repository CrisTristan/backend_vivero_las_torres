import EstadoProductosModel from "../../models/reportes/estadoProductos.model.js";

export default class EstadoProductosController {
    constructor() {}

    async getEstadoProductos() {
        try {
            const estadoProductosModel = new EstadoProductosModel();
            const estadoProductos = await estadoProductosModel.getEstadoProductos();
            return estadoProductos;
        }
        catch (error) {
            console.error("Error en EstadoProductosController.getEstadoProductos:", error);
            throw new Error(`Error al obtener el estado de los productos: ${error.message}`);
        }
    }
}