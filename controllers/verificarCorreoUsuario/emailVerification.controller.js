import EmailVerificationModel from "../../models/verificarCorreoUsuario/emailVerification.model.js";
import crypto from 'crypto'; // Para generar tokens aleatorios seguros

export default class EmailVerificationController {

    constructor() {}

    async generateVerificationToken() {
        // Aquí se debería generar un token único para la verificación de correo
        // Generar un token aleatorio seguro de 32 bytes y convertirlo a hexadecimal
        return crypto.randomBytes(32).toString('hex');
    }

    async saveVerificationToken(userId) {
        const token = await this.generateVerificationToken();
        const expiration = new Date(Date.now() + 1 * 60 * 60 * 1000); // El token expira en 5 minutos
        const emailVerificationModel = new EmailVerificationModel();
        return await emailVerificationModel.saveVerificationToken(userId, token, expiration);
    }

    // PASO 2: Validar que el token sea válido y no haya expirado
        async validateToken(token) {
            try {
                // Buscar el token en BD
                const model = new EmailVerificationModel();
                const tokenRecord = await model.findValidToken(token);
    
                // Token no encontrado o ya usado
                if (!tokenRecord) {
                    throw createHttpError('Token inválido o ya ha sido utilizado', 400);
                }
    
                // Obtener hora actual
                const now = new Date();
                
                // Convertir expires_at a Date
                // Supabase devuelve ISO string con Z (UTC), así que new Date() lo interpreta correctamente
                const expiresAt = new Date(tokenRecord.verification_token_expires_at);
                
                // Verificar que no ha expirado
                if (now > expiresAt) {
                    console.log(`[EMAIL VERIFICATION] ⏰ Token EXPIRADO para ${tokenRecord.usuario_id}`);
                    throw createHttpError('Token expirado. Solicita un nuevo correo de verificación', 400);
                }
    
                console.log(`[EMAIL VERIFICATION] ✅ Token VÁLIDO para ${tokenRecord.usuario_id}`);
                
                // Token es válido
                return {
                    valid: true,
                    user_id: tokenRecord.usuario_id,
                    message: 'Token válido. Correo electrónico verificado exitosamente'
                };
    
            } catch (error) {
                console.error('[VALIDATE TOKEN ERROR]', error);

                return {
                    valid: false,
                    user_id: null,
                    message: error.message || 'Error al validar el token de verificación'
                };
            }
        }

    //Paso 3: Marcar el token como utilizado para evitar reutilización
    async updateUserEmailStatus(userId, token) {
        try {
            const model = new EmailVerificationModel();
            await model.updateUserEmailStatus(userId);
            console.log(`[EMAIL VERIFICATION] ✅ Estado del usuario ACTUALIZADO: ${userId}`);
            //Marcar el token como utilizado
            await model.invalidateToken(token);
            console.log(`[EMAIL VERIFICATION] ✅ Token INVALIDADO para ${userId}`);
        } catch (error) {
            console.error('[INVALIDATE TOKEN ERROR]', error);
            throw error;
        }
    }

}