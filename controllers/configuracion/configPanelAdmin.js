import ConfigPanelAdminModel from "../../models/configuracion/configPanelAdmin.js";
import UserController from "../user.controller.ts";

export default class ConfigPanelAdminController {

    constructor(){}

    async getAllConfiguration(userId) {
        
        try {
            const configPanelAdminModel = new ConfigPanelAdminModel();
            const configData = await configPanelAdminModel.getAllConfiguration(userId);
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

    async updateAllowEmailNotifications(userId, allowEmailNotifications) {
        try {
            const userController = new UserController();
            const data = await userController.modifyEmailNotificationPreference(userId, allowEmailNotifications);
            return data;
        } catch (error) {
            throw new Error(`Error al actualizar las notificaciones por email: ${error.message}`);
        }
    }
}