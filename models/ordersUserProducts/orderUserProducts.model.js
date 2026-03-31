import { supabase } from "../../database/supaBaseConnection.js";

//este modelo podria servir en un futuro para actualizar las tablas ordenes, ordenesProductos y usuarios.
export default class OrdersUserProductsModel {

    async updateOrderById(orderUserProductId, payload) {
        const { data: existingOrderUserProduct, error: fetchError } = await supabase
            .from("ordenes_usuario_productos")
            .select("*")
            .eq("id", orderUserProductId)
            .maybeSingle();
    }
}