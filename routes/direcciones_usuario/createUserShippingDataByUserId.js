import { Router } from "express";
import UserShippingDataController from "../../controllers/userShippingData/userShippingDate.controller.js";

const router = Router();

router.post("/direcciones_usuario/createUserShippingDataByUserId/:usuario_id", async (req, res) => {
    
    try {
        const usuario_id = Number.parseInt(req.params.usuario_id, 10);

        if (Number.isNaN(usuario_id)) {
            return res.status(400).json({ error: "El id del usuario debe ser un numero valido" });
        }

        const {
            region,
            manzana,
            lote,
            colonia,
            calle,
            numero_interior,
            numero_exterior,
            codigo_postal,
            referencia
        } = req.body;
        const userShippingDataController = new UserShippingDataController();
        const newUserShippingData = await userShippingDataController.createUserShippingData({
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
        });
        const normalizedData = newUserShippingData.map(item => ({
            id: item.id,
            usuario_id: item.usuario_id,
            region: item["region/supermanzana"],
            manzana: item.manzana,
            lote: item.lote,
            colonia: item["colonia/fraccionamiento"],
            calle: item.calle,
            numero_interior: item.numero_interior,
            numero_exterior: item.numero_exterior,
            codigo_postal: item.codigo_postal,
            referencia: item.referencia
        }));
        res.status(201).json({ message: "Datos de envío del usuario creados exitosamente", data: normalizedData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;