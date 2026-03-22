import OrderModel from '../../models/order.model.js';

export default class OrderController {

    constructor(user_id, total, fecha, estado, es_arreglo_personalizado) {
        this.user_id = user_id;
        this.total = total;
        this.fecha = fecha;
        this.estado = estado;
        this.es_arreglo_personalizado = es_arreglo_personalizado;
    }

    async createOrder() {
        try {
            const order = new OrderModel(this.user_id, this.total, this.fecha, this.estado, this.es_arreglo_personalizado);
            const newOrder = await order.createOrder();
            return newOrder;
        } catch (error) {
            throw new Error(`Error al crear la orden: ${error.message}`);
        }
    }

    async getOrdersByUserId() {
        try {
            const orders = new OrderModel(this.user_id);
            const ordersList = await orders.getOrdersByUserId(this.user_id);
            return ordersList;
        } catch (error) {
            throw new Error(`Error al obtener las órdenes del usuario: ${error.message}`);
        }
    }
}