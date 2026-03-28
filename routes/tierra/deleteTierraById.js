import { Router } from "express";
import TierraController from "../../controllers/tierra/tierra.controller.js";

const router = Router();

router.delete("/tierra/deleteTierraById/:id", async (req, res) => {
  try {
    const tierraId = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(tierraId)) {
      return res.status(400).send({ error: "El id de la tierra debe ser un número válido" });
    }
    const tierraController = new TierraController();
    const deleted = await tierraController.deleteTierraById(tierraId);
    if (!deleted) {
      return res.status(404).send({ error: "Tierra no encontrada" });
    }
    return res.send({ message: "Tierra eliminada correctamente" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

export default router;
