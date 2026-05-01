import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import UserController from './controllers/user.controller.js';
import OrderController from './controllers/order/order.controller.js';
import OrderProductsController from './controllers/orderProducts.controller.js';
import getAllPlantsRouter from './routes/Plants/getAllPlants.js';
import createNewPlantRouter from './routes/Plants/createNewPlant.js';
import updatePlantByIdRouter from './routes/Plants/updatePlantById.js';
import deletePlantByIdRouter from './routes/Plants/deletePlantById.js';
import createNewPotRouter from './routes/macetas/createNewPot.js';
import updateMacetaByIdRouter from './routes/macetas/updateMacetaById.js';
import deleteMacetaByIdRouter from './routes/macetas/deleteMacetaById.js';
import createNewStoneRouter from './routes/piedras/createNewStone.js';
import updatePiedraByIdRouter from './routes/piedras/updatePiedraById.js';
import deletePiedraByIdRouter from './routes/piedras/deletePiedraById.js';
import createNewGrassRouter from './routes/pasto/createNewGrass.js';
import updatePastoByIdRouter from './routes/pasto/updatePastoById.js';
import deletePastoByIdRouter from './routes/pasto/deletePastoById.js';
import createNewHerbicideRouter from './routes/herbicidas/createNewHerbicide.js';
import updateHerbicidaByIdRouter from './routes/herbicidas/updateHerbicidaById.js';
import deleteHerbicidaByIdRouter from './routes/herbicidas/deleteHerbicidaById.js';
import createNewPesticideRouter from './routes/plaguicidas/createNewPesticide.js';
import updatePlaguicidaByIdRouter from './routes/plaguicidas/updatePlaguicidaById.js';
import deletePlaguicidaByIdRouter from './routes/plaguicidas/deletePlaguicidaById.js';
import createNewFertilizerRouter from './routes/fertilizantes/createNewFertilizer.js';
import updateFertilizanteByIdRouter from './routes/fertilizantes/updateFertilizanteById.js';
import deleteFertilizanteByIdRouter from './routes/fertilizantes/deleteFertilizanteById.js';
import createNewSoilRouter from './routes/tierra/createNewSoil.js';
import updateTierraByIdRouter from './routes/tierra/updateTierraById.js';
import deleteTierraByIdRouter from './routes/tierra/deleteTierraById.js';
import uploadImageCloudRouter from './routes/images/uploadImageCloud.js';
import getAllOrdersUserProductsRouter from './routes/OrdenesUsuarioProductos/getAllOrdersUserProducts.js';
import updateOrderStatusAndDeliveryDateByIdRouter from './routes/ordenes/updateOrderStatusAndDeliveryDateById.js';
import createUserShippingDataByIdRouter from './routes/direcciones_usuario/createUserShippingDataByUserId.js';
import getUserShippingDataByUserIdRouter from './routes/direcciones_usuario/getUserShippingDataByUserId.js';
import updateUserShippingDataByIdRouter from './routes/direcciones_usuario/updateUserShippingDataById.js';
import deleteUserShippingDataByIdRouter from './routes/direcciones_usuario/deleteUserShippingDataById.js';
import createDireccionEnvioByOrderIdRouter from './routes/direcciones_envio/createDireccionEnvioByOrderId.js';
import getLast10OrdersRouter from './routes/ordenes/getAllOrders.js';
import password_recoveryRouter from './routes/password_recovery/password_recovery.js';
import getTopSellingProductsRouter from './routes/ordenesProductos/getTopSellingProducts.js';
import getAllOrdersProductsRouter from './routes/ordenesProductos/getAllOrdersProducts.js';
import reportesPanelAdminRouter from './routes/reportes/reportesPanelAdmin.js';
import configPanelAdminRouter from './routes/configuracion/configPanelAdmin.js';
import verifyEmailRouter from './routes/verifyEmail/verifyEmail.js';
import authRouter from './routes/auth/auth.route.js';
import {
  signAccessToken,
  signRefreshToken,
  sanitizeUser,
  verifyAccessToken,
  verifyRefreshToken,
  verificarUserRoleAdmin
} from './Tokens/JsonWebTokens.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(getAllPlantsRouter);
app.use(createNewPlantRouter);
app.use(updatePlantByIdRouter);
app.use(deletePlantByIdRouter);
app.use(createNewPotRouter);
app.use(updateMacetaByIdRouter);
app.use(deleteMacetaByIdRouter);
app.use(createNewStoneRouter);
app.use(updatePiedraByIdRouter);
app.use(deletePiedraByIdRouter);
app.use(createNewGrassRouter);
app.use(updatePastoByIdRouter);
app.use(deletePastoByIdRouter);
app.use(createNewHerbicideRouter);
app.use(updateHerbicidaByIdRouter);
app.use(deleteHerbicidaByIdRouter);
app.use(createNewPesticideRouter);
app.use(updatePlaguicidaByIdRouter);
app.use(deletePlaguicidaByIdRouter);
app.use(createNewFertilizerRouter);
app.use(updateFertilizanteByIdRouter);
app.use(deleteFertilizanteByIdRouter);
app.use(createNewSoilRouter);
app.use(updateTierraByIdRouter);
app.use(deleteTierraByIdRouter);
app.use(uploadImageCloudRouter);
app.use(getAllOrdersUserProductsRouter);
app.use(updateOrderStatusAndDeliveryDateByIdRouter);
app.use(createUserShippingDataByIdRouter);
app.use(getUserShippingDataByUserIdRouter);
app.use(updateUserShippingDataByIdRouter);
app.use(deleteUserShippingDataByIdRouter);
app.use(createDireccionEnvioByOrderIdRouter);
app.use(getLast10OrdersRouter);
app.use(password_recoveryRouter);
app.use(getTopSellingProductsRouter);
app.use(getAllOrdersProductsRouter);
app.use(reportesPanelAdminRouter);
app.use(configPanelAdminRouter);
app.use(verifyEmailRouter);
//// Rutas de autenticación (registro, login, refresh token, etc.) /////
app.use(authRouter);
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Falta la variable de entorno STRIPE_SECRET_KEY');
}

