import { Router } from "express";
import EmailVerificationController from "../../controllers/verificarCorreoUsuario/emailVerification.controller.js";

const router = Router();

router.get("/email-verification/verify", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ error: "Token es obligatorio" });
    }
    // Aquí se debería validar el token y actualizar el estado del usuario a "verified" en la base de datos.
    const controller = new EmailVerificationController();
    const { valid, user_id, message } = await controller.validateToken(token);

    if (!valid) {
      return res.status(400).json({ error: message });
    }
    console.log("[EMAIL VERIFICATION] Usuario verificado con ID:", user_id);
    
    // Cambiar el estdo del usuario a "correo_verificado" en la base de datos
    //Nota: updateUserEmailStatus ahora también invalida el token para evitar reutilización
    await controller.updateUserEmailStatus(user_id, token);
    
    return res.status(200).json({ message: message });
    } catch (error) {
        console.error('Error en verificación de correo:', error);
        return res.status(500).json({ error: "Error al verificar el correo electrónico" });
    }
});

export default router;