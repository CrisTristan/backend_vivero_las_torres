import ConfigPanelAdminModel from "../../models/configuracion/configPanelAdmin.js";

export default class ConfigPanelAdminController {

    constructor(){}

    async getAllConfiguration() {
        
        try {
            const configPanelAdminModel = new ConfigPanelAdminModel();
            const configData = await configPanelAdminModel.getAllConfiguration();
            return configData
        } catch (error) {
            throw new Error(`Error al obtener la configuración: ${error.message}`);
        }
    }

    async updateShippingCost(newShippingCost) {
        try {
            const configPanelAdminModel = new ConfigPanelAdminModel();
            const { data, error } = await configPanelAdminModel.updateShippingCost(newShippingCost);
            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Error al actualizar el costo de envío: ${error.message}`);
        }
    }

    async updateAllowEmailNotifications(allowEmailNotifications) {
        try {
            const configPanelAdminModel = new ConfigPanelAdminModel();
            const { data, error } = await configPanelAdminModel.updateAllowEmailNotifications(allowEmailNotifications);
            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Error al actualizar las notificaciones por email: ${error.message}`);
        }
    }
}