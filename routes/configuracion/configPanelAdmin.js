import { Router } from "express";
import ConfigPanelAdminController from "../../controllers/configuracion/configPanelAdmin.js";

const router = Router();

router.get("/configuracion", async (req, res) => {

    try {
        const configPanelAdminController = new ConfigPanelAdminController();
        const configData = await configPanelAdminController.getAllConfiguration();
        return res.status(200).json(configData);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

});

router.put("/configuracion/costo-envio", async (req, res) => {
    const shippingCost = Number.parseFloat(req.query.shippingCost);

    if (Number.isNaN(shippingCost)) {
        return res.status(400).json({ error: "El costo de envío debe ser un número válido" });
    }

    try {
        const configPanelAdminController = new ConfigPanelAdminController();
        const updatedConfig = await configPanelAdminController.updateShippingCost(shippingCost);
        return res.status(200).json({ message: "Costo de envío actualizado exitosamente", updatedConfig });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

});

router.put("/configuracion/notificaciones-email", async (req, res) => {
    const allowEmailNotificationsParam = req.query.allowEmailNotifications;

    if (!allowEmailNotificationsParam || (allowEmailNotificationsParam !== "true" && allowEmailNotificationsParam !== "false")) {
        return res.status(400).json({ error: "El valor de allowEmailNotifications debe ser 'true' o 'false'" });
    }

    const allowEmailNotifications = allowEmailNotificationsParam === "true";

    try {
        const configPanelAdminController = new ConfigPanelAdminController();
        const updatedConfig = await configPanelAdminController.updateAllowEmailNotifications(allowEmailNotifications);
        return res.status(200).json({ message: "Notificaciones por email actualizadas exitosamente", updatedConfig });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


export default router;
