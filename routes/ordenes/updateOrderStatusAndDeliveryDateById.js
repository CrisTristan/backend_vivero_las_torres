import { Router } from "express";
import OrderController from "../../controllers/order/order.controller.js";

const router = Router();
router.put("/ordenes/updateOrderStatusAndDeliveryDateById/:id", async (req, res) => {
    console.log("Received request to update order with id:", req.params.id);
    console.log("Request body:", req.body);
    try {
        const orderId = Number.parseInt(req.params.id, 10);
        const payload = req.body;
        const orderController = new OrderController();
        const updatedOrder = await orderController.updateOrderStatusAndDeliverDateById(orderId, payload);
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;