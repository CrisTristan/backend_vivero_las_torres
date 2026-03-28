import { Router } from "express";
import PiedraController from "../../controllers/piedras/piedra.controller.js";

const router = Router();

router.put("/piedras/updatePiedraById/:id", async (req, res) => {
  try {
    const piedraId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(piedraId)) {
      return res.status(400).send({ error: "El id de la piedra debe ser un numero valido" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send({ error: "Debes enviar al menos un campo para actualizar" });
    }

    const piedraController = new PiedraController();
    const updatedStone = await piedraController.updatePiedraById(piedraId, req.body);

    if (!updatedStone) {
      return res.status(404).send({ error: "Piedra no encontrada" });
    }

    return res.send({ piedra: updatedStone });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

export default router;
