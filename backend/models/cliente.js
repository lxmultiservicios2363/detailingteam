// =============================================
// MODELO DE CLIENTE - DETAILING TEAM
// =============================================
// Este archivo define la estructura de los datos
// de clientes que se guardarán en MongoDB.
// Cada clave corresponde a un campo en la base de datos.
// =============================================

// 📌 Modo estricto - ayuda a prevenir errores
'use strict';

// 📦 Importar mongoose (ODM para MongoDB)
const mongoose = require('mongoose');

// =============================================
// SUB-ESQUEMA PARA VEHÍCULOS
// =============================================
// Este subdocumento permite guardar múltiples vehículos por cliente
// Fue agregado el 19/04/2026 para soportar la solicitud del cliente:
// "Registrar hasta 3 vehículos por persona"
// =============================================
const vehiculoSchema = new mongoose.Schema({
    // 📌 marca: Marca del vehículo (requerido)
    marca: { type: String, required: true },
    
    // 📌 modelo: Modelo del vehículo (requerido)
    modelo: { type: String, required: true },
    
    // 📌 anio: Año del vehículo (opcional)
    anio: { type: String },
    
    // 📌 placa: Placa/matrícula del vehículo (requerido)
    // Este campo es clave para identificar el vehículo al hacer una reserva
    placa: { type: String, required: true }
});

// =============================================
// DEFINICIÓN DEL ESQUEMA DE CLIENTE
// =============================================
const clienteSchema = new mongoose.Schema({
    // 📌 nombre: Nombre completo del cliente (requerido)
    nombre: { 
        type: String, 
        required: true 
    },
    
    // 📌 email: Correo electrónico (requerido y único)
    email: { 
        type: String, 
        required: true, 
        unique: true  // No pueden haber dos clientes con el mismo email
    },
    
    // 📌 telefono: Número de teléfono (requerido)
    telefono: { 
        type: String, 
        required: true 
    },
    
    // 📌 direccion: Dirección del cliente
    // CAMBIO REALIZADO EL 19/04/2026: Este campo se agregó porque el formulario de registro
    // lo solicita. Antes no existía y causaba error HTTP 400.
    direccion: { 
        type: String, 
        required: true 
    },
    
    // 📌 vehiculos: Array de vehículos del cliente
    // CAMBIO REALIZADO EL 19/04/2026: Antes solo se permitía un vehículo con los campos
    // modelo, anio, placa. Ahora se pueden registrar hasta 3 vehículos por cliente.
    // Los vehículos se guardan como un array de subdocumentos usando vehiculoSchema.
    vehiculos: [vehiculoSchema],
    
    // 📌 fecha: Fecha de registro (se genera automáticamente)
    fecha: { 
        type: Date, 
        default: Date.now  // Si no se envía, usa la fecha actual
    }
});

// =============================================
// EXPORTAR EL MODELO
// =============================================
// Crea el modelo 'Cliente' basado en el esquema definido.
// Esto permite usar Cliente.find(), Cliente.save(), etc.
// =============================================
module.exports = mongoose.model('Cliente', clienteSchema);