import { Router } from "express";
import TierraController from "../../controllers/tierra/tierra.controller.js";

const router = Router();

router.put("/tierra/updateTierraById/:id", async (req, res) => {
  try {
    const tierraId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(tierraId)) {
      return res.status(400).send({ error: "El id de la tierra debe ser un numero valido" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send({ error: "Debes enviar al menos un campo para actualizar" });
    }

    const tierraController = new TierraController();
    const updatedSoil = await tierraController.updateTierraById(tierraId, req.body);

    if (!updatedSoil) {
      return res.status(404).send({ error: "Tierra no encontrada" });
    }

    return res.send({ tierra: updatedSoil });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

export default router;
