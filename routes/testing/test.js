import { Router } from "express";
import OrderController from "../../controllers/order/order.controller.js";

const router = Router();

router.get("/test", async (req, res) => {
    try {
        
        //const orderController = new OrderController(null, null, null, null, null, null);
        //const newOrder = await orderController.NotifyAdminsOfNewOrder(123); // Aquí puedes pasar los detalles de la orden que quieras probar

        res.status(201).json({ message: "Esto es una prueba de la ruta /test" });
    } catch (error) {
        console.error("Error al crear la orden:", error);
        res.status(500).json({ error: "Error al crear la orden" });
    }
});

export default router;