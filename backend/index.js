const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const gachaController = require('./controllers/GachaController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
    console.log('Connected to MongoDB Gacha');
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://tutam-9-sbd.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        return res.status(204).send();
    }
    
    next();
});

app.get('/api/pools', gachaController.getAllPools);
app.get('/api/pools/:poolId', gachaController.getPoolDetails);
app.post('/api/gacha/pull', gachaController.pullGacha);
app.get('/api/users/:userId/servants', gachaController.getUserServants);
app.post('/api/auth/login', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://tutam-9-sbd.vercel.app');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
}, gachaController.loginUser); app.post('/api/auth/register', gachaController.registerUser);
app.delete('/api/users/:userId', gachaController.deleteUser);

if (require.main === module) {
    app.listen(PORT, () => console.log(`🚀 Server started at port:${PORT}`));
}

module.exports = app;