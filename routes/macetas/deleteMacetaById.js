import { Router } from "express";
import MacetaController from "../../controllers/maceta.controller.js";

const router = Router();

router.delete("/macetas/deleteMacetaById/:id", async (req, res) => {
  try {
    const macetaId = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(macetaId)) {
      return res.status(400).send({ error: "El id de la maceta debe ser un número válido" });
    }
    const macetaController = new MacetaController();
    const deleted = await macetaController.deleteMacetaById(macetaId);
    if (!deleted) {
      return res.status(404).send({ error: "Maceta no encontrada" });
    }
    return res.send({ message: "Maceta eliminada correctamente" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

export default router;
