import { Router } from "express";
import DireccionEnvioController from "../../controllers/direcciones_envio/direccionEnvio.controller.js";

const router = Router();

router.post("/direcciones_envio/createDireccionEnvioByOrderId/:orderId", async (req, res) => {
    
    try {
        const orderId = Number.parseInt(req.params.orderId, 10);

        if (Number.isNaN(orderId)) {
            return res.status(400).json({ error: "El id de la orden debe ser un numero valido" });
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
        const direccionEnvioController = new DireccionEnvioController();
        const newDireccionEnvio = await direccionEnvioController.createDireccionEnvioByOrderId({
            orden_id: orderId,
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
        const normalizedData = newDireccionEnvio.map(item => ({
            id: item.id,
            orden_id: item.orden_id,
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
        res.status(201).json({ message: "Dirección de envío creada exitosamente", data: normalizedData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
