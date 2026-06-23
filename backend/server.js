// =============================================
// SERVIDOR PRINCIPAL - DETAILING TEAM
// =============================================
// Este archivo configura el backend con Express,
// conecta a MongoDB Atlas y maneja las rutas API
// para clientes, reservas y envío de emails.
// 
// 📌 Versión: 7.0 (CONEXIÓN MONGODB OPTIMIZADA)
// 📌 Fecha: 22/06/2026
// 📌 Autor: Luis Enrique Reina Mesa
// =============================================

// =============================================
// 📦 IMPORTACIÓN DE DEPENDENCIAS
// =============================================
const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
const cors = require('cors');
const path = require('path');

// =============================================
// 🔐 CARGAR VARIABLES DE ENTORNO (FORZADO)
// =============================================
dotenv.config({ path: path.join(__dirname, '.env') });

// Debug: Verificar que las variables se cargaron
console.log('📝 VERIFICANDO VARIABLES DE ENTORNO:');
console.log('   MONGO_URI:', process.env.MONGO_URI ? '✅ CARGADA' : '❌ NO CARGADA');
console.log('   EMAIL_USER:', process.env.EMAIL_USER ? '✅ CARGADO' : '❌ NO CARGADO');
console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ CARGADA' : '❌ NO CARGADA');
console.log('   PORT:', process.env.PORT || '3001 (default)');

// =============================================
// 🌐 CONFIGURACIÓN DNS PARA NODE.JS v22+
// =============================================
dns.setServers(['8.8.8.8', '8.8.4.4']);
console.log('🌐 DNS configurado: 8.8.8.8, 8.8.4.4');

// =============================================
// 📁 IMPORTAR MODELOS DE DATOS
// =============================================
const Cliente = require('./models/cliente');
const Reserva = require('./models/reserva');

// =============================================
// 🚀 INICIALIZAR EXPRESS
// =============================================
const app = express();
const PORT = process.env.PORT || 3001;

// =============================================
// 🌐 CONFIGURACIÓN DE CORS (CORREGIDA)
// =============================================
const allowedOrigins = [
    // Desarrollo local
    'http://localhost:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:3001',
    // Dominios de prueba
    'https://detailingteam.onrender.com',
    // DOMINIO FINAL (el que estás usando)
    'https://detailingteamtx.com',
    'https://www.detailingteamtx.com',
    // Para casos especiales
    'null',
    'file://'
];

app.use(cors({
    origin: function(origin, callback) {
        // Permitir si no hay origen (ej: Postman) o si está en la lista blanca
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

// =============================================
// 📁 SERVIR ARCHIVOS ESTÁTICOS (FRONTEND)
// =============================================
// Esto permite que el backend entregue tu página web
app.use(express.static(path.join(__dirname, '..')));

// Ruta principal - sirve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// =============================================
// 🗄️ CONEXIÓN A MONGODB ATLAS (OPTIMIZADA)
// =============================================
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ ERROR CRÍTICO: MONGO_URI no está definida en el archivo .env');
    process.exit(1);
}

// OPCIONES DE CONEXIÓN PARA EVITAR DESCONEXIONES
const mongoOptions = {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    },
    family: 4,
    // 🔥 NUEVAS OPCIONES PARA EVITAR DESCONEXIONES
    maxPoolSize: 10,                    // Conexiones simultáneas
    minPoolSize: 2,                     // Mantiene conexiones activas
    maxIdleTimeMS: 60000,               // Cierra conexiones inactivas después de 1 minuto
    connectTimeoutMS: 30000,            // Tiempo máximo para conectar
    socketTimeoutMS: 45000,             // Tiempo máximo para operaciones
    serverSelectionTimeoutMS: 30000,    // Tiempo para seleccionar servidor
    heartbeatFrequencyMS: 10000,        // Revisa el estado del servidor cada 10s
    retryWrites: true,
    retryReads: true
};

// CONEXIÓN INICIAL
mongoose.connect(MONGO_URI, mongoOptions)
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch(err => console.error('❌ Error conectando a MongoDB:', err));

// =============================================
// 🔄 MANEJO DE EVENTOS DE CONEXIÓN MONGODB
// =============================================
const db = mongoose.connection;

db.on('connected', () => {
    console.log('✅ MongoDB conectado');
});

db.on('disconnected', () => {
    console.log('⚠️ MongoDB desconectado - Intentando reconectar...');
    // Intentar reconectar automáticamente
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

// =============================================
// 🔧 FUNCIÓN PARA FORZAR RECONEXIÓN
// =============================================
async function ensureConnection() {
    if (mongoose.connection.readyState !== 1) {
        console.log('🔄 Reconectando a MongoDB...');
        try {
            await mongoose.connect(MONGO_URI, mongoOptions);
            console.log('✅ Reconexión exitosa');
        } catch (err) {
            console.error('❌ Error en reconexión:', err);
            // Reintentar después de 5 segundos
            setTimeout(ensureConnection, 5000);
        }
    }
}

// =============================================
// 🔄 PING A MONGODB PARA MANTENER CONEXIÓN ACTIVA
// =============================================
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
}, 30000); // Cada 30 segundos

// =============================================
// 📧 CONFIGURACIÓN DE EMAIL
// =============================================
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
// 🌐 RUTAS DE LA API
// =============================================

// 👥 RUTAS DE CLIENTES
app.get('/api/clientes', async (req, res) => {
    try {
        // Verificar conexión antes de operar
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
        // Verificar conexión antes de operar
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

// 📅 RUTAS DE RESERVAS
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

// 📧 RUTAS DE EMAILS
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

// =============================================
// 🏓 RUTA DE PING PARA MANTENER SERVIDOR ACTIVO
// =============================================
app.get('/api/ping', (req, res) => {
    res.json({ 
        status: 'alive', 
        time: new Date().toISOString(),
        mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// =============================================
// 🚀 INICIAR SERVIDOR
// =============================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📧 Email configurado para: ${EMAIL_USER}`);
    console.log(`🌐 CORS configurado con dominios permitidos`);
    console.log(`   ✅ https://detailingteamtx.com`);
    console.log(`   ✅ https://www.detailingteamtx.com`);
    console.log(`🔄 Ping a MongoDB cada 30 segundos para mantener conexión activa`);
});

// =============================================
// 🔧 MANEJO DE ERRORES NO CAPTURADOS
// =============================================
process.on('uncaughtException', (error) => {
    console.error('❌ Error no capturado:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ Promesa rechazada no manejada:', error);
});