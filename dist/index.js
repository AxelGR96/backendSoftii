"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
//import mongoose from 'mongoose';
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Configuración más detallada de CORS
app.use((0, cors_1.default)({
    origin: '*', // Ajusta según tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
}));
app.use(body_parser_1.default.json()); // Middleware para analizar JSON en las solicitudes
// Conexión a la base de datos MongoDB
/*mongoose.connect('mongodb://localhost:27017/restaurant',{
  socketTimeoutMS: 3000
});

const db = mongoose.connection;

// Manejar eventos relacionados con la conexión a la base de datos
db.on('error', (err) => {
  console.error('Error de conexión a la base de datos:', err);
});

db.once('connected', () => {
  console.log('Conexión a la base de datos establecida con éxito');
});*/
const mongoose = require('mongoose');
// URL de conexión a MongoDB
const mongoURI = 'mongodb://127.0.0.1:27017/restaurant'; // Reemplaza 'nombre_basedatos' por el nombre de tu base de datos
// Configuración de conexión a MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
// Manejadores de eventos para la conexión a MongoDB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
    console.log('Conexión a MongoDB establecida con éxito');
});
// Definir un modelo para los datos de pago
const PagoSchema = new mongoose.Schema({
    fecha: { type: Date, default: Date.now },
    amount: Number,
    card: String
});
const Pago = mongoose.model('Pago', PagoSchema);
// Ruta para recibir los datos desde el frontend
app.post('/pago', async (req, res) => {
    const { amountToPay, card } = req.body;
    try {
        // Crear una instancia del modelo Pago con los datos recibidos
        const nuevoPago = new Pago({
            amount: amountToPay,
            card: card
        });
        await nuevoPago.save();
        console.log('Datos de pago guardados en la base de datos:', nuevoPago);
        res.status(200).send('Datos de pago guardados correctamente');
    }
    catch (error) {
        console.error('Error al guardar datos de pago:', error);
        res.status(500).send('Error al guardar datos de pago');
    }
});
app.get('/pagosHechos', async (req, res) => {
    try {
        // Consultar la base de datos para obtener los datos de pago
        const pagos = await Pago.find();
        // Enviar los datos al frontend como respuesta
        res.status(200).json(pagos);
    }
    catch (error) {
        console.error('Error al obtener datos de pago:', error);
        res.status(500).send('Error al obtener datos de pago');
    }
});
app.get('/', (req, res) => {
    res.send('Hola desde Express.js');
});
app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
