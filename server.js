import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import UserController from './controllers/user.controller.js';
import OrderController from './controllers/order.controller.js';
import OrderProductsController from './controllers/orderProducts.controller.js';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Falta la variable de entorno STRIPE_SECRET_KEY');
}

const stripe = new Stripe(stripeSecretKey);

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount} = req.body;

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

    res.status(201).send({
      message: 'Usuario registrado exitosamente',
      user: data
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
    res.send({
      message: 'Inicio de sesión exitoso',
      user: data
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).send({ error: error.message });
  }
});

app.post('/createOrder', async (req, res) => {
  try {
    const { usuario_id, total, estado, productos } = req.body;
    console.log("Datos recibidos para crear orden:", { usuario_id, total, estado, productos });
    if (!usuario_id || !total || !estado) {
      return res.status(400).send({ error: 'Todos los campos son obligatorios' });
    }
    if(estado !== 'no entregado' && estado !== 'entregado') {
      return res.status(400).send({ error: 'El estado debe ser "no entregado" o "entregado"' });
    }
    const order = new OrderController(usuario_id, total, null, estado);
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

app.listen(3000, () => console.log('Servidor en puerto 3000'));