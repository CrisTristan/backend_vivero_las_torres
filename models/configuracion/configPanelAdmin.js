import { supabase } from "../../database/supaBaseConnection.js";

export default class ConfigPanelAdminModel {

    constructor(){}

    async getAllConfiguration() {
        try {
            const { data, error } = await supabase
                .from("configuracion_panel_admin")
                .select("*")
                .single();
            if (error) throw error;
            // console.log("Configuración obtenida:", data);
            return data;
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

    async updateAllowEmailNotifications(allowEmailNotifications) {
        try {
            const { data, error } = await supabase
                .from("configuracion_panel_admin")
                .update({ permitir_notificaciones_email: allowEmailNotifications })
                .eq("id", 1)
                .select()
                .single();
            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Error al actualizar las notificaciones por email: ${error.message}`);
        }
    }

}