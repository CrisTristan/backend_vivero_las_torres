import { Router } from "express";
import UserShippingDataController from "../../controllers/userShippingData/userShippingDate.controller.js";

const router = Router();
router.put(
  "/direcciones_usuario/updateUserShippingDataById/:id",
  async (req, res) => {
    try {
      const id = Number.parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res
          .status(400)
          .json({
            error:
              "El id de los datos de envío del usuario debe ser un numero valido",
          });
      }
      const {
        region,
        manzana,
        lote,
        colonia,
        calle,
        numero_interior,
        numero_exterior,
        codigo_postal,
        referencia,
      } = req.body;
      const userShippingDataController = new UserShippingDataController();
      const updatedUserShippingData =
        await userShippingDataController.updateUserShippingDataById(id, {
          region,
          manzana,
          lote,
          colonia,
          calle,
          numero_interior,
          numero_exterior,
          codigo_postal,
          referencia,
        });
      if (!updatedUserShippingData) {
        return res
          .status(404)
          .json({
            message:
              "No se encontraron datos de envío para el usuario con el id proporcionado",
          });
      }
      res
        .status(200)
        .json({
          message: "Datos de envío del usuario actualizados exitosamente",
          data: updatedUserShippingData,
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

export default router;
