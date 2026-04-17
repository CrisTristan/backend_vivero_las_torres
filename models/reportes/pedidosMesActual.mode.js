import { supabase } from "../../database/supaBaseConnection.js";

export default class PedidosMesActualModel {
    constructor() {}

    async getPedidosMesActual() {
        const { data, error } = await supabase.rpc('get_pedidos_mes_actual');

        if (error) {
            console.error("Error al ejecutar la función RPC get_pedidos_mes_actual:", error);
            throw new Error(
                `Error al obtener los pedidos del mes actual: ${error.message}`,
            );
        }
        return data[0];
    }

}