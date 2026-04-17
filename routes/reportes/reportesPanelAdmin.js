import { Router } from "express";
import IngresosMensualesController from "../../controllers/reportes/ingresosMensuales.controller.js";
import PedidosMesActualController from "../../controllers/reportes/pedidosMesActual.controller.js";
import EstadoProductosController from "../../controllers/reportes/estadoProductos.controller.js";
import TotalClientesController from "../../controllers/reportes/totalClientes.controller.js";
import {
  verificarUserRoleAdmin
} from '../../Tokens/JsonWebTokens.js';

const router = Router();
router.get("/reportes/ingresos-mensuales", verificarUserRoleAdmin, async (req, res) => {
    try {
        const ingresosMensualesController = new IngresosMensualesController();
        const ingresosMensuales = await ingresosMensualesController.getIngresosMensuales();
        return res.send({ ingresosMensuales });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.get("/reportes/pedidos-mes-actual", verificarUserRoleAdmin, async (req, res) => {
    try {
        const pedidosMesActualController = new PedidosMesActualController();
        const pedidosMesActual = await pedidosMesActualController.getPedidosMesActual();
        return res.send(pedidosMesActual);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.get("/reportes/estado-productos", verificarUserRoleAdmin, async (req, res) => {
    try {
        const estadoProductosController = new EstadoProductosController();
        const estadoProductos = await estadoProductosController.getEstadoProductos();
        return res.send({ estadoProductos });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.get("/reportes/total-clientes", verificarUserRoleAdmin, async (req, res) => {
    try {
        const totalClientesController = new TotalClientesController();
        const totalClientes = await totalClientesController.getTotalClientes();
        return res.send(totalClientes);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

export default router;