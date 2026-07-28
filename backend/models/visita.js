const mongoose = require('mongoose');

/**
 * Modelo de Visita
 * 
 * Registra cada visita a la página web sin restricción de IP.
 * 
 * Campos:
 * - ip: Dirección IP del visitante (string, obligatorio)
 * - mes: Mes de la visita en formato "YYYY-MM" (string, obligatorio)
 * - fecha: Fecha y hora de la visita (Date, por defecto Date.now)
 * 
 * ✅ NOTA: Se ha eliminado el índice único por IP + mes para permitir
 * que todas las visitas se registren, sin importar si la misma IP
 * visita varias veces en el mismo mes.
 */
const visitaSchema = new mongoose.Schema({
    ip: { type: String, required: true },
    mes: { type: String, required: true }, // "YYYY-MM"
    fecha: { type: Date, default: Date.now }
});

// ❌ ÍNDICE ELIMINADO - Ahora se guardan TODAS las visitas
// visitaSchema.index({ ip: 1, mes: 1 }, { unique: true });

module.exports = mongoose.model('Visita', visitaSchema);