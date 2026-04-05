import { Router } from "express";
import PasswordRecoveryController from "../../controllers/password_recovery/password_recovery.controller.js";

const router = Router();

// PASO 1: Solicitar recuperación de contraseña
// POST /password-recovery
// Body: { correo: "usuario@ejemplo.com" }
router.post("/password-recovery", async (req, res) => {
  try {
    const { correo } = req.body;
    
    // Validar que se proporcionó el correo
    if (!correo) {
      return res.status(400).json({ error: "Correo es obligatorio" });
    }

    // Crear controlador e iniciar proceso de recuperación
    const controller = new PasswordRecoveryController(correo);
    const result = await controller.requestPasswordRecovery();
    
    return res.status(200).json(result);

  } catch (error) {
    console.error('Error en recuperación:', error);
    return res.status(error.statusCode || 500).json({ 
      error: error.message 
    });
  }
});

// PASO 2: Validar token de recuperación
// GET /password-recovery/validate?token=xxxxx
router.get("/password-recovery/validate", async (req, res) => {
  try {
    const { token } = req.query;
    
    // Validar que se proporcionó el token
    if (!token) {
      return res.status(400).json({ error: "Token es obligatorio" });
    }

    // Validar el token
    const controller = new PasswordRecoveryController(null);
    const result = await controller.validateRecoveryToken(token);
    
    return res.status(200).json(result);

  } catch (error) {
    console.error('Error en validación de token:', error);
    return res.status(error.statusCode || 500).json({ 
      error: error.message 
    });
  }
});

// PASO 3: Cambiar contraseña usando token válido
// POST /password-recovery/reset
// Body: { token: "xxxxx", newPassword: "nuevaContraseña123" }
router.post("/password-recovery/reset", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // Validar que se proporcionaron ambos datos
    if (!token || !newPassword) {
      return res.status(400).json({ 
        error: "Token y nueva contraseña son obligatorios" 
      });
    }

    // Procesir el reset de contraseña
    const controller = new PasswordRecoveryController(null);
    const result = await controller.resetPassword(token, newPassword);
    
    return res.status(200).json(result);

  } catch (error) {
    console.error('Error en reset de contraseña:', error);
    return res.status(error.statusCode || 500).json({ 
      error: error.message 
    });
  }
});

export default router;