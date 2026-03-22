import { Router } from 'express';
import PlantaController from '../../controllers/planta.controller.js';

const router = Router();

router.get('/getAllPlants', async (req, res) => {
	try {
		const plantaController = new PlantaController();
		const plantas = await plantaController.getAllPlantsWithProducts();
		res.send({ plantas });
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

export default router;
