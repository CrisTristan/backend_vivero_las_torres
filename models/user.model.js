import {supabase} from '../database/supaBaseConnection.js';

class UserModel {
  constructor(nombre, apellidos, correo, password, rol_usuario = 'cliente') {
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.correo = correo;
    this.password = password;
    this.rol_usuario = rol_usuario;
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
      throw new Error(error.message);
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

}

export default UserModel;