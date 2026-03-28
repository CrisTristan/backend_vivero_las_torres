import { Router } from "express";
import PlaguicidaController from "../../controllers/plaguicidas/plaguicida.controller.js";

const router = Router();

router.put("/plaguicidas/updatePlaguicidaById/:id", async (req, res) => {
  try {
    const plaguicidaId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(plaguicidaId)) {
      return res.status(400).send({ error: "El id del plaguicida debe ser un numero valido" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send({ error: "Debes enviar al menos un campo para actualizar" });
    }

    const plaguicidaController = new PlaguicidaController();
    const updatedPesticide = await plaguicidaController.updatePlaguicidaById(
      plaguicidaId,
      req.body,
    );

    if (!updatedPesticide) {
      return res.status(404).send({ error: "Plaguicida no encontrado" });
    }

    return res.send({ plaguicida: updatedPesticide });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

export default router;
