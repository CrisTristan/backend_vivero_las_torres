import {supabase} from '../database/supaBaseConnection.ts';
import type {PostgrestError} from '@supabase/supabase-js'

export interface UserRecord {
  id: number;
  nombre: string;
  apellidos: string;
  correo: string;
  password_hashed: string;
  telefono: string;
  rol_usuario: string;
  fechaRegistro: string;
  correo_verificado: boolean;
  permitir_notificaciones_email: boolean;
}

class UserModel {

  nombre: string;
  apellidos: string;
  correo: string;
  password: string;
  rol_usuario: string;
  telefono: string;

  constructor(nombre : string, apellidos: string, correo: string, password: string, rol_usuario = 'cliente', telefono: string) {
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.correo = correo;
    this.password = password;
    this.rol_usuario = rol_usuario;
    this.telefono = telefono;
  }

  async createUser() {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([
        {
          nombre: this.nombre,
          apellidos: this.apellidos,
          correo: this.correo,
          telefono: this.telefono,
          password_hashed: this.password,
          rol_usuario: this.rol_usuario // Asignar rol proporcionado
        }
      ])
      .select();

    if (error) {
      console.log("Error al crear usuario:", error);
      throw error;
    }

    return data;
  }

  async getUserByEmail() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('correo', this.correo)
      .maybeSingle();

    if(error) {
      console.log("Error al obtener usuario por correo:", error);
      throw new Error(error.message);
    }
    return data;
  }

  async getUserById(userId: number) : Promise<UserRecord | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if(error) {
      console.log("Error al obtener usuario por ID:", error);
      throw new Error(error.message);
    }
    return data;
  }

  async getPasswordHashByEmail() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('password_hashed')
      .eq('correo', this.correo)
      .maybeSingle();

    if(error) {
      console.log("Error al obtener contraseña hash por correo:", error);
      throw new Error(error.message);
    }
    return data;
  }

  async getUserEmailStatus() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('correo_verificado')
      .eq('correo', this.correo)
      .maybeSingle();

      if(error) {
        console.log("Error al obtener estado de verificación de correo:", error);
        throw new Error(error.message);
      }
      return data;
  }

  async getAllAdminsWithEmailNotificacionEnabled() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('correo, nombre, apellidos')
      .eq('rol_usuario', 'admin')
      .eq('permitir_notificaciones_email', true);
    if (error) {
      console.log("Error al obtener administradores con notificación de email habilitada:", error);
      throw new Error(error.message);
    }
    return data;
  }

  async modifyEmailNotificationPreference(userId: number, enableNotifications: boolean) {
    console.log(`Modificando preferencia de notificación por email para el usuario con ID ${userId} a ${enableNotifications}`);
    const { data, error } = await supabase
      .from('usuarios')
      .update({ permitir_notificaciones_email: enableNotifications })
      .eq('id', userId)
      .select('permitir_notificaciones_email')
      .maybeSingle();
    if (error) {
      console.log("Error al modificar la preferencia de notificación por email:", error);
      throw new Error(error.message);
    }
    return data;
  }
}

export default UserModel;