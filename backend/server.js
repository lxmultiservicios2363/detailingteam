// =============================================
// SERVIDOR PRINCIPAL - DETAILING TEAM
// =============================================
// Versión: 7.2 (SIN RESTRICCIÓN DE IP ÚNICA POR MES)
// Fecha: 27/07/2026
// =============================================

const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
const cors = require('cors');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

console.log('📝 VERIFICANDO VARIABLES DE ENTORNO:');
console.log('   MONGO_URI:', process.env.MONGO_URI ? '✅ CARGADA' : '❌ NO CARGADA');
console.log('   EMAIL_USER:', process.env.EMAIL_USER ? '✅ CARGADO' : '❌ NO CARGADO');
console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ CARGADA' : '❌ NO CARGADA');
console.log('   PORT:', process.env.PORT || '3001 (default)');

dns.setServers(['8.8.8.8', '8.8.4.4']);
console.log('🌐 DNS configurado: 8.8.8.8, 8.8.4.4');

const Cliente = require('./models/cliente');
const Reserva = require('./models/reserva');
const Visita = require('./models/visita');

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:3001',
    'https://detailingteam.onrender.com',
    'https://detailingteamtx.com',
    'https://www.detailingteamtx.com',
    'null',
    'file://'
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith('file://')) {
            callback(null, true);
        } else {
            console.log('🚫 Origen bloqueado por CORS:', origin);
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ ERROR CRÍTICO: MONGO_URI no está definida en el archivo .env');
    process.exit(1);
}

const mongoOptions = {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    },
    family: 4,
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 60000,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 30000,
    heartbeatFrequencyMS: 10000,
    retryWrites: true,
    retryReads: true
};

mongoose.connect(MONGO_URI, mongoOptions)
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch(err => console.error('❌ Error conectando a MongoDB:', err));

const db = mongoose.connection;

db.on('connected', () => {
    console.log('✅ MongoDB conectado');
});

db.on('disconnected', () => {
    console.log('⚠️ MongoDB desconectado - Intentando reconectar...');
    setTimeout(() => {
        mongoose.connect(MONGO_URI, mongoOptions)
            .then(() => console.log('✅ MongoDB reconectado exitosamente'))
            .catch(err => console.error('❌ Error en reconexión:', err));
    }, 5000);
});

db.on('error', (err) => {
    console.error('❌ Error en MongoDB:', err);
});

db.on('reconnected', () => {
    console.log('✅ MongoDB reconectado exitosamente');
});

async function ensureConnection() {
    if (mongoose.connection.readyState !== 1) {
        console.log('🔄 Reconectando a MongoDB...');
        try {
            await mongoose.connect(MONGO_URI, mongoOptions);
            console.log('✅ Reconexión exitosa');
        } catch (err) {
            console.error('❌ Error en reconexión:', err);
            setTimeout(ensureConnection, 5000);
        }
    }
}

setInterval(async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.db.admin().ping();
            console.log('🔄 Ping a MongoDB - Conexión activa');
        }
    } catch (err) {
        console.log('⚠️ Ping falló - Reconectando...');
        await ensureConnection();
    }
}, 30000);

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER || !EMAIL_PASS) {
    console.error('❌ ERROR CRÍTICO: EMAIL_USER o EMAIL_PASS no están definidas');
} else {
    console.log('📧 Email configurado para:', EMAIL_USER);
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Error en configuración de email:', error.message);
    } else {
        console.log('📧 Servidor de email listo');
    }
});

// =============================================
// RUTAS DE LA API
// =============================================

