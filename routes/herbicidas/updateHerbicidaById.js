import { Router } from "express";
import HerbicidaController from "../../controllers/herbicidas/herbicida.controller.js";

const router = Router();

router.put("/herbicidas/updateHerbicidaById/:id", async (req, res) => {
  try {
    const herbicidaId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(herbicidaId)) {
      return res.status(400).send({ error: "El id del herbicida debe ser un numero valido" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send({ error: "Debes enviar al menos un campo para actualizar" });
    }

    const herbicidaController = new HerbicidaController();
    const updatedHerbicide = await herbicidaController.updateHerbicidaById(
      herbicidaId,
      req.body,
    );

    if (!updatedHerbicide) {
      return res.status(404).send({ error: "Herbicida no encontrado" });
    }

    return res.send({ herbicida: updatedHerbicide });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

export default router;
