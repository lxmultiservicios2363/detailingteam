// =============================================
// MODELO DE RESEÑAS - DETAILING TEAM
// =============================================
// Versión: 1.0
// Fecha: 28/07/2026
// =============================================

const mongoose = require('mongoose');

const resenaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    servicio: { type: String, default: '' },
    puntuacion: { type: Number, required: true, min: 1, max: 5 },
    comentario: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
    aprobada: { type: Boolean, default: false } // Para moderación
});

module.exports = mongoose.model('Resena', resenaSchema);