import OrderModel from '../../models/order.model.js';
import UserController from '../user.controller.js';
import SendAdminNotificationOrderController from '../email/sendAdminNotificactionOrder.controller.js';

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

    // Este método se puede llamar después de crear una nueva orden para notificar a los administradores por correo electrónico.
    async NotifyAdminsOfNewOrder(orderId) {
        try {
            const userController = new UserController();
            const adminsToNotify = await userController.getAllAdminsWithEmailNotificacionEnabled();
            console.log("Administradores a notificar por nueva orden:", adminsToNotify);
            // Enviar correos electrónicos a los administradores
            for (const admin of adminsToNotify) {
                try {
                    const sendAdminNotificationController = new SendAdminNotificationOrderController();
                    await sendAdminNotificationController.sendAdminNotificationEmail(admin.correo, admin.nombre, admin.apellidos, orderId);
                    console.log(`Correo enviado a ${admin.correo}`);
                } catch (emailError) {
                    console.error(`Error al enviar correo a ${admin.correo}:`, emailError.message);
                    // Continuar con el siguiente admin sin detener el proceso
                }
            }
        } catch (error) {
            console.error(`Error al obtener los administradores para notificar: ${error.message}`);
            // No lanzar error para que no bloquee la creación de la orden
        }
    }
}