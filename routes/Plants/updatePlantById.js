import { Router } from 'express';
import PlantaController from '../../controllers/planta.controller.js';

const router = Router();

router.put('/plantas/updatePlantById/:id', async (req, res) => {
  try {
    const plantId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(plantId)) {
      return res.status(400).send({ error: 'El id de la planta debe ser un número válido' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send({ error: 'Debes enviar al menos un campo para actualizar' });
    }

    const plantaController = new PlantaController();
    const updatedPlant = await plantaController.updatePlantById(plantId, req.body);

    if (!updatedPlant) {
      return res.status(404).send({ error: 'Planta no encontrada' });
    }

    return res.send({ planta: updatedPlant });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

export default router;
