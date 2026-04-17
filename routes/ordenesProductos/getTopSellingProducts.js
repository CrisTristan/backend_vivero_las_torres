import { Router } from "express";
import OrderProductsController from "../../controllers/orderProducts.controller.js";

const router = Router();

router.get("/ordenesProductos/getTopSellingProducts/:limit", async (req, res) => {
    try {
        const { limit } = req.params;
        if(!limit || isNaN(limit) || limit <= 0) {
            return res.status(400).send({ error: "El parámetro 'limit' debe ser un número entero positivo." });
        }
        const orderProductsController = new OrderProductsController();
        const topSellingProducts = await orderProductsController.getTopSellingProducts(parseInt(limit));
        return res.send({ topSellingProducts });
    } catch (error) {        
        return res.status(500).send({ error: error.message });
    }
});

export default router;