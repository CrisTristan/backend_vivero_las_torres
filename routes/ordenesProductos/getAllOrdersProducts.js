import { Router } from "express";
import OrderProductsController from "../../controllers/orderProducts.controller.js";

const router = Router();
router.get("/ordenesProductos/getAllOrdersProducts", async (req, res) => {
    try {
        const orderProductsController = new OrderProductsController();
        const ordersProducts = await orderProductsController.getAllOrdersProducts();
        return res.send({ ordersProducts });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

export default router;