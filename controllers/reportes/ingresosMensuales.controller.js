import IngresosMensualesModel from "../../models/reportes/ingresosMensuales.model.js";

export default class IngresosMensualesController {
    constructor() {}

    async getIngresosMensuales() {
        try {
            const ingresosMensualesModel = new IngresosMensualesModel();
            const ingresosMensuales = await ingresosMensualesModel.getIngresosMensuales();
            return ingresosMensuales;
        } catch (error) {
            console.error("Error en IngresosMensualesController.getIngresosMensuales:", error);
            throw new Error(`Error al obtener los ingresos mensuales: ${error.message}`);
        }
    }
}