import { supabase } from "../database/supaBaseConnection.js";

export default class OrderModel {

  constructor(user_id, total, fecha, estado, es_arreglo_personalizado) {
    this.user_id = user_id;
    this.total = total;
    this.fecha = fecha;
    this.estado = estado;
    this.es_arreglo_personalizado = es_arreglo_personalizado;
  }

  async createOrder() {
    const { data, error } = await supabase
      .from('ordenes')
      .insert([
        { 
            usuario_id: this.user_id,
            total: this.total,
            estado: this.estado,
            es_arreglo_personalizado: this.es_arreglo_personalizado,
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

    //Se actualiza el estado, y Entregado_El_Dia, para saber cuando se entrego la orden, y asi poder eliminar el arreglo personalizado del usuario.
    async updateStatusAndDeliverDateInOrderById(orderId, payload) {
        const { data: existingOrder, error: fetchError } = await supabase
            .from("ordenes")
            .select("*")
            .eq("id", orderId)
            .maybeSingle();
        if (fetchError) {
            throw new Error(`Error al obtener la orden: ${fetchError.message}`);
        }
        if (!existingOrder) {
            return null;
        }
        const allowedFields = ["estado", "Entregado_El_Dia"];
        const orderUpdates = {};
        for (const field of allowedFields) {
            if (payload[field] !== undefined) {
                orderUpdates[field] = payload[field];
            }
        }
        const { data: updatedOrder, error: updateError } = await supabase
            .from("ordenes")
            .update(orderUpdates)
            .eq("id", orderId)
            .select()
            .maybeSingle();
        if (updateError) {
            throw new Error(`Error al actualizar la orden: ${updateError.message}`);
        }
        return updatedOrder;
    }
}