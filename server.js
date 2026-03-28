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
import createNewPotRouter from './routes/macetas/createNewPot.js';
import updateMacetaByIdRouter from './routes/macetas/updateMacetaById.js';
import createNewStoneRouter from './routes/piedras/createNewStone.js';
import updatePiedraByIdRouter from './routes/piedras/updatePiedraById.js';
import createNewGrassRouter from './routes/pasto/createNewGrass.js';
import updatePastoByIdRouter from './routes/pasto/updatePastoById.js';
import createNewHerbicideRouter from './routes/herbicidas/createNewHerbicide.js';
import updateHerbicidaByIdRouter from './routes/herbicidas/updateHerbicidaById.js';
import createNewPesticideRouter from './routes/plaguicidas/createNewPesticide.js';
import updatePlaguicidaByIdRouter from './routes/plaguicidas/updatePlaguicidaById.js';
import createNewFertilizerRouter from './routes/fertilizantes/createNewFertilizer.js';
import updateFertilizanteByIdRouter from './routes/fertilizantes/updateFertilizanteById.js';
import createNewSoilRouter from './routes/tierra/createNewSoil.js';
import updateTierraByIdRouter from './routes/tierra/updateTierraById.js';
import uploadImageCloudRouter from './routes/images/uploadImageCloud.js';
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
app.use(createNewPotRouter);
app.use(updateMacetaByIdRouter);
app.use(createNewStoneRouter);
app.use(updatePiedraByIdRouter);
app.use(createNewGrassRouter);
app.use(updatePastoByIdRouter);
app.use(createNewHerbicideRouter);
app.use(updateHerbicidaByIdRouter);
app.use(createNewPesticideRouter);
app.use(updatePlaguicidaByIdRouter);
app.use(createNewFertilizerRouter);
app.use(updateFertilizanteByIdRouter);
app.use(createNewSoilRouter);
app.use(updateTierraByIdRouter);
app.use(uploadImageCloudRouter);

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

app.post('/registerUser', async (req, res) => {
  try {
    const { nombre, apellidos, telefono, correo, password } = req.body;

    if (!nombre || !apellidos || !telefono || !correo || !password) {
      return res.status(400).send({ error: 'Todos los campos son obligatorios' });
    }

    const user = new UserController(nombre, apellidos, correo, password);
    const data = await user.createUser();
    const createdUser = Array.isArray(data) ? data[0] : data;
    console.log("Usuario creado:", createdUser);
    if (!createdUser) {
      return res.status(500).json({ error: 'No se pudo crear el usuario' });
    }

    const accessToken = signAccessToken(createdUser);
    const refreshToken = signRefreshToken(createdUser);

    return res.status(201).json({
      user: sanitizeUser(createdUser),
      accessToken,
      refreshToken,
    });

  } catch (error) {
    res.status(500).send({ error: error.message });
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

app.post('/loginUser', async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) {
      return res.status(400).send({ error: 'Correo y contraseña son obligatorios' });
    }
    const user = new UserController(null, null, correo, password);
    const data = await user.login();
    
    const accessToken = signAccessToken(data);
    const refreshToken = signRefreshToken(data);

    return res.json({
      user: sanitizeUser(data),
      accessToken,
      refreshToken,
    });

  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).send({ error: error.message });
  }
});

app.post('/createOrder', async (req, res) => {
  try {
    const { usuario_id, total, estado, es_arreglo_personalizado,productos } = req.body;
    console.log("Datos recibidos para crear orden:", { usuario_id, total, estado, es_arreglo_personalizado, productos });
    if (!usuario_id || !total || !estado) {
      return res.status(400).send({ error: 'Todos los campos son obligatorios' });
    }
    if(estado !== 'no entregado' && estado !== 'entregado') {
      return res.status(400).send({ error: 'El estado debe ser "no entregado" o "entregado"' });
    }
    const order = new OrderController(usuario_id, total, null, estado, es_arreglo_personalizado);
    const newOrder = await order.createOrder();

    // Guardar los productos de la orden
    const savedProducts = [];
    for (const producto of productos) {
      const orderProduct = new OrderProductsController(newOrder.id, producto.producto_id, producto.cantidad);
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

app.get('/getOrdersProductsByUserId',async (req, res) => {
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

app.post('/refreshToken', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    console.warn('[AUTH][REFRESH] Solicitud sin refresh token');
    return res.status(401).json({ message: 'Refresh token requerido' });
  }

  try {
    console.log('[AUTH][REFRESH] Intento de refresh recibido desde el frontend');
    //verificar el refresh token y obtener el correo del usuario
    const payload = verifyRefreshToken(refreshToken);
    console.log(`[AUTH][REFRESH] Token válido para usuario: ${payload.correo}`);

    const userController = new UserController(null, null, payload.correo, null);
    const user = await userController.getUserByEmail();

    if (!user) {
      console.warn(`[AUTH][REFRESH] Usuario no encontrado para correo: ${payload.correo}`);
      return res.status(401).json({ message: 'Usuario inválido' });
    }

    const newAccessToken = signAccessToken(user);
    console.log(`[AUTH][REFRESH] Nuevo access token generado para usuario: ${user.correo} de tipo refresh` );
    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('[AUTH][REFRESH] Error al refrescar token:', error.message);
    return res.status(401).json({ message: 'Refresh token inválido o expirado' });
  }
});

// GET /me - Ruta protegida para obtener información del usuario autenticado
app.get('/me', verifyAccessToken, async (req, res) => {
  try {
    const userController = new UserController(null, null, req.auth?.correo, null);
    const user = await userController.getUserByEmail();

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//verificar el rol del usuario para acceder a rutas administrativas
//hacer la verificación con el token y el correo guardado en el token para obtener el usuario y verificar su rol
app.get('/admin', verifyAccessToken, verificarUserRoleAdmin,async (req, res) => {
  try {
    const userController = new UserController(null, null, req.auth?.correo, null);
    const user = await userController.getUserByEmail();
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // El rol ya fue verificado por el middleware, no lo hagas de nuevo
    return res.json({ message: 'Bienvenido, admin!', user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


app.listen(3000, () => console.log('Servidor en puerto 3000'));