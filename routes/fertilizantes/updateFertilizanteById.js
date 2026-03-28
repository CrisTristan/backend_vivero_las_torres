import { Router } from "express";
import FertilizanteController from "../../controllers/fertilizantes/fertilizante.controller.js";

const router = Router();

router.put("/fertilizantes/updateFertilizanteById/:id", async (req, res) => {
  try {
    const fertilizanteId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(fertilizanteId)) {
      return res.status(400).send({ error: "El id del fertilizante debe ser un numero valido" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send({ error: "Debes enviar al menos un campo para actualizar" });
    }

    const fertilizanteController = new FertilizanteController();
    const updatedFertilizer = await fertilizanteController.updateFertilizanteById(
      fertilizanteId,
      req.body,
    );

    if (!updatedFertilizer) {
      return res.status(404).send({ error: "Fertilizante no encontrado" });
    }

    return res.send({ fertilizante: updatedFertilizer });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

export default router;
