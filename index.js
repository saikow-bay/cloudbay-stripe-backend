require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4321;

// ✅ CORS bien configurado
app.use(cors({
  origin: ['http://localhost:5173', 'https://cloudbay.vercel.app'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Backend de CloudBay funcionando ✅');
});

// Checkout session
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { line_items } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: process.env.FRONTEND_URL + '/success',
      cancel_url: process.env.FRONTEND_URL + '/cancel',
    });
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
