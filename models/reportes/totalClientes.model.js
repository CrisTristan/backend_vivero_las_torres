import { supabase } from "../../database/supaBaseConnection.js";

export default class TotalClientesModel {
    constructor() {}

    async getTotalUsuariosClientes() {
        const { data, error } = await supabase.rpc('get_total_usuarios_clientes');

        if (error) {
            console.error("Error al ejecutar la función RPC get_total_usuarios_clientes:", error);
            throw new Error(
                `Error al obtener el total de usuarios clientes: ${error.message}`,
            );
        }
        return data[0];
    }
}