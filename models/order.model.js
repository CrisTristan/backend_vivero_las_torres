import { supabase } from "../database/supaBaseConnection.js";

export default class OrderModel {

  constructor(user_id, total, fecha, estado) {
    this.user_id = user_id;
    this.total = total;
    this.fecha = fecha;
    this.estado = estado;
  }

  async createOrder() {
    const { data, error } = await supabase
      .from('ordenes')
      .insert([
        { 
            usuario_id: this.user_id,
            total: this.total,
            estado: this.estado
        }
      ])
      .select();
    if (error) {
      throw new Error(`Error al crear la orden: ${error.message}`);
    }
    return data[0];
  }

    async getOrdersByUserId(userId) {
      const { data, error } = await supabase
        .from('ordenes')
        .select('*')
        .eq('usuario_id', userId);
      if (error) {
        throw new Error(`Error al obtener las órdenes del usuario: ${error.message}`);
      }
      return data;
    }
}