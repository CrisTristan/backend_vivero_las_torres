import { supabase } from "../../database/supaBaseConnection.js";

export default class UserShippingDataModel {

    constructor(){}

    async createUserShippingData({
        usuario_id,
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
        try {
            const { data, error } = await supabase //cuando se hace insert supabase no retorna el nuevo registro.
                .from("direcciones_usuario")
                .insert([
                    {
                        usuario_id,
                        calle : calle,
                        codigo_postal : codigo_postal,
                        "colonia/fraccionamiento" : colonia,
                        lote : lote,
                        manzana : manzana,
                        numero_exterior : numero_exterior,
                        numero_interior : numero_interior,
                        referencia : referencia,
                        "region/supermanzana" : region
                    }
                ])
                .select();
            if (error) throw error;
            console.log("Datos de envío del usuario creados exitosamente:", data);
            return data;
        } catch (error) {
            throw new Error(`Error al crear los datos de envío del usuario: ${error.message}`);
        }
    }

    async getUserShippingDataByUserId(usuario_id) {
        try {
            const { data, error } = await supabase
                .from("direcciones_usuario")
                .select('id, "region/supermanzana", manzana, lote, "colonia/fraccionamiento", calle, numero_interior, numero_exterior, codigo_postal, referencia') //seleccionar todos los campos de la tabla direcciones_usuario menos el id y el usuario_id
                .eq("usuario_id", usuario_id);
            if (error) throw error;
            console.log("Datos de envío del usuario encontrados:", data);
            return data;
        } catch (error) {
            throw new Error(`Error al obtener los datos de envío del usuario: ${error.message}`);
        }
    }

    async updateUserShippingDataById(id, {
        region,
        manzana,
        lote,
        colonia,
        calle,
        numero_interior,
        numero_exterior,
        codigo_postal,
        referencia
    }){
        try {
            console.log("Actualizando datos de envío del usuario con id:", id);
            console.log("Nuevos datos de envío del usuario:", {
                region,
                manzana,
                lote,
                colonia,
                calle,
                numero_interior,
                numero_exterior,
                codigo_postal,
                referencia
            });

            const { data, error } = await supabase
                .from("direcciones_usuario")
                .update({
                    "region/supermanzana": region,
                    manzana: manzana,
                    lote: lote,
                    "colonia/fraccionamiento": colonia,
                    calle: calle,
                    numero_interior: numero_interior,
                    numero_exterior: numero_exterior,
                    codigo_postal: codigo_postal,
                    referencia: referencia
                })
                .eq("id", id)
                .select();
            if (error) throw error;
            console.log("Datos de envío del usuario actualizados exitosamente:", data);
            return data;
        } catch (error) {
            throw new Error(`Error al actualizar los datos de envío del usuario: ${error.message}`);
        }

    }

    async deleteUserShippingDataById(id) {
        try {
            console.log("Eliminando datos de envío del usuario con id:", id);
            const { data, error } = await supabase
                .from("direcciones_usuario")
                .delete()
                .eq("id", id)
                .select();
            if (error) throw error;
            console.log("Datos de envío del usuario eliminados exitosamente:", data);
            return data;
        } catch (error) {
            throw new Error(`Error al eliminar los datos de envío del usuario: ${error.message}`);
        }
    }
}