import { supabase } from "../database/supaBaseConnection.js";

export default class OrderProductsModel {
  constructor(orden_id, product_id, cantidad) {
    this.orden_id = orden_id;
    this.product_id = product_id;
    this.cantidad = cantidad;
  }

  async createOrderProducts() {
    const { data, error } = await supabase
      .from("ordenesProductos")
      .insert([
        {
          orden_id: this.orden_id,
          producto_id: this.product_id,
          cantidad: this.cantidad,
        },
      ])
      .select();
    if (error) {
      throw new Error(
        `Error al crear el producto de la orden: ${error.message}`,
      );
    }
    return data[0];
  }

  async getOrdersProductsByUserId(userId) {
    const { data: orders, error: ordersError } = await supabase
      .from("ordenes")
      .select("id")
      .eq("usuario_id", userId);

    if (ordersError) {
      throw new Error(
        `Error al obtener las ordenes del usuario: ${ordersError.message}`,
      );
    }

    const orderIds = (orders || []).map((order) => order.id);
    if (orderIds.length === 0) {
      return [];
    }

    const { data, error } = await supabase
      .from("ordenesProductos")
      .select(
        `*, producto:productos(imagen, nombre), orden:ordenes(fecha, estado, Entregado_El_Dia)`,
      )
      .in("orden_id", orderIds);

    if (error) {
      throw new Error(
        `Error al obtener los productos de la orden: ${error.message}`,
      );
    }
    return data;
  }
}
