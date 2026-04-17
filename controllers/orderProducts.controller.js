import OrderProductsModel from "../models/orderProducts.model.js";

export default class OrderProductsController {
  constructor(orden_id, product_id, cantidad, precio_unitario, nombre_producto, imagen_producto) {
    this.orden_id = orden_id;
    this.product_id = product_id;
    this.cantidad = cantidad;
    this.precio_unitario = precio_unitario;
    this.nombre_producto = nombre_producto;
    this.imagen_producto = imagen_producto;
  }

  normalizeShippingAddress(direccionEnvio) {
    if (!direccionEnvio) {
      return null;
    }
    return {
      id: direccionEnvio.id,
      order_id: direccionEnvio.orden_id,
      region: direccionEnvio["region/supermanzana"],
      manzana: direccionEnvio.manzana,
      lote: direccionEnvio.lote,
      colonia: direccionEnvio["colonia/fraccionamiento"],
      calle: direccionEnvio.calle,
      numero_interior: direccionEnvio.numero_interior,
      numero_exterior: direccionEnvio.numero_exterior,
      codigo_postal: direccionEnvio.codigo_postal,
      referencia: direccionEnvio.referencia,
    };
  }

  normalizeShippingAddresses(direccionesEnvio) {
    if (!direccionesEnvio || direccionesEnvio.length === 0) {
      return [];
    }
    return direccionesEnvio.map(dir => this.normalizeShippingAddress(dir));
  }

  async createOrderProducts() {
    try {
      const orderProducts = new OrderProductsModel(
        this.orden_id,
        this.product_id,
        this.cantidad,
        this.precio_unitario,
        this.nombre_producto,
        this.imagen_producto
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
      const allOrdersProducts = await orderProducts.getAllOrdersUserProducts();
      // return allOrdersProducts;
      const agrupadas = allOrdersProducts.reduce((acc, item) => {
        const { orden_id } = item;

        // Si no existe la orden, la creamos
        if (!acc[orden_id]) {
          acc[orden_id] = {
            orden_id,
            orden: {
              ...item.orden,
              direccion_envio: this.normalizeShippingAddresses(item.orden.direccion_envio)
            },
            productos: [],
          };
        }

        // Agregamos el producto a esa orden
        acc[orden_id].productos.push({
          id: item.id,
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          producto: { nombre: item.nombre_producto, imagen: item.imagen_producto, precio_unitario: item.precio_unitario },
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

  async getTopSellingProducts(limit = 5) {
    try {
      const orderProducts = new OrderProductsModel();
      const topSellingProducts = await orderProducts.getTopSellingProducts(limit);
      return topSellingProducts;
    } catch (error) {
      throw new Error(
        `Error al obtener los productos más vendidos: ${error.message}`,
      );
    }
  }

  //Regresa un InnerJoin entre ordenesProductos y ordenes.
  async getAllOrdersProducts(){
    try {
      const orderProducts = new OrderProductsModel();
      const allOrdersProducts = await orderProducts.getAllOrdersProducts();
      return allOrdersProducts;
    } catch (error) {
      throw new Error(
        `Error al obtener todos los productos de las órdenes: ${error.message}`,
      );
    }
    return allOrdersProducts;
  }

}
