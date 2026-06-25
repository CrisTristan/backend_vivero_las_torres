import EmailVerificationModel from "../../models/verificarCorreoUsuario/emailVerification.model.ts";
import crypto from 'crypto'; // Para generar tokens aleatorios seguros
import type {PostgrestError} from '@supabase/supabase-js';

export interface TokenValidationResult {
    valid: boolean;
    user_id: number | null;
    message: string;
    error?: PostgrestError; // Agregar la propiedad error opcional
}

export default class EmailVerificationController {

    constructor() {}

    async generateVerificationToken() {
        // Aquí se debería generar un token único para la verificación de correo
        // Generar un token aleatorio seguro de 32 bytes y convertirlo a hexadecimal
        return crypto.randomBytes(32).toString('hex');
    }

    async saveVerificationToken(userId : number) {
        const token = await this.generateVerificationToken();
        const expiration = new Date(Date.now() + 1 * 60 * 60 * 1000); // El token expira en 5 minutos
        const emailVerificationModel = new EmailVerificationModel();
        return await emailVerificationModel.saveVerificationToken(userId, token, expiration);
    }

    // PASO 2: Validar que el token sea válido y no haya expirado
        async validateToken(token : string) : Promise<TokenValidationResult> {
            try {
                // Buscar el token en BD
                const model = new EmailVerificationModel();
                const tokenRecord = await model.findValidToken(token);
    
                // Obtener hora actual
                const now = new Date();
                
                // Convertir expires_at a Date
                // Supabase devuelve ISO string con Z (UTC), así que new Date() lo interpreta correctamente
                const expiresAt = new Date(tokenRecord.verification_token_expires_at);
                
                // Verificar que no ha expirado
                if (now > expiresAt) {
                    console.log(`[EMAIL VERIFICATION] ⏰ Token EXPIRADO para ${tokenRecord.usuario_id}`);
                    //Retornar un objeto indicando que el token ha expirado
                    return {
                        valid: false,
                        user_id: tokenRecord.usuario_id,
                        message: 'El token ha expirado. Por favor, solicita un nuevo correo de verificación.'
                    };
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
                    message: 'Error al validar el token de verificación',
                    error: error as PostgrestError // Convertir a PostgrestError si es posible
                };
            }
        }

    //Paso 3: Marcar el token como utilizado para evitar reutilización
    async updateUserEmailStatus(userId : number, token: string) {
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