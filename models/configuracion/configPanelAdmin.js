import { supabase } from "../../database/supaBaseConnection.ts";

export default class ConfigPanelAdminModel {

    constructor(){}

    async getAllConfiguration(userId) {
        try {
            // Obtener configuración global del panel
            const { data: configData, error: configError } = await supabase
                .from("configuracion_panel_admin")
                .select("*")
                .eq("id", 1)
                .single();
            
            if (configError) throw configError;

            // Obtener datos del usuario específico (notificaciones)
            const { data: userData, error: userError } = await supabase
                .from("usuarios")
                .select("permitir_notificaciones_email")
                .eq("id", userId)
                .single();
            
            if (userError) throw userError;

            // Combinar ambos datos
            const result = {
                ...configData,
                user_configuration: userData
            };

            return result;
        } catch (error) {
            console.error("Error al obtener la configuración del panel admin:", error);
            throw new Error(`Error al obtener la configuración del panel admin: ${error.message}`);
        }
    }

    async updateShippingCost(newShippingCost) {
        try {
            const { data, error } = await supabase
                .from("configuracion_panel_admin")
                .update({ costo_envio: newShippingCost })
                .eq("id", 1)
                .select()
                .single();
            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Error al actualizar el costo de envío: ${error.message}`);
        }
    }

}