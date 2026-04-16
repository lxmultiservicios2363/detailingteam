// =============================================
// MODELO DE RESERVA - DETAILING TEAM
// =============================================
// Este archivo define la estructura de las reservas
// que se guardarán en MongoDB.
// Cada clave corresponde a un campo en la base de datos.
// =============================================

// 📌 Modo estricto - ayuda a prevenir errores
'use strict';

// 📦 Importar mongoose (ODM para MongoDB)
const mongoose = require('mongoose');

// =============================================
// DEFINICIÓN DEL ESQUEMA DE RESERVA
// =============================================
const reservaSchema = new mongoose.Schema({
    // 📌 servicio: Nombre del servicio reservado (requerido)
    servicio: { 
        type: String, 
        required: true 
    },
    
    // 📌 tipoVehiculo: 'sedan' o 'suv' (requerido)
    tipoVehiculo: { 
        type: String, 
        required: true 
    },
    
    // 📌 fecha: Fecha de la reserva (requerido)
    fecha: { 
        type: String, 
        required: true 
    },
    
    // 📌 hora: Hora de la reserva (requerido)
    hora: { 
        type: String, 
        required: true 
    },
    
    // 📌 notas: Comentarios adicionales (opcional)
    notas: { 
        type: String 
    },
    
    // 📌 precio: Precio final calculado (requerido)
    precio: { 
        type: String, 
        required: true 
    },
    
    // 📌 fechaSolicitud: Fecha en que se hizo la reserva (automático)
    fechaSolicitud: { 
        type: Date, 
        default: Date.now 
    },
    
    // 📌 clienteEmail: Email del cliente que reserva (requerido)
    clienteEmail: { 
        type: String, 
        required: true 
    },
    
    // 📌 pagadoOnline: Indica si se pagó por PayPal (booleano, por defecto false)
    pagadoOnline: { 
        type: Boolean, 
        default: false 
    },
    
    // 📌 metodoPago: 'PayPal' o 'Efectivo' (por defecto 'Efectivo')
    metodoPago: { 
        type: String, 
        default: 'Efectivo' 
    }
});

// =============================================
// EXPORTAR EL MODELO
// =============================================
// Crea el modelo 'Reserva' basado en el esquema definido.
// Esto permite usar Reserva.find(), Reserva.save(), etc.
// =============================================
module.exports = mongoose.model('Reserva', reservaSchema);