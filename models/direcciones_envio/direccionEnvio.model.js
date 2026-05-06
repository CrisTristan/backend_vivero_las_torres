import { supabase } from "../../database/supaBaseConnection.js";

export default class DireccionEnvioModel {

    constructor(){}

    async createDireccionEnvioByOrderId({
        orden_id,
        region,
        manzana,
        lote,
        colonia,
        calle,
        numero_interior,
        numero_exterior,
        codigo_postal,    
        referencia
    }) {
        // console.log("Creando dirección de envío con los siguientes datos:", {
        //     orden_id,
        //     region,
        //     manzana,
        //     lote,
        //     colonia,
        //     calle,
        //     numero_interior,
        //     numero_exterior,
        //     codigo_postal,
        //     referencia
        // });

        try {
            const { data, error } = await supabase
                .from("direcciones_envio")
                .insert([
                    {
                        orden_id: orden_id,
                        calle : calle,
                        codigo_postal : codigo_postal,
                        colonia : colonia,
                        lote : lote,
                        manzana : manzana,
                        numero_exterior : numero_exterior,
                        numero_interior : numero_interior,
                        referencia : referencia,
                        region : region
                    }
                ])
                .select();
            if (error) throw error;
            console.log("Dirección de envío creada exitosamente:", data);
            return data;
        } catch (error) {
            throw new Error(`Error al crear la dirección de envío: ${error.message}`);
        }
    }
}
