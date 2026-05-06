import { Router } from "express";
import UserShippingDataController from "../../controllers/userShippingData/userShippingDate.controller.js";

const router = Router();

router.get("/direcciones_usuario/getUserShippingDataByUserId/:usuario_id", async (req, res) => {
    
    try {
        const usuario_id = Number.parseInt(req.params.usuario_id, 10);

        if (Number.isNaN(usuario_id)) {
            return res.status(400).json({ error: "El id del usuario debe ser un numero valido" });
        }

        const userShippingDataController = new UserShippingDataController();
        const userShippingData = await userShippingDataController.getUserShippingDataByUserId(usuario_id);
        if(userShippingData.length === 0) {
            return res.status(404).json({ message: "No se encontraron datos de envío para el usuario con el id proporcionado" });
        }
        const normalizedData = userShippingData.map(data => {
            return {
                id: data.id,
                region: data.region,
                manzana: data.manzana,
                lote: data.lote,
                colonia: data.colonia,
                calle: data.calle,
                numero_interior: data.numero_interior,
                numero_exterior: data.numero_exterior,
                codigo_postal: data.codigo_postal,
                referencia: data.referencia
            };
        });

        res.status(200).json({ message: "Datos de envío del usuario encontrados exitosamente", data: normalizedData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;