import { Router } from "express";
import FertilizanteController from "../../controllers/fertilizantes/fertilizante.controller.js";

const router = Router();

router.post("/fertilizantes/createNew", async (req, res) => {
  try {
    const { nombre, precio, imagen, stock, categoriaSeleccionada, descripcion } = req.body;

    if (!nombre || !descripcion || categoriaSeleccionada == null) {
      return res.status(400).send({
        error: "nombre, categoriaSeleccionada y descripcion son obligatorios",
      });
    }

    const parsedPrice = Number(precio);
    const parsedStock = Number(stock);

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      return res.status(400).send({ error: "precio debe ser un numero mayor o igual a 0" });
    }

    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      return res.status(400).send({ error: "stock debe ser un numero mayor o igual a 0" });
    }

    const payload = {
      nombre: String(nombre).trim(),
      precio: Math.max(0, parsedPrice),
      imagen: imagen ? String(imagen).trim() : "",
      stock: Math.max(0, parsedStock),
      categoriaSeleccionada,
      descripcion: String(descripcion).trim(),
    };

    const fertilizanteController = new FertilizanteController();
    const createdFertilizer = await fertilizanteController.createNewFertilizer(payload);

    return res.status(201).send({ fertilizante: createdFertilizer });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

export default router;
