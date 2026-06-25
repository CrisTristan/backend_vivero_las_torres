import { Router } from "express";
import EmailVerificationController from "../../controllers/verificarCorreoUsuario/emailVerification.controller.ts";
import isPostgrestError from '../../Guards/supabase_guard.ts';
import UserController from "../../controllers/user.controller.ts";
import sendVerificationEmailController from '../../controllers/email/sendVerificationEmail.controller.ts';

const router = Router();

router.get("/email-verification/verify", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ error: "Token es obligatorio" });
    }
    // Aquí se debería validar el token y actualizar el estado del usuario a "verified" en la base de datos.
    const controller = new EmailVerificationController();
    const { valid, user_id, message, error } = await controller.validateToken(token as string);

    if (!valid) {
      if (isPostgrestError(error)) {
        if (error.details && error.details.includes('0 rows')) {
          return res.status(404).json({
            user_id: user_id,
            error: 'El token proporcionado no fue encontrado. Por favor, solicita un nuevo correo de verificación.'
          });
        }
        return res.status(400).json({ user_id: user_id, error: message });
      }

      return res.status(401).json({ user_id: user_id, error: message });
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

// Endpoint para reenviar el correo de verificación cuando el usuario lo solicite
router.get("/email-verification/resend/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      return res.status(400).json({ error: "ID de usuario es obligatorio" });
    }
    const emailController = new EmailVerificationController();
    const verificationToken = await emailController.saveVerificationToken(Number(user_id));

    const userController = new UserController('', '', '', '', '');
    const userData = await userController.getUserById(Number(user_id));
    
    if (!userData) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const verificationEmailController = new sendVerificationEmailController();

    await verificationEmailController.sendVerificationEmail(userData.correo, verificationToken.verification_token, userData.nombre);

    return res.status(200).json({ message: "Correo de verificación reenviado" });
  } catch (error) {
    console.error('Error al reenviar correo de verificación:', error);
    return res.status(500).json({ error: "Error al reenviar el correo de verificación" });
  }
});

export default router;