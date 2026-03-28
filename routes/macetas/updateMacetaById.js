import { Router } from 'express';
import MacetaController from '../../controllers/maceta.controller.js';

const router = Router();

router.put('/macetas/updateMacetaById/:id', async (req, res) => {
  try {
    const macetaId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(macetaId)) {
      return res.status(400).send({ error: 'El id de la maceta debe ser un numero valido' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send({ error: 'Debes enviar al menos un campo para actualizar' });
    }

    const macetaController = new MacetaController();
    const updatedPot = await macetaController.updateMacetaById(macetaId, req.body);

    if (!updatedPot) {
      return res.status(404).send({ error: 'Maceta no encontrada' });
    }

    return res.send({ maceta: updatedPot });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

export default router;
