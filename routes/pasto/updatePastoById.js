import { Router } from "express";
import PastoController from "../../controllers/pasto/pasto.controller.js";

const router = Router();

router.put("/pasto/updatePastoById/:id", async (req, res) => {
  try {
    const pastoId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(pastoId)) {
      return res.status(400).send({ error: "El id del pasto debe ser un numero valido" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send({ error: "Debes enviar al menos un campo para actualizar" });
    }

    const pastoController = new PastoController();
    const updatedGrass = await pastoController.updatePastoById(pastoId, req.body);

    if (!updatedGrass) {
      return res.status(404).send({ error: "Pasto no encontrado" });
    }

    return res.send({ pasto: updatedGrass });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

export default router;
