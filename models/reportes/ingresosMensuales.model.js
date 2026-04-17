import { supabase } from "../../database/supaBaseConnection.js";

export default class IngresosMensualesModel {
    constructor() {}

    async getIngresosMensuales() {
        const { data, error } = await supabase.rpc('get_ingresos_mensuales');

        if (error) {
            console.error("Error al ejecutar la función RPC get_ingresos_mensuales:", error);
            throw new Error(
                `Error al obtener los ingresos mensuales: ${error.message}`,
            );
        }
        return data;
    }

}