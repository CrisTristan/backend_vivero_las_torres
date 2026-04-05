import crypto from 'crypto'; // Para generar tokens aleatorios seguros
import bcrypt from 'bcrypt'; // Para hashear contraseñas
import PasswordRecoveryModel from '../../models/password_recovery/password_recovery.model.js';
import EmailController from '../email/sendRecoveryEmail.controllet.js'; // Controlador para enviar emails

// Función auxiliar para crear errores HTTP
function createHttpError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

export default class PasswordRecoveryController {
    
    constructor(correo) {
        this.correo = correo;
    }

    // PASO 1: El usuario solicita recuperación de contraseña
    // - Genera un token aleatorio
    // - Lo guarda en BD con expiración
    // - "Simula" envío de email (en producción, usar nodemailer u otro servicio)
    async requestPasswordRecovery() {
        try {
            // Verificar que el usuario existe
            const model = new PasswordRecoveryModel(this.correo);
            const user = await model.getUserByEmail();
            
            if (!user) {
                // Por seguridad, no revelar si el correo existe o no
                throw createHttpError('Si el correo existe, recibirá instrucciones de recuperación', 200);
            }

            // Generar un token aleatorio seguro
            // Opción 1: Token aleatorio de 32 bytes en formato hex (más seguro para BD)
            const recoveryToken = crypto.randomBytes(32).toString('hex');
            
            // Opción 2 (alternativa): Usar JWT con expiración corta
            // const recoveryToken = jwt.sign(
            //     { correo: this.correo, type: 'password-recovery' },
            //     process.env.PASSWORD_RECOVERY_SECRET || 'recovery-secret',
            //     { expiresIn: '15m' }
            // );

            // Calcular fecha de expiración (15 minutos desde ahora)
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

            // Guardar token en BD
            const tokenRecord = await model.createRecoveryToken(recoveryToken, expiresAt);
            
            // AQUÍ VA: Enviar email con enlace de recuperación
            // Esperaría por ejemplo: /reset-password?token=<token>
            // En producción, esto sería:
            const emailController = new EmailController();
            await emailController.sendRecoveryEmail(this.correo, recoveryToken);
            console.log(`[PASSWORD RECOVERY] Token generado para ${this.correo}: ${recoveryToken}`);
            console.log(`[PASSWORD RECOVERY] Expira en: ${expiresAt}`);
            
            // En desarrollo, podrías retornar el token para testing
            return {
                success: true,
                message: 'Instrucciones de recuperación enviadas al correo',
                // token: recoveryToken // SOLO EN DESARROLLO/TESTING
            };

        } catch (error) {
            console.error('[PASSWORD RECOVERY ERROR]', error);
            throw error;
        }
    }

    // PASO 2: Validar que el token sea válido y no haya expirado
    async validateRecoveryToken(token) {
        try {
            // Buscar el token en BD
            const model = new PasswordRecoveryModel(null);
            const tokenRecord = await model.findValidToken(token);

            // Token no encontrado o ya usado
            if (!tokenRecord) {
                throw createHttpError('Token inválido o ya ha sido utilizado', 400);
            }

            // Obtener hora actual
            const now = new Date();
            
            // Convertir expires_at a Date
            // Supabase devuelve ISO string con Z (UTC), así que new Date() lo interpreta correctamente
            const expiresAt = new Date(tokenRecord.expires_at);
            
            // Verificar que no ha expirado
            if (now > expiresAt) {
                console.log(`[PASSWORD RECOVERY] ⏰ Token EXPIRADO para ${tokenRecord.correo}`);
                throw createHttpError('Token expirado. Solicita un nuevo correo de recuperación', 400);
            }

            console.log(`[PASSWORD RECOVERY] ✅ Token VÁLIDO para ${tokenRecord.correo}`);
            
            // Token es válido
            return {
                valid: true,
                correo: tokenRecord.correo,
                message: 'Token válido. Puedes proceder a cambiar la contraseña'
            };

        } catch (error) {
            console.error('[VALIDATE TOKEN ERROR]', error);
            throw error;
        }
    }

    // PASO 3: Cambiar contraseña y usar el token
    async resetPassword(token, newPassword) {
        try {
            // Validar que el token sea válido
            await this.validateRecoveryToken(token);

            // Validar longitud mínima de contraseña
            if (!newPassword || newPassword.length < 8) {
                throw createHttpError('La contraseña debe tener al menos 8 caracteres', 400);
            }

            // Hashear la nueva contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Obtener el correo asociado al token
            const model = new PasswordRecoveryModel(null);
            const tokenRecord = await model.findValidToken(token);
            
            // Crear modelo con el correo correcto
            const userModel = new PasswordRecoveryModel(tokenRecord.correo);

            // Actualizar la contraseña en BD
            await userModel.updateUserPassword(hashedPassword);

            // Invalidar el token para evitar reutilización
            await userModel.invalidateToken(token);

            console.log(`[PASSWORD RESET SUCCESS] Contraseña actualizada para ${tokenRecord.correo}`);

            return {
                success: true,
                message: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión'
            };

        } catch (error) {
            console.error('[RESET PASSWORD ERROR]', error);
            throw error;
        }
    }
}