app.get('/api/clientes', async (req, res) => {
    try {
        await ensureConnection();
        const clientes = await Cliente.find().sort({ fecha: -1 });
        res.json(clientes);
    } catch (error) {
        console.error('❌ Error al obtener clientes:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/clientes', async (req, res) => {
    try {
        await ensureConnection();
        const { nombre, email, telefono, modelo } = req.body;
        if (!nombre || !email || !telefono || !modelo) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        const cliente = new Cliente(req.body);
        await cliente.save();
        console.log('✅ Cliente guardado:', cliente.email);
        res.status(201).json(cliente);
    } catch (error) {
        console.error('❌ Error al guardar cliente:', error);
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/reservas', async (req, res) => {
    try {
        await ensureConnection();
        const reservas = await Reserva.find().sort({ fechaSolicitud: -1 });
        res.json(reservas);
    } catch (error) {
        console.error('❌ Error al obtener reservas:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/reservas', async (req, res) => {
    try {
        await ensureConnection();
        const { servicio, tipoVehiculo, fecha, hora, precio, clienteEmail } = req.body;
        if (!servicio || !tipoVehiculo || !fecha || !hora || !precio || !clienteEmail) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        const reserva = new Reserva(req.body);
        await reserva.save();
        console.log('✅ Reserva guardada para:', clienteEmail);
        res.status(201).json(reserva);
    } catch (error) {
        console.error('❌ Error al guardar reserva:', error);
        res.status(400).json({ error: error.message });
    }
});

// =============================================
// RUTAS DE VISITAS (SIN RESTRICCIÓN DE IP)
// =============================================

function getMesActual() {
    const now = new Date();
    return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
}

app.post('/api/visita', async (req, res) => {
    try {
        await ensureConnection();
        const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
        const mes = getMesActual();

        // ✅ Guardar la visita sin verificar duplicados
        const nuevaVisita = new Visita({ ip, mes });
        await nuevaVisita.save();

        res.status(201).json({ mensaje: 'Visita registrada' });
    } catch (error) {
        console.error('❌ Error al registrar visita:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/api/visitas/mes', async (req, res) => {
    try {
        await ensureConnection();
        const mes = getMesActual();
        const total = await Visita.countDocuments({ mes });
        res.json({ total });
    } catch (error) {
        console.error('❌ Error al contar visitas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/api/reservas/total', async (req, res) => {
    try {
        await ensureConnection();
        const total = await Reserva.countDocuments();
        res.json({ total });
    } catch (error) {
        console.error('❌ Error al contar reservas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// =============================================
// RUTAS DE EMAILS
// =============================================

app.post('/api/enviar-bienvenida', async (req, res) => {
    const { nombre, email, idioma } = req.body;

    if (!nombre || !email) {
        return res.status(400).json({ error: 'Faltan nombre o email' });
    }

    const asunto = idioma === 'es' 
        ? '¡Bienvenido a Detailing Team!' 
        : 'Welcome to Detailing Team!';

    const contenido = idioma === 'es'
        ? `<h1>¡Hola ${nombre}!</h1>
           <p>Gracias por registrarte en Detailing Team.</p>
           <p>Ahora puedes reservar tus servicios favoritos.</p>
           <p>¡Te esperamos!</p>
           <p>📍 13330 West Road, Houston, TX 77041</p>
           <p>📞 +1 (713) 928-0466</p>`
        : `<h1>Hello ${nombre}!</h1>
           <p>Thank you for registering with Detailing Team.</p>
           <p>Now you can book your favorite services.</p>
           <p>We look forward to seeing you!</p>
           <p>📍 13330 West Road, Houston, TX 77041</p>
           <p>📞 +1 (713) 928-0466</p>`;

    try {
        await transporter.sendMail({
            from: `"Detailing Team" <${EMAIL_USER}>`,
            to: email,
            subject: asunto,
            html: contenido
        });

        console.log('✅ Email de bienvenida enviado a:', email);
        res.json({ success: true, message: 'Email enviado correctamente' });
    } catch (error) {
        console.error('❌ Error enviando email de bienvenida:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/enviar-reserva', async (req, res) => {
    const { cliente, reserva, tipo, idioma } = req.body;

    if (!cliente || !reserva || !tipo) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    let asunto, contenido, destinatario;

    if (tipo === 'cliente') {
        destinatario = cliente.email;
        asunto = idioma === 'es' 
            ? '✅ Confirmación de tu reserva - Detailing Team'
            : '✅ Booking Confirmation - Detailing Team';

        contenido = idioma === 'es'
            ? `<h1>¡Hola ${cliente.nombre}!</h1>
               <h2>Tu reserva ha sido confirmada</h2>
               <div style="background-color: #f0f0f0; padding: 20px; border-radius: 10px;">
                   <p><strong>📋 Servicio:</strong> ${reserva.servicio}</p>
                   <p><strong>🚗 Vehículo:</strong> ${reserva.tipoVehiculo === 'suv' ? 'SUV/Truck' : 'Sedán'}</p>
                   <p><strong>📅 Fecha:</strong> ${reserva.fecha}</p>
                   <p><strong>⏰ Hora:</strong> ${reserva.hora}</p>
                   <p><strong>💰 Total:</strong> $${reserva.precio}</p>
                   <p><strong>💳 Método de pago:</strong> ${reserva.metodoPago || 'Efectivo'}</p>
                   ${reserva.notas ? `<p><strong>📝 Notas:</strong> ${reserva.notas}</p>` : ''}
               </div>
               <p>📍 <strong>Dirección:</strong> 13330 West Road, Houston, TX 77041</p>
               <p>📞 <strong>Teléfono:</strong> +1 (713) 928-0466</p>
               <p>¡Te esperamos!</p>`
            : `<h1>Hello ${cliente.nombre}!</h1>
               <h2>Your booking has been confirmed</h2>
               <div style="background-color: #f0f0f0; padding: 20px; border-radius: 10px;">
                   <p><strong>📋 Service:</strong> ${reserva.servicio}</p>
                   <p><strong>🚗 Vehicle:</strong> ${reserva.tipoVehiculo === 'suv' ? 'SUV/Truck' : 'Sedan'}</p>
                   <p><strong>📅 Date:</strong> ${reserva.fecha}</p>
                   <p><strong>⏰ Time:</strong> ${reserva.hora}</p>
                   <p><strong>💰 Total:</strong> $${reserva.precio}</p>
                   <p><strong>💳 Payment method:</strong> ${reserva.metodoPago || 'Cash'}</p>
                   ${reserva.notas ? `<p><strong>📝 Notes:</strong> ${reserva.notas}</p>` : ''}
               </div>
               <p>📍 <strong>Address:</strong> 13330 West Road, Houston, TX 77041</p>
               <p>📞 <strong>Phone:</strong> +1 (713) 928-0466</p>
               <p>We look forward to seeing you!</p>`;

    } else {
        destinatario = EMAIL_USER;
        asunto = '🔔 NUEVA RESERVA RECIBIDA - Detailing Team';

        contenido = `<h1>🔔 NUEVA RESERVA RECIBIDA</h1>
                    <h2 style="color: #0a2b5c;">Datos del Cliente:</h2>
                    <div style="background-color: #f0f0f0; padding: 15px; border-radius: 8px;">
                        <p><strong>👤 Nombre:</strong> ${cliente.nombre}</p>
                        <p><strong>📧 Email:</strong> ${cliente.email}</p>
                        <p><strong>📞 Teléfono:</strong> ${cliente.telefono}</p>
                        <p><strong>🚗 Vehículo:</strong> ${cliente.modelo} ${cliente.anio || ''}</p>
                        <p><strong>🔢 Placa:</strong> ${cliente.placa || 'No registrada'}</p>
                    </div>
                    <h2 style="color: #0a2b5c; margin-top: 20px;">Detalle de la Reserva:</h2>
                    <div style="background-color: #f0f0f0; padding: 15px; border-radius: 8px;">
                        <p><strong>📋 Servicio:</strong> ${reserva.servicio}</p>
                        <p><strong>🚙 Tipo:</strong> ${reserva.tipoVehiculo === 'suv' ? 'SUV/Truck (3 filas)' : 'Sedán'}</p>
                        <p><strong>📅 Fecha:</strong> ${reserva.fecha}</p>
                        <p><strong>⏰ Hora:</strong> ${reserva.hora}</p>
                        <p><strong>💰 Total:</strong> $${reserva.precio}</p>
                        <p><strong>💳 Método de pago:</strong> ${reserva.metodoPago || 'Efectivo'}</p>
                        ${reserva.notas ? `<p><strong>📝 Notas:</strong> ${reserva.notas}</p>` : ''}
                        <p><strong>📆 Fecha de solicitud:</strong> ${new Date().toLocaleString()}</p>
                    </div>
                    <p style="margin-top: 20px; color: #c9a959;"><strong>⚠️ Por favor confirmar disponibilidad con el cliente.</strong></p>`;
    }

    try {
        await transporter.sendMail({
            from: `"Detailing Team" <${EMAIL_USER}>`,
            to: destinatario,
            subject: asunto,
            html: contenido
        });

        console.log(`✅ Email de ${tipo} enviado`);
        res.json({ success: true, message: 'Email enviado correctamente' });
    } catch (error) {
        console.error('❌ Error enviando email:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/ping', (req, res) => {
    res.json({ 
        status: 'alive', 
        time: new Date().toISOString(),
        mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📧 Email configurado para: ${EMAIL_USER}`);
    console.log(`🌐 CORS configurado con dominios permitidos`);
    console.log(`   ✅ https://detailingteamtx.com`);
    console.log(`   ✅ https://www.detailingteamtx.com`);
    console.log(`🔄 Ping a MongoDB cada 30 segundos para mantener conexión activa`);
    console.log(`📊 Endpoints de estadísticas actualizados:`);
    console.log(`   POST /api/visita - Registrar visita (SIN restricción de IP única)`);
    console.log(`   GET  /api/visitas/mes - Total de visitas del mes`);
    console.log(`   GET  /api/reservas/total - Total de reservas global`);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Error no capturado:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ Promesa rechazada no manejada:', error);
});