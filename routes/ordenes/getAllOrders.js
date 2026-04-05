import { Router } from "express";
import OrderController from "../../controllers/order/order.controller.js";

const router = Router();

router.get("/ordenes/getLast10Orders", async (req, res) => {
    try {
        const orderController = new OrderController();
        const last10Orders = await orderController.getLast10Orders();
        res.status(200).json(last10Orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;