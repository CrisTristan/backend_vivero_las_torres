import { Router } from "express";
import OrderProductsController from "../../controllers/orderProducts.controller.js";

const router = Router();

router.get("/ordenesProductos/getAllOrdersUserProducts", async (req, res) => {
    try {
        const orderProductsController = new OrderProductsController();
        const allOrdersProducts = await orderProductsController.getAllOrdersUserProducts();
        return res.send({ ordenesUsuarioProductos: allOrdersProducts });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

export default router;