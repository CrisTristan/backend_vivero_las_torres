import { Router } from "express";
import PlaguicidaController from "../../controllers/plaguicidas/plaguicida.controller.js";

const router = Router();

router.delete("/plaguicidas/deletePlaguicidaById/:id", async (req, res) => {
  try {
    const plaguicidaId = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(plaguicidaId)) {
      return res.status(400).send({ error: "El id del plaguicida debe ser un número válido" });
    }
    const plaguicidaController = new PlaguicidaController();
    const deleted = await plaguicidaController.deletePlaguicidaById(plaguicidaId);
    if (!deleted) {
      return res.status(404).send({ error: "Plaguicida no encontrado" });
    }
    return res.send({ message: "Plaguicida eliminado correctamente" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

export default router;
