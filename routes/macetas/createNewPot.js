import { Router } from "express";
import MacetaController from "../../controllers/maceta.controller.js";

const router = Router();

router.post("/macetas/createNew", async (req, res) => {
  try {
    const { nombre, precio, imagen, stock, categoriaSeleccionada, descripcion, volumen, diametro_superior, diametro_inferior, altura, tipo, es_jardinera } = req.body;

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
      volumen: volumen ? String(volumen).trim() : "",
      diametro_superior: diametro_superior ? String(diametro_superior).trim() : "",
      diametro_inferior: diametro_inferior ? String(diametro_inferior).trim() : "",
      altura: altura ? String(altura).trim() : "",
      tipo: tipo ? String(tipo).trim() : "",
      es_jardinera: es_jardinera === true || es_jardinera === "true",
    };

    const macetaController = new MacetaController();
    const createdPot = await macetaController.createNewPot(payload);

    return res.status(201).send({ maceta: createdPot });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

export default router;