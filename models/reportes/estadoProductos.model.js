import { supabase } from "../../database/supaBaseConnection.js";

export default class EstadoProductosModel {
    constructor() {}

    async getEstadoProductos() {
        const { data, error } = await supabase.rpc('get_productos_estado');

        if (error) {
            console.error("Error al ejecutar la función RPC get_productos_estado:", error);
            throw new Error(
                `Error al obtener el estado de los productos: ${error.message}`,
            );
        }
        return data[0];
    }

}