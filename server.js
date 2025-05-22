const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Stripe = require('stripe');

dotenv.config();
const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Habilita CORS para localhost:5173 y producción
app.use(cors({
  origin: ['http://localhost:5173', 'https://cloudbay-marketplace.vercel.app'], // agrega aquí tu dominio en producción también
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());


app.post('/create-checkout-session', async (req, res) => {
  const { line_items } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: process.env.FRONTEND_URL + '/success',
      cancel_url: process.env.FRONTEND_URL + '/cancel',
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('CloudBay Stripe backend is working!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));