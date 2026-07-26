const mongoose = require('mongoose');

const visitaSchema = new mongoose.Schema({
    ip: { type: String, required: true },
    mes: { type: String, required: true }, // "YYYY-MM"
    fecha: { type: Date, default: Date.now }
});

// Índice compuesto único para evitar duplicados por IP + mes
visitaSchema.index({ ip: 1, mes: 1 }, { unique: true });

module.exports = mongoose.model('Visita', visitaSchema);