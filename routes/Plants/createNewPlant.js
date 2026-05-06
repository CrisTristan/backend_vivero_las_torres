import { Router } from 'express';
import PlantaController from '../../controllers/planta.controller.js';

const router = Router();

router.post('/plantas/createNew', async (req, res) => {
  try {
    const {
      nombre,
      precio,
      imagen,
      stock,
      categoriaSeleccionada,
      tipo,
      nivel_cuidado,
      descripcion,
      volumen,
    } = req.body;

    if (!nombre || !tipo || !nivel_cuidado || !descripcion || !volumen || categoriaSeleccionada == null) {
      return res.status(400).send({
        error:
          'nombre, categoriaSeleccionada, tipo, nivel_cuidado, descripcion y volumen son obligatorios',
      });
    }

    const parsedPrice = Number(precio);
    const parsedStock = Number(stock);

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      return res.status(400).send({ error: 'precio debe ser un número mayor o igual a 0' });
    }

    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      return res.status(400).send({ error: 'stock debe ser un número mayor o igual a 0' });
    }

    const payload = {
      nombre: String(nombre).trim(),
      precio: Math.max(0, parsedPrice),
      imagen: imagen ? String(imagen).trim() : '',
      stock: Math.max(0, parsedStock),
      categoriaSeleccionada,
      tipo: String(tipo),
      nivel_cuidado: String(nivel_cuidado).toLowerCase(),
      descripcion: String(descripcion).trim(),
      volumen: String(volumen).trim(),
    };

    const plantaController = new PlantaController();
    const createdPlant = await plantaController.createNewPlant(payload);

    return res.status(201).send({ planta: createdPlant });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

export default router;
