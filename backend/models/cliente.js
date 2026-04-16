// =============================================
// MODELO DE CLIENTE - DETAILING TEAM
// =============================================
// Este archivo define la estructura de los datos
// de clientes que se guardarán en MongoDB.
// Cada clave corresponde a un campo en la base de datos.
// =============================================

// 📦 Importar mongoose (ODM para MongoDB)
const mongoose = require('mongoose');

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
    
    // 📌 modelo: Marca y modelo del vehículo (requerido)
    modelo: { 
        type: String, 
        required: true 
    },
    
    // 📌 anio: Año del vehículo (opcional)
    anio: { 
        type: String 
    },
    
    // 📌 placa: Placa del vehículo (opcional)
    placa: { 
        type: String 
    },
    
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