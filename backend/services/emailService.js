// =============================================
// RUTAS DE RESEÑAS - DETAILING TEAM
// =============================================
// Versión: 1.2 (CON ENVÍO DE EMAIL AL PROPIETARIO)
// Fecha: 30/08/2026
// =============================================

const express = require('express');
const router = express.Router();
const Resena = require('../models/resena');
const emailService = require('../services/emailService');

// =============================================
// GET /api/resenas - Obtener todas las reseñas aprobadas
// =============================================
router.get('/', async (req, res) => {
    try {
        console.log('📥 GET /api/resenas - Solicitando reseñas');
        const resenas = await Resena.find({ aprobada: true })
            .sort({ fecha: -1 })
            .limit(20);
        console.log(`✅ ${resenas.length} reseñas encontradas`);
        res.json(resenas);
    } catch (error) {
        console.error('❌ Error al obtener reseñas:', error);
        res.status(500).json({ error: 'Error al obtener reseñas' });
    }
});

// =============================================
// POST /api/resenas - Crear una nueva reseña
// =============================================
router.post('/', async (req, res) => {
    try {
        console.log('📥 POST /api/resenas - Solicitud recibida');
        console.log('📦 Body:', req.body);
        
        const { nombre, email, servicio, puntuacion, comentario, idioma } = req.body;
        
        // Validar campos requeridos
        if (!nombre || !email || !puntuacion || !comentario) {
            console.error('❌ Campos faltantes:', { nombre, email, puntuacion, comentario });
            return res.status(400).json({ 
                error: 'Faltan campos requeridos: nombre, email, puntuacion, comentario' 
            });
        }
        
        // Validar puntuación (1-5)
        if (puntuacion < 1 || puntuacion > 5) {
            return res.status(400).json({ error: 'La puntuación debe ser entre 1 y 5' });
        }
        
        const nuevaResena = new Resena({
            nombre,
            email,
            servicio: servicio || '',
            puntuacion,
            comentario,
            aprobada: false // Por defecto, pendiente de aprobación
        });
        
        await nuevaResena.save();
        console.log('✅ Nueva reseña guardada de:', nombre);
        console.log('📊 ID:', nuevaResena._id);

        // =============================================
        // 🔥 ENVIAR EMAIL AL PROPIETARIO
        // =============================================
        try {
            const destinatario = process.env.EMAIL_USER || 'contactdetailingteam@gmail.com'; // El correo de la empresa
            const idiomaEnvio = idioma || 'es';
            const enviado = await emailService.enviarEmailResena(nuevaResena, destinatario, idiomaEnvio);
            if (enviado) {
                console.log('📧 Email de reseña enviado al propietario');
            } else {
                console.warn('⚠️ No se pudo enviar el email de reseña');
            }
        } catch (emailError) {
            console.error('❌ Error al enviar email de reseña:', emailError);
            // No fallamos la petición si el email falla, solo logueamos
        }
        
        res.status(201).json({ 
            mensaje: 'Reseña guardada correctamente. Pendiente de aprobación.',
            resena: nuevaResena 
        });
    } catch (error) {
        console.error('❌ Error al guardar reseña:', error);
        res.status(500).json({ error: 'Error al guardar la reseña' });
    }
});

// =============================================
// PUT /api/resenas/:id/aprobar - Aprobar una reseña (solo admin)
// =============================================
router.put('/:id/aprobar', async (req, res) => {
    try {
        const resena = await Resena.findByIdAndUpdate(
            req.params.id,
            { aprobada: true },
            { new: true }
        );
        
        if (!resena) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }
        
        console.log('✅ Reseña aprobada:', resena.nombre);
        res.json({ mensaje: 'Reseña aprobada', resena });
    } catch (error) {
        console.error('❌ Error al aprobar reseña:', error);
        res.status(500).json({ error: 'Error al aprobar la reseña' });
    }
});

// =============================================
// DELETE /api/resenas/:id - Eliminar una reseña (solo admin)
// =============================================
router.delete('/:id', async (req, res) => {
    try {
        const resena = await Resena.findByIdAndDelete(req.params.id);
        if (!resena) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }
        console.log('✅ Reseña eliminada:', resena.nombre);
        res.json({ mensaje: 'Reseña eliminada' });
    } catch (error) {
        console.error('❌ Error al eliminar reseña:', error);
        res.status(500).json({ error: 'Error al eliminar la reseña' });
    }
});

module.exports = router;