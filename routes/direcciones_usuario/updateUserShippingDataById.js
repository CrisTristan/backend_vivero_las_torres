import { Router } from "express";
import UserShippingDataController from "../../controllers/userShippingData/userShippingDate.controller.js";

const router = Router();
router.put(
  "/direcciones_usuario/updateUserShippingDataById/:id",
  async (req, res) => {
    try {
      const id = Number.parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res.status(400).json({
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
        return res.status(404).json({
          message:
            "No se encontraron datos de envío para el usuario con el id proporcionado",
        });
      }

      console.log(
        "Datos de envío del usuario actualizados:",
        updatedUserShippingData,
      );

      const normalizedUserShippingData = updatedUserShippingData.map((data) => {
        return {
          id: data.id,
          region: data.region,
          manzana: data.manzana,
          lote: data.lote,
          colonia: data.colonia,
          calle: data.calle,
          numero_interior: data.numero_interior,
          numero_exterior: data.numero_exterior,
          codigo_postal: data.codigo_postal,
          referencia: data.referencia,
        };
      });

      res.status(200).json({
        message: "Datos de envío del usuario actualizados exitosamente",
        data: normalizedUserShippingData,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

export default router;
