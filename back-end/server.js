require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const servicesRoutes = require('./routes/services');
const buildsRoutes = require('./routes/builds');

connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/services', servicesRoutes);
app.use('/builds', buildsRoutes);

app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'Apex Auto Mods API' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
