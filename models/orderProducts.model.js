import { supabase } from "../database/supaBaseConnection.js";

export default class OrderProductsModel {
  constructor(orden_id, product_id, cantidad, precio_unitario, nombre_producto, imagen_producto) {
    this.orden_id = orden_id;
    this.product_id = product_id;
    this.cantidad = cantidad;
    this.precio_unitario = precio_unitario;
    this.nombre_producto = nombre_producto;
    this.imagen_producto = imagen_producto;
  }

  async createOrderProducts() {
    const { data, error } = await supabase
      .from("ordenesProductos")
      .insert([
        {
          orden_id: this.orden_id,
          producto_id: this.product_id,
          cantidad: this.cantidad,
          precio_unitario: this.precio_unitario,
          nombre_producto: this.nombre_producto,
          imagen_producto: this.imagen_producto,
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
        `*, orden:ordenes(fecha, estado, Entregado_El_Dia, es_arreglo_personalizado)`,
      )
      .in("orden_id", orderIds);

    if (error) {
      throw new Error(
        `Error al obtener los productos de la orden: ${error.message}`,
      );
    }
    return data;
  }

  // Método para obtener todos los productos de las órdenes, incluyendo la información de 
  // la orden y del usuario, con las direcciones de envío normalizadas
  async getAllOrdersUserProducts() {
    //Si las ordenes son demaciadas, se puede agregar paginación o filtros para limitar la cantidad de datos retornados
    const { data, error } = await supabase
      .from("ordenesProductos")
      .select(
        `*, orden:ordenes(total, fecha, estado, Entregado_El_Dia, es_arreglo_personalizado, usuario:usuarios(nombre, apellidos, telefono), direccion_envio:direcciones_envio(*) ) )`,
      );
    if (error) {
      throw new Error(
        `Error al obtener los productos de la orden: ${error.message}`,
      );
    }
    return data;
  }

  async getTopSellingProducts(limit = 5) {
    const { data, error } = await supabase.rpc('get_top_selling_products', {
      p_limit: limit,
    });

    if (error) {
      console.error("Error al ejecutar la función RPC get_top_selling_products:", error);
      throw new Error(
        `Error al obtener los productos más vendidos: ${error.message}`,
      );
    }
    return data;
  }

  //metodo que solo devuelve innerJoin entre ordenesProductos y ordenes, 
  // sin la información del usuario ni de la dirección de envío.
  async getAllOrdersProducts() {
    const { data, error } = await supabase
      .from("ordenesProductos")
      .select(
        `*, orden:ordenes(total, fecha, estado, Entregado_El_Dia, es_arreglo_personalizado)`,
      );
    if (error) {
      throw new Error(
        `Error al obtener los productos de la orden: ${error.message}`,
      );
    }
    return data;   
  }
  
}
