import { Router } from "express";
import PiedraController from "../../controllers/piedras/piedra.controller.js";

const router = Router();

router.delete("/piedras/deletePiedraById/:id", async (req, res) => {
  try {
    const piedraId = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(piedraId)) {
      return res.status(400).send({ error: "El id de la piedra debe ser un número válido" });
    }
    const piedraController = new PiedraController();
    const deleted = await piedraController.deletePiedraById(piedraId);
    if (!deleted) {
      return res.status(404).send({ error: "Piedra no encontrada" });
    }
    return res.send({ message: "Piedra eliminada correctamente" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

export default router;
