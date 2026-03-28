import { Router } from "express";
import HerbicidaController from "../../controllers/herbicidas/herbicida.controller.js";

const router = Router();

router.delete("/herbicidas/deleteHerbicidaById/:id", async (req, res) => {
  try {
    const herbicidaId = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(herbicidaId)) {
      return res.status(400).send({ error: "El id del herbicida debe ser un número válido" });
    }
    const herbicidaController = new HerbicidaController();
    const deleted = await herbicidaController.deleteHerbicidaById(herbicidaId);
    if (!deleted) {
      return res.status(404).send({ error: "Herbicida no encontrado" });
    }
    return res.send({ message: "Herbicida eliminado correctamente" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

export default router;
