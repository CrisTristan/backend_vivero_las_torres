import { Router } from "express";
import PiedraController from "../../controllers/piedras/piedra.controller.js";

const router = Router();

router.post("/piedras/createNew", async (req, res) => {
  try {
    const { nombre, precio, imagen, stock, categoriaSeleccionada, descripcion, esPiedraSuelta } = req.body;

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
      esPiedraSuelta: Boolean(esPiedraSuelta),
    };

    const piedraController = new PiedraController();
    const createdStone = await piedraController.createNewStone(payload);

    return res.status(201).send({ piedra: createdStone });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

export default router;
