// =============================================
// SERVIDOR PRINCIPAL - DETAILING TEAM
// =============================================
// Versión: 7.8 (CORRECCIÓN EMAIL SERVICE)
// Fecha: 30/08/2026
// 
// CAMBIOS REALIZADOS EN ESTA VERSIÓN:
// 1. ✅ Eliminada dependencia de emailService (usa transporter directamente)
// 2. ✅ Sistema de reseñas con estrellas (modelo + rutas)
// 3. ✅ Envío de email al propietario cuando llega una reseña
// 4. ✅ Eliminación automática del índice único al iniciar
// 5. ✅ Logs detallados en POST /api/visita
// 6. ✅ Manejo de errores con código 409 para duplicados
// 7. ✅ Conexión a MongoDB más robusta
// 8. ✅ CORS configurado correctamente
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

// ✅ IMPORTAR MODELO DE RESEÑAS
const Resena = require('./models/resena');

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
            return true;
        } catch (err) {
            console.error('❌ Error en reconexión:', err);
            setTimeout(ensureConnection, 5000);
            return false;
        }
    }
    return true;
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

// =============================================
// ELIMINAR ÍNDICE ÚNICO AL INICIAR (SI EXISTE)
// =============================================
mongoose.connection.once('open', async () => {
    try {
        const indexes = await Visita.collection.indexes();
        const uniqueIndex = indexes.find(i => i.name === 'ip_1_mes_1');
        if (uniqueIndex) {
            await Visita.collection.dropIndex('ip_1_mes_1');
            console.log('✅ Índice único ip_1_mes_1 eliminado correctamente');
        } else {
            console.log('ℹ️ El índice ip_1_mes_1 no existe, no es necesario eliminarlo');
        }
    } catch (err) {
        if (err.code === 27) {
            console.log('ℹ️ El índice ip_1_mes_1 no existe');
        } else {
            console.error('❌ Error al intentar eliminar el índice:', err);
        }
    }
});

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER || !EMAIL_PASS) {
    console.error('❌ ERROR CRÍTICO: EMAIL_USER o EMAIL_PASS no están definidas');
} else {
    console.log('📧 Email configurado para:', EMAIL_USER);
}

// =============================================
// TRANSPORTER PARA EMAILS (RESERVAS Y RESEÑAS)
// =============================================
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
// RUTAS DE VISITAS (CORREGIDAS)
// =============================================

function getMesActual() {
    const now = new Date();
    return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
}

// ✅ RUTA POST /api/visita (CON LOGS MEJORADOS Y DETECCIÓN DE ÍNDICES)
app.post('/api/visita', async (req, res) => {
    try {
        console.log('📥 POST /api/visita - Solicitud recibida');
        
        const connected = await ensureConnection();
        if (!connected) {
            console.error('❌ No se pudo conectar a MongoDB');
            return res.status(503).json({ error: 'Servicio no disponible' });
        }

        let ip = req.ip || 
                 req.headers['x-forwarded-for'] || 
                 req.connection.remoteAddress || 
                 req.socket.remoteAddress;
        
        if (Array.isArray(ip)) ip = ip[0];
        if (ip && ip.includes(',')) ip = ip.split(',')[0].trim();
        if (ip === '::1' || ip === '::ffff:127.0.0.1') ip = '127.0.0.1';
        
        console.log('🔍 IP detectada:', ip);

        if (!ip || ip === '') {
            console.error('❌ IP inválida o vacía');
            return res.status(400).json({ error: 'IP inválida' });
        }

        const mes = getMesActual();
        console.log('📅 Mes actual:', mes);

        const nuevaVisita = new Visita({ ip, mes });
        await nuevaVisita.save();
        
        console.log('✅ Visita registrada correctamente. ID:', nuevaVisita._id);
        
        const totalMes = await Visita.countDocuments({ mes });
        console.log('📊 Total de visitas del mes:', totalMes);
        
        res.status(201).json({ 
            mensaje: 'Visita registrada',
            id: nuevaVisita._id,
            totalMes: totalMes
        });
        
    } catch (error) {
        console.error('❌ Error en POST /api/visita:', error);
        
        if (error.code === 11000) {
            console.error('⚠️ ERROR DE DUPLICADO - Índice único detectado');
            return res.status(409).json({ 
                error: 'Ya existe un registro con esta IP y mes',
                code: 'DUPLICATE_KEY'
            });
        }
        
        res.status(500).json({ 
            error: 'Error interno del servidor',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

app.get('/api/visitas/mes', async (req, res) => {
    try {
        await ensureConnection();
        const mes = getMesActual();
        const total = await Visita.countDocuments({ mes });
        console.log('📊 GET /api/visitas/mes - Total:', total);
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
// RUTAS DE RESEÑAS (NUEVO SISTEMA)
// =============================================

// ✅ Importar el router de reseñas
const resenasRouter = require('./routes/resenas');
app.use('/api/resenas', resenasRouter);

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
    console.log(`⭐ Sistema de reseñas activo:`);
    console.log(`   GET  /api/resenas - Obtener reseñas aprobadas`);
    console.log(`   POST /api/resenas - Crear nueva reseña`);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Error no capturado:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ Promesa rechazada no manejada:', error);
});