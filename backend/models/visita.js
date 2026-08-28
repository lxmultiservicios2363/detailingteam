// =============================================
// MODELO DE VISITA - DETAILING TEAM
// =============================================
// Versión: 2.0 (SIN ÍNDICE ÚNICO)
// Fecha: 28/07/2026
// =============================================

const mongoose = require('mongoose');

const visitaSchema = new mongoose.Schema({
    ip: { type: String, required: true },
    mes: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
});

// ✅ EL ÍNDICE ÚNICO ESTÁ ELIMINADO PARA PERMITIR MÚLTIPLES VISITAS DESDE LA MISMA IP
// visitaSchema.index({ ip: 1, mes: 1 }, { unique: true });

module.exports = mongoose.model('Visita', visitaSchema);