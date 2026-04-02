import { Router } from "express";
import UserShippingDataController from "../../controllers/userShippingData/userShippingDate.controller.js";

const router = Router();
router.delete(
  "/direcciones_usuario/deleteUserShippingDataById/:id",
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
      const userShippingDataController = new UserShippingDataController();
      const deletedUserShippingData =
        await userShippingDataController.deleteUserShippingDataById(id);
      if (!deletedUserShippingData || deletedUserShippingData.length === 0) {
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
          message: "Datos de envío del usuario eliminados exitosamente",
          data: deletedUserShippingData,
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

export default router;
