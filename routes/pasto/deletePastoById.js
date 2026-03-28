import { Router } from "express";
import PastoController from "../../controllers/pasto/pasto.controller.js";

const router = Router();

router.delete("/pasto/deletePastoById/:id", async (req, res) => {
  try {
    const pastoId = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(pastoId)) {
      return res.status(400).send({ error: "El id del pasto debe ser un número válido" });
    }
    const pastoController = new PastoController();
    const deleted = await pastoController.deletePastoById(pastoId);
    if (!deleted) {
      return res.status(404).send({ error: "Pasto no encontrado" });
    }
    return res.send({ message: "Pasto eliminado correctamente" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

export default router;
