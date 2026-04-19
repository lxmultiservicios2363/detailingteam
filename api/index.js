// =============================================
// API SERVERLESS - DETAILING TEAM (VERCEL)
// =============================================

const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');

// =============================================
// IMPORTAR MODELOS
// =============================================
const Cliente = require('../backend/models/cliente');
const Reserva = require('../backend/models/reserva');

// =============================================
// CREAR APP EXPRESS
// =============================================
const app = express();

// =============================================
// CORS
// =============================================
app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());

// =============================================
// CONEXIÓN A MONGODB (SINGLETON)
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
        cached.promise = mongoose.connect(process.env.MONGO_URI, {
            bufferCommands: false,
            serverApi: { version: '1', strict: true, deprecationErrors: true }
        }).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

// =============================================
// EMAIL
// =============================================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// =============================================
// RUTAS
// =============================================

app.get('/', (req, res) => {
    res.json({ message: '✅ API de Detailing Team funcionando' });
});

app.get('/api/clientes', async (req, res) => {
    try {
        await connectToDatabase();
        const clientes = await Cliente.find().sort({ fecha: -1 });
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/clientes', async (req, res) => {
    try {
        await connectToDatabase();
        const cliente = new Cliente(req.body);
        await cliente.save();
        res.status(201).json(cliente);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/reservas', async (req, res) => {
    try {
        await connectToDatabase();
        const reservas = await Reserva.find().sort({ fechaSolicitud: -1 });
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/reservas', async (req, res) => {
    try {
        await connectToDatabase();
        const reserva = new Reserva(req.body);
        await reserva.save();
        res.status(201).json(reserva);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/enviar-bienvenida', async (req, res) => {
    const { nombre, email, idioma } = req.body;
    
    const asunto = idioma === 'es' ? '¡Bienvenido a Detailing Team!' : 'Welcome to Detailing Team!';
    const contenido = idioma === 'es'
        ? `<h1>¡Hola ${nombre}!</h1><p>Gracias por registrarte.</p>`
        : `<h1>Hello ${nombre}!</h1><p>Thank you for registering.</p>`;
    
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

app.post('/api/enviar-reserva', async (req, res) => {
    const { cliente, reserva, tipo, idioma } = req.body;
    
    let asunto, contenido, destinatario;
    
    if (tipo === 'cliente') {
        destinatario = cliente.email;
        asunto = idioma === 'es' ? '✅ Confirmación de tu reserva' : '✅ Booking Confirmation';
        contenido = `<h1>¡Hola ${cliente.nombre}!</h1><h2>Tu reserva ha sido confirmada</h2>
                     <p><strong>Servicio:</strong> ${reserva.servicio}</p>
                     <p><strong>Fecha:</strong> ${reserva.fecha}</p>
                     <p><strong>Hora:</strong> ${reserva.hora}</p>
                     <p><strong>Total:</strong> $${reserva.precio}</p>`;
    } else {
        destinatario = process.env.EMAIL_USER;
        asunto = '🔔 NUEVA RESERVA RECIBIDA';
        contenido = `<h1>🔔 NUEVA RESERVA</h1>
                     <h2>Cliente: ${cliente.nombre}</h2>
                     <p><strong>Servicio:</strong> ${reserva.servicio}</p>
                     <p><strong>Fecha:</strong> ${reserva.fecha}</p>
                     <p><strong>Hora:</strong> ${reserva.hora}</p>
                     <p><strong>Total:</strong> $${reserva.precio}</p>`;
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

// =============================================
// EXPORTAR PARA VERCEL
// =============================================
module.exports = app;