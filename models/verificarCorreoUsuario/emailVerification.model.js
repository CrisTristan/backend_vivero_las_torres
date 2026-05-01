import { supabase } from "../../database/supaBaseConnection.js";

export default class EmailVerificationModel {

    constructor() { }

    async saveVerificationToken(userId, token, expiration) {

        try {
            const { data, error } = await supabase
                .from("email_verification_tokens")
                .insert([{ usuario_id: userId, verification_token: token, verification_token_expires_at: expiration }])
                .select()
                .single();

            if (error) {
                console.error("Error al guardar el token de verificación:", error);
                throw new Error(`Error al guardar el token de verificación: ${error.message}`);
            }

            console.log("Token de verificación guardado:", data);
            return data;  // Retorna el objeto directomente en lugar de un array

        } catch (error) {
            console.error("Error en saveVerificationToken:", error);
            throw new Error(`Error en saveVerificationToken: ${error.message}`);
        }
    }

    async findValidToken(token) {
        const { data, error } = await supabase
            .from("email_verification_tokens")
            .select("*")
            .eq("verification_token", token)
            .eq("used", false) // Asegurarse de que el token no haya sido usado
            .single();

        if (error) {
            console.error("Error al buscar el token de verificación:", error);
            throw new Error(`Error al buscar el token de verificación: ${error.message}`);
        }

        return data;
    }

    // Marcar un token como utilizado para evitar reutilización
    async invalidateToken(token) {
        const { data, error } = await supabase
            .from('email_verification_tokens')
            .update({ used: true })
            .eq('verification_token', token)
            .single();

        if (error) {
            throw new Error('Error al invalidar token: ' + error.message);
        }
        return data;
    }

    // Actualizar el estado del usuario a "correo_verificado" en la tabla de usuarios
    async updateUserEmailStatus(userId) {
        const { data, error } = await supabase
            .from('usuarios')
            .update({ correo_verificado: true })
            .eq('id', userId)
            .single();

        if (error) {
            throw new Error('Error al actualizar el estado del usuario: ' + error.message);
        }
        return data;
    }

}