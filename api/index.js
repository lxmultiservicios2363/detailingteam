// =============================================
// API SERVERLESS - DETAILING TEAM (VERCEL)
// =============================================
// Este archivo reemplaza a server.js para funcionar
// en el entorno serverless de Vercel.
// =============================================

const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

// Importar modelos
const Cliente = require('../backend/models/cliente');
const Reserva = require('../backend/models/reserva');

// Crear app Express
const app = express();

// Configurar CORS para producción
app.use(cors({
    origin: ['https://detailingteam.vercel.app', 'http://localhost:3000', 'http://localhost:5500'],
    credentials: true
}));

app.use(express.json());

// =============================================
// CONEXIÓN A MONGODB (SINGLETON PARA SERVERLESS)
// =============================================
// En serverless, la conexión se reutiliza entre funciones
// para no sobrecargar MongoDB Atlas.
// =============================================
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverApi: { version: '1', strict: true, deprecationErrors: true }
        };
        cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

// =============================================
// CONFIGURACIÓN DE EMAIL
// =============================================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// =============================================
// RUTAS DE LA API
// =============================================

// Ruta raíz
app.get('/', (req, res) => {
    res.json({ message: '✅ API de Detailing Team funcionando en Vercel' });
});

// GET /api/clientes
app.get('/api/clientes', async (req, res) => {
    try {
        await connectToDatabase();
        const clientes = await Cliente.find().sort({ fecha: -1 });
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/clientes
app.post('/api/clientes', async (req, res) => {
    try {
        await connectToDatabase();
        const { nombre, email, telefono, direccion, modelo, anio, placa } = req.body;
        
        if (!nombre || !email || !telefono || !direccion || !modelo) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }
        
        const cliente = new Cliente(req.body);
        await cliente.save();
        res.status(201).json(cliente);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET /api/reservas
app.get('/api/reservas', async (req, res) => {
    try {
        await connectToDatabase();
        const reservas = await Reserva.find().sort({ fechaSolicitud: -1 });
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/reservas
app.post('/api/reservas', async (req, res) => {
    try {
        await connectToDatabase();
        const { servicio, tipoVehiculo, fecha, hora, precio, clienteEmail } = req.body;
        
        if (!servicio || !tipoVehiculo || !fecha || !hora || !precio || !clienteEmail) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }
        
        const reserva = new Reserva(req.body);
        await reserva.save();
        res.status(201).json(reserva);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST /api/enviar-bienvenida
app.post('/api/enviar-bienvenida', async (req, res) => {
    const { nombre, email, idioma } = req.body;
    
    if (!nombre || !email) {
        return res.status(400).json({ error: 'Faltan nombre o email' });
    }
    
    const asunto = idioma === 'es' ? '¡Bienvenido a Detailing Team!' : 'Welcome to Detailing Team!';
    const contenido = idioma === 'es'
        ? `<h1>¡Hola ${nombre}!</h1><p>Gracias por registrarte en Detailing Team.</p><p>¡Te esperamos!</p>`
        : `<h1>Hello ${nombre}!</h1><p>Thank you for registering with Detailing Team.</p><p>We look forward to seeing you!</p>`;
    
    try {
        await transporter.sendMail({
            from: `"Detailing Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: asunto,
            html: contenido
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/enviar-reserva
app.post('/api/enviar-reserva', async (req, res) => {
    const { cliente, reserva, tipo, idioma } = req.body;
    
    if (!cliente || !reserva || !tipo) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
    
    let asunto, contenido, destinatario;
    
    if (tipo === 'cliente') {
        destinatario = cliente.email;
        asunto = idioma === 'es' ? '✅ Confirmación de tu reserva' : '✅ Booking Confirmation';
        contenido = `<h1>¡Hola ${cliente.nombre}!</h1><h2>Tu reserva ha sido confirmada</h2>
                     <p><strong>📋 Servicio:</strong> ${reserva.servicio}</p>
                     <p><strong>📅 Fecha:</strong> ${reserva.fecha}</p>
                     <p><strong>⏰ Hora:</strong> ${reserva.hora}</p>
                     <p><strong>💰 Total:</strong> $${reserva.precio}</p>
                     <p>📍 13330 West Road, Houston, TX 77041</p>`;
    } else {
        destinatario = process.env.EMAIL_USER;
        asunto = '🔔 NUEVA RESERVA RECIBIDA';
        contenido = `<h1>🔔 NUEVA RESERVA RECIBIDA</h1>
                     <h2>Datos del Cliente:</h2>
                     <p><strong>👤 Nombre:</strong> ${cliente.nombre}</p>
                     <p><strong>📧 Email:</strong> ${cliente.email}</p>
                     <p><strong>📞 Teléfono:</strong> ${cliente.telefono}</p>
                     <h2>Detalle de la Reserva:</h2>
                     <p><strong>📋 Servicio:</strong> ${reserva.servicio}</p>
                     <p><strong>📅 Fecha:</strong> ${reserva.fecha}</p>
                     <p><strong>⏰ Hora:</strong> ${reserva.hora}</p>
                     <p><strong>💰 Total:</strong> $${reserva.precio}</p>`;
    }
    
    try {
        await transporter.sendMail({
            from: `"Detailing Team" <${process.env.EMAIL_USER}>`,
            to: destinatario,
            subject: asunto,
            html: contenido
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Exportar para Vercel
module.exports = app;