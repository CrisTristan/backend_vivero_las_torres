import OrderProductsModel from '../models/orderProducts.model.js';

export default class OrderProductsController {
    constructor(orden_id, product_id, cantidad) {
        this.orden_id = orden_id;
        this.product_id = product_id;
        this.cantidad = cantidad;
    }

    async createOrderProducts() {
        try {
            const orderProducts = new OrderProductsModel(this.orden_id, this.product_id, this.cantidad);
            const newOrderProducts = await orderProducts.createOrderProducts();
            return newOrderProducts;
        } catch (error) {
            throw new Error(`Error al crear el producto de la orden: ${error.message}`);
        }
    }

    async getOrdersProductsByUserId() {
        try {
            const orderProducts = new OrderProductsModel(this.orden_id);
            const ordersProductsList = await orderProducts.getOrdersProductsByUserId(this.orden_id);
            return ordersProductsList;
        } catch (error) {
            throw new Error(`Error al obtener los productos de la orden: ${error.message}`);
        }
    }
}