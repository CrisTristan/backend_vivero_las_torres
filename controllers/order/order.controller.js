import OrderModel from '../../models/order.model.js';

export default class OrderController {

    constructor(user_id, total, fecha, estado, es_arreglo_personalizado, metodo_entrega) {
        this.user_id = user_id;
        this.total = total;
        this.fecha = fecha;
        this.estado = estado;
        this.es_arreglo_personalizado = es_arreglo_personalizado;
        this.metodo_entrega = metodo_entrega;
    }

    async createOrder() {
        try {
            const order = new OrderModel(this.user_id, this.total, this.fecha, this.estado, this.es_arreglo_personalizado, this.metodo_entrega);
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

    async updateOrderStatusAndDeliverDateById(orderId, payload) {
        try {
            const order = new OrderModel();
            const updatedOrder = await order.updateStatusAndDeliverDateInOrderById(orderId, payload);
            return updatedOrder;
        } catch (error) {
            throw new Error(`Error al actualizar el estado y fecha de entrega de la orden: ${error.message}`);
        }
    }

    async getLast10Orders() {
        try {
            const order = new OrderModel();
            const last10Orders = await order.getLast10Orders();
            return last10Orders;
        } catch (error) {
            throw new Error(`Error al obtener las últimas 10 órdenes: ${error.message}`);
        }
    }
}