import { Router } from "express";
import PlantaController from "../../controllers/planta.controller.js";

const router = Router();

router.delete("/plantas/deletePlantById/:id", async (req, res) => {
  try {
    const plantId = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(plantId)) {
      return res.status(400).send({ error: "El id de la planta debe ser un número válido" });
    }
    const plantaController = new PlantaController();
    const deleted = await plantaController.deletePlantById(plantId);
    if (!deleted) {
      return res.status(404).send({ error: "Planta no encontrada" });
    }
    return res.send({ message: "Planta eliminada correctamente" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

export default router;
