// =============================================
// SERVIDOR PRINCIPAL - DETAILING TEAM
// =============================================
// Este archivo configura el backend con Express,
// conecta a MongoDB Atlas y maneja las rutas API
// para clientes, reservas y envío de emails.
// 
// 📌 Versión: 3.1 (CORREGIDA - CORS CON CREDENCIALES)
// 📌 Fecha: 17/03/2026
// 📌 Autor: Luis Enrique Reina Mesa
// =============================================

// =============================================
// 📦 IMPORTACIÓN DE DEPENDENCIAS
// =============================================
const express = require('express');          // Framework para crear el servidor web
const nodemailer = require('nodemailer');    // Librería para enviar emails
const mongoose = require('mongoose');         // ODM para conectar con MongoDB
const dotenv = require('dotenv');             // Para leer variables de entorno del archivo .env
const dns = require('dns');                   // Módulo DNS nativo de Node.js
const cors = require('cors');                 // Para permitir conexiones desde el frontend

// =============================================
// 🌐 CONFIGURACIÓN DNS PARA NODE.JS v22+
// =============================================
// 🔍 PROBLEMA: En Node.js v22+ en Windows, a veces falla la resolución
//    de los registros DNS SRV que MongoDB Atlas necesita.
//    Esto causa el error "querySrv ECONNREFUSED".
//
// ✅ SOLUCIÓN: Forzar el uso de Google DNS (8.8.8.8, 8.8.4.4)
//    que sí soportan correctamente las consultas SRV.
//
// 📚 REFERENCIA: Esta solución está documentada en foros de MongoDB
//    y Stack Overflow como solución definitiva.
// =============================================
dns.setServers(['8.8.8.8', '8.8.4.4']);
console.log('🌐 DNS configurado: 8.8.8.8, 8.8.4.4');

// =============================================
// 🔐 CARGAR VARIABLES DE ENTORNO
// =============================================
// Lee las variables del archivo .env (EMAIL_USER, EMAIL_PASSWORD, MONGODB_URI)
dotenv.config();

// =============================================
// 📁 IMPORTAR MODELOS DE DATOS
// =============================================
// Estos archivos definen la estructura de los datos
// que se guardarán en MongoDB
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
// 🔍 PROBLEMA: El frontend envía credentials: 'include' pero origin: '*'
//    no permite credenciales. Es incompatible.
//
// ✅ SOLUCIÓN: Especificar orígenes permitidos y permitir credenciales.
// =============================================

// Lista de orígenes permitidos (ajusta según necesites)
const allowedOrigins = [
    'http://localhost:3000',  // Puerto común de desarrollo
    'http://localhost:5500',  // Puerto de Live Server
    'http://127.0.0.1:5500',
    'http://localhost:3001',  // El mismo backend
    'null',                   // Para archivos locales (file://)
    'file://'                  // Para archivos locales
];

// Configuración CORS con credenciales permitidas
app.use(cors({
    origin: function(origin, callback) {
        // Permitir solicitudes sin origen (como Postman o archivos locales)
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith('file://')) {
            callback(null, true);
        } else {
            console.log('🚫 Origen bloqueado por CORS:', origin);
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true,        // 👈 PERMITE ENVIAR COOKIES Y CREDENCIALES
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware para que el servidor entienda JSON (debe ir DESPUÉS de CORS)
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para datos de formularios

// =============================================
// 🗄️ CONEXIÓN A MONGODB ATLAS
// =============================================
// 📌 MONGODB_URI: Viene del archivo .env
//    Ejemplo: mongodb+srv://usuario:contraseña@cluster.mongodb.net/basedatos
//
// ⚙️ OPCIONES:
//   - serverApi: Configura la versión estable de la API
//   - family: 4  👈 Fuerza el uso de IPv4 (evita problemas con IPv6)
// =============================================
mongoose.connect(process.env.MONGODB_URI, {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    },
    family: 4 // 👈 Forzar IPv4 para evitar conflictos de red
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => console.error('❌ Error conectando a MongoDB:', err));

// =============================================
// 📧 CONFIGURACIÓN DE EMAIL (NODEMAILER)
// =============================================
// Configura el transporte para enviar emails usando Gmail
// Requiere una contraseña de aplicación (no la contraseña normal)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verificar que la configuración de email sea correcta
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Error en configuración de email:', error);
    } else {
        console.log('📧 Servidor de email listo');
    }
});

// =============================================
// 🌐 RUTAS DE LA API
// =============================================

// ---------------------------------------------
// 🏠 RUTA DE PRUEBA
// ---------------------------------------------
// Verifica que el servidor esté funcionando
app.get('/', (req, res) => {
    res.send('✅ Servidor de Detailing Team con MongoDB funcionando');
});

// =============================================
// 👥 RUTAS DE CLIENTES
// =============================================

// 📋 Obtener todos los clientes (ordenados del más reciente al más antiguo)
app.get('/api/clientes', async (req, res) => {
    try {
        const clientes = await Cliente.find().sort({ fecha: -1 });
        res.json(clientes);
    } catch (error) {
        console.error('❌ Error al obtener clientes:', error);
        res.status(500).json({ error: error.message });
    }
});

// ➕ Registrar un nuevo cliente
app.post('/api/clientes', async (req, res) => {
    try {
        // Validar que los datos requeridos estén presentes
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

// =============================================
// 📅 RUTAS DE RESERVAS
// =============================================

// 📋 Obtener todas las reservas (ordenadas de la más reciente a la más antigua)
app.get('/api/reservas', async (req, res) => {
    try {
        const reservas = await Reserva.find().sort({ fechaSolicitud: -1 });
        res.json(reservas);
    } catch (error) {
        console.error('❌ Error al obtener reservas:', error);
        res.status(500).json({ error: error.message });
    }
});

// ➕ Crear una nueva reserva
app.post('/api/reservas', async (req, res) => {
    try {
        // Validar que los datos requeridos estén presentes
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
// 📧 RUTAS DE EMAILS
// =============================================

// ✉️ Email de bienvenida al registrarse
app.post('/api/enviar-bienvenida', async (req, res) => {
    const { nombre, email, idioma } = req.body;

    // Validar datos requeridos
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
        const info = await transporter.sendMail({
            from: `"Detailing Team" <${process.env.EMAIL_USER}>`,
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

// ✉️ Email de confirmación de reserva (para cliente y propietario)
app.post('/api/enviar-reserva', async (req, res) => {
    const { cliente, reserva, tipo, idioma } = req.body;

    // Validar datos requeridos
    if (!cliente || !reserva || !tipo) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    let asunto, contenido, destinatario;

    // ---------------------------------------------
    // 📧 EMAIL PARA EL CLIENTE
    // ---------------------------------------------
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

    // ---------------------------------------------
    // 📧 EMAIL PARA EL PROPIETARIO
    // ---------------------------------------------
    } else {
        destinatario = process.env.EMAIL_USER;
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
        const info = await transporter.sendMail({
            from: `"Detailing Team" <${process.env.EMAIL_USER}>`,
            to: destinatario,
            subject: asunto,
            html: contenido
        });

        console.log(`✅ Email de ${tipo} enviado:`, info.messageId);
        res.json({ success: true, message: 'Email enviado correctamente' });
    } catch (error) {
        console.error('❌ Error enviando email:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// =============================================
// 🚀 INICIAR SERVIDOR
// =============================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📧 Email configurado para: ${process.env.EMAIL_USER}`);
    console.log(`🌐 CORS configurado con credenciales permitidas`);
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