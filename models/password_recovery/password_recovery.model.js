import { supabase } from "../../database/supaBaseConnection.js";

export default class PasswordRecoveryModel {
    constructor(correo) {
        this.correo = correo;
    }

    // Guardar un nuevo token de recuperación en la BD
    async createRecoveryToken(token, expiresAt) {
        // Convertir la fecha a formato ISO con zona horaria UTC explícita
        // Supabase necesita el formato completo con Z para interpretar correctamente como UTC
        const expiresAtISO = expiresAt.toISOString();
        
        const { data, error } = await supabase
            .from('password_recovery_tokens')
            .insert([{ 
                correo: this.correo, 
                token,
                expires_at: expiresAtISO, // Formato: 2026-04-05T09:10:40.799Z
                used: false // Token aún no ha sido utilizado
            }])
            .select();
        
        if (error) {
            throw new Error('Error al crear token de recuperación: ' + error.message);
        }
        return data[0];
    }

    // Buscar un token válido (no expirado y no usado) en la BD
    async findValidToken(token) {
        const { data, error } = await supabase
            .from('password_recovery_tokens')
            .select('*')
            .eq('token', token)
            .eq('used', false) // Solo tokens no utilizados
            .maybeSingle();
        
        if (error) {
            throw new Error('Error al buscar token: ' + error.message);
        }
        
        return data;
    }

    // Marcar un token como utilizado para evitar reutilización
    async invalidateToken(token) {
        const { data, error } = await supabase
            .from('password_recovery_tokens')
            .update({ used: true })
            .eq('token', token)
            .select();
        
        if (error) {
            throw new Error('Error al invalidar token: ' + error.message);
        }
        return data[0];
    }

    // Actualizar la contraseña del usuario
    async updateUserPassword(hashedPassword) {
        const { data, error } = await supabase
            .from('usuarios')
            .update({ password_hashed: hashedPassword })
            .eq('correo', this.correo)
            .select();
        
        if (error) {
            throw new Error('Error al actualizar contraseña: ' + error.message);
        }
        return data[0];
    }

    // Obtener usuario por correo para verificar que existe
    async getUserByEmail() {
        const { data, error } = await supabase
            .from('usuarios')
            .select('id, correo, nombre')
            .eq('correo', this.correo)
            .maybeSingle();
        
        if (error) {
            throw new Error('Error al obtener usuario: ' + error.message);
        }
        return data;
    }
}