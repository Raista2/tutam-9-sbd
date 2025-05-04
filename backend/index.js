const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const gachaController = require('./controllers/GachaController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'https://tutam-9-sbd.vercel.app' || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
    console.log('Connected to MongoDB Gacha');
});

app.get('/api/pools', gachaController.getAllPools);
app.get('/api/pools/:poolId', gachaController.getPoolDetails);
app.post('/api/gacha/pull', gachaController.pullGacha);
app.get('/api/users/:userId/servants', gachaController.getUserServants);
app.post('/api/auth/login', gachaController.loginUser);
app.post('/api/auth/register', gachaController.registerUser);
app.delete('/api/users/:userId', gachaController.deleteUser);

app.get('/', (req, res) => {
    res.send('Welcome to the Gacha API!');
});

app.listen(PORT, () => console.log(`🚀 Server started at port:${PORT}`));