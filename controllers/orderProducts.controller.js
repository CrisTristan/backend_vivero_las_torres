import OrderProductsModel from "../models/orderProducts.model.js";

export default class OrderProductsController {
  constructor(orden_id, product_id, cantidad, precio_unitario) {
    this.orden_id = orden_id;
    this.product_id = product_id;
    this.cantidad = cantidad;
    this.precio_unitario = precio_unitario;
  }

  async createOrderProducts() {
    try {
      const orderProducts = new OrderProductsModel(
        this.orden_id,
        this.product_id,
        this.cantidad,
        this.precio_unitario,
      );
      const newOrderProducts = await orderProducts.createOrderProducts();
      return newOrderProducts;
    } catch (error) {
      throw new Error(
        `Error al crear el producto de la orden: ${error.message}`,
      );
    }
  }

  async getOrdersProductsByUserId() {
    try {
      const orderProducts = new OrderProductsModel(this.orden_id);
      const ordersProductsList = await orderProducts.getOrdersProductsByUserId(
        this.orden_id,
      );
      return ordersProductsList;
    } catch (error) {
      throw new Error(
        `Error al obtener los productos de la orden: ${error.message}`,
      );
    }
  }

  async getAllOrdersUserProducts() {
    try {
      const orderProducts = new OrderProductsModel();
      const allOrdersProducts = await orderProducts.getAllOrdersProducts();
      // return allOrdersProducts;
      const agrupadas = allOrdersProducts.reduce((acc, item) => {
        const { orden_id } = item;

        // Si no existe la orden, la creamos
        if (!acc[orden_id]) {
          acc[orden_id] = {
            orden_id,
            orden: item.orden,
            productos: [],
          };
        }

        // Agregamos el producto a esa orden
        acc[orden_id].productos.push({
          id: item.id,
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          producto: { ...item.producto, precio_unitario: item.precio_unitario,}
        });

        return acc;
      }, {});
      return Object.values(agrupadas);
    } catch (error) {
      throw new Error(
        `Error al obtener todos los productos de las órdenes: ${error.message}`,
      );
    }
  }
}