const stripe = new Stripe(stripeSecretKey);

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount} = req.body;
    console.log("Monto recibido para crear PaymentIntent:", amount);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // en centavos (ej: 1000 = $10.00)
      currency: 'mxn',
      payment_method_types: ['card']
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.log('Error al crear PaymentIntent:', error);
    res.status(400).send({ error: error.message });
  }
});

app.get('/getUserByEmail', async (req, res) => {
  try {
    const { correo } = req.query;
    if (!correo) {
      return res.status(400).send({ error: 'El correo es obligatorio' });
    }
    const user = new UserController(null, null, correo, null);
    const data = await user.getUserByEmail();
    if (!data) {
      return res.status(404).send({ error: 'Usuario no encontrado' });
    }
    res.send({ user: data });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post('/createOrder', async (req, res) => {
  try {
    const { usuario_id, total, estado, es_arreglo_personalizado,productos, metodo_entrega } = req.body;
    console.log("Datos recibidos para crear orden:", { usuario_id, total, estado, es_arreglo_personalizado, productos, metodo_entrega });
    if (!usuario_id || !total || !estado || !metodo_entrega) {
      return res.status(400).send({ error: 'Todos los campos son obligatorios (metodo_entrega es requerido)' });
    }
    if(estado !== 'no entregado' && estado !== 'entregado') {
      return res.status(400).send({ error: 'El estado debe ser "no entregado" o "entregado"' });
    }
    if(metodo_entrega !== 'recoger' && metodo_entrega !== 'envío') {
      return res.status(400).send({ error: 'El método de entrega debe ser "recoger" o "envío"' });
    }
    const order = new OrderController(usuario_id, total, null, estado, es_arreglo_personalizado, metodo_entrega);
    const newOrder = await order.createOrder();

    // Guardar los productos de la orden
    const savedProducts = [];
    for (const producto of productos) {                 //Aqui iba el producto_id, pero como ya no se guarda el producto_id en ordenesProductos, se lo quité del constructor de OrderProductsController y de la creación del nuevo producto de la orden
      const orderProduct = new OrderProductsController(newOrder.id, producto.producto_id, producto.cantidad, producto.precio_unitario, producto.nombre_producto, producto.imagen_producto);
      const savedProduct = await orderProduct.createOrderProducts();
      savedProducts.push(savedProduct);
    }

    res.status(201).send({
      message: 'Orden creada exitosamente',
      order: newOrder,
      productos: savedProducts
    });
  } catch (error) {
    console.error('Error al crear la orden:', error);
    res.status(500).send({ error: error.message });
  }
});

app.get('/getOrdersByUserId', async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).send({ error: 'El user_id es obligatorio' });
    }
    const order = new OrderController(user_id);
    const ordersList = await order.getOrdersByUserId();
    res.send({ orders: ordersList });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get('/getOrdersProductsByUserId', verifyAccessToken ,async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).send({ error: 'El user_id es obligatorio' });
    }
    const order = new OrderProductsController(user_id);
    const ordersList = await order.getOrdersProductsByUserId();
    res.send({ ordersProducts: ordersList });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(3000, () => console.log('Servidor en puerto 3000'));