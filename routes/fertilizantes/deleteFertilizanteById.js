import { Router } from "express";
import FertilizanteController from "../../controllers/fertilizantes/fertilizante.controller.js";

const router = Router();

router.delete("/fertilizantes/deleteFertilizanteById/:id", async (req, res) => {
  try {
    const fertilizanteId = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(fertilizanteId)) {
      return res.status(400).send({ error: "El id del fertilizante debe ser un número válido" });
    }
    const fertilizanteController = new FertilizanteController();
    const deleted = await fertilizanteController.deleteFertilizanteById(fertilizanteId);
    if (!deleted) {
      return res.status(404).send({ error: "Fertilizante no encontrado" });
    }
    return res.send({ message: "Fertilizante eliminado correctamente" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

export default router;
