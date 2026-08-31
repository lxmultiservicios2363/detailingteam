// =============================================
// RUTAS DE RESEÑAS - DETAILING TEAM
// =============================================
// Versión: 1.3 (ENVÍO DE EMAIL DIRECTO)
// Fecha: 31/08/2026
// =============================================

const express = require('express');
const router = express.Router();
const Resena = require('../models/resena');
const nodemailer = require('nodemailer');

// Reutilizar el transporter que ya tienes en server.js
// Como no podemos acceder a él directamente, creamos uno nuevo con las mismas credenciales
// pero usando variables de entorno (que ya están cargadas)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

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
            aprobada: false
        });
        
        await nuevaResena.save();
        console.log('✅ Nueva reseña guardada de:', nombre);
        console.log('📊 ID:', nuevaResena._id);

        // =============================================
        // 🔥 ENVIAR EMAIL AL PROPIETARIO
        // =============================================
        try {
            const destinatario = process.env.EMAIL_USER || 'contactdetailingteam@gmail.com';
            const idiomaEnvio = idioma || 'es';
            
            const asunto = idiomaEnvio === 'es' 
                ? '⭐ Nueva reseña recibida - Detailing Team'
                : '⭐ New review received - Detailing Team';

            const contenido = idiomaEnvio === 'es'
                ? `<h1>⭐ NUEVA RESEÑA RECIBIDA</h1>
                   <h2 style="color: #0a2b5c;">Datos del Cliente:</h2>
                   <div style="background-color: #f0f0f0; padding: 15px; border-radius: 8px;">
                       <p><strong>👤 Nombre:</strong> ${nuevaResena.nombre}</p>
                       <p><strong>📧 Email:</strong> ${nuevaResena.email}</p>
                       ${nuevaResena.servicio ? `<p><strong>🛠️ Servicio:</strong> ${nuevaResena.servicio}</p>` : ''}
                       <p><strong>⭐ Puntuación:</strong> ${'★'.repeat(nuevaResena.puntuacion)}${'☆'.repeat(5 - nuevaResena.puntuacion)} (${nuevaResena.puntuacion}/5)</p>
                       <p><strong>💬 Comentario:</strong><br>${nuevaResena.comentario}</p>
                       <p><strong>📆 Fecha:</strong> ${new Date().toLocaleString()}</p>
                   </div>
                   <p style="margin-top: 20px; color: #c9a959;">
                       <strong>📌 La reseña está pendiente de aprobación.</strong><br>
                       Para publicarla en la web, ve a MongoDB Atlas → colección "resenas" y cambia "aprobada" a true.
                   </p>
                   <p style="font-size: 0.9rem; color: #666;">📍 Detailing Team - www.detailingteamtx.com</p>`
                : `<h1>⭐ NEW REVIEW RECEIVED</h1>
                   <h2 style="color: #0a2b5c;">Customer Details:</h2>
                   <div style="background-color: #f0f0f0; padding: 15px; border-radius: 8px;">
                       <p><strong>👤 Name:</strong> ${nuevaResena.nombre}</p>
                       <p><strong>📧 Email:</strong> ${nuevaResena.email}</p>
                       ${nuevaResena.servicio ? `<p><strong>🛠️ Service:</strong> ${nuevaResena.servicio}</p>` : ''}
                       <p><strong>⭐ Rating:</strong> ${'★'.repeat(nuevaResena.puntuacion)}${'☆'.repeat(5 - nuevaResena.puntuacion)} (${nuevaResena.puntuacion}/5)</p>
                       <p><strong>💬 Comment:</strong><br>${nuevaResena.comentario}</p>
                       <p><strong>📆 Date:</strong> ${new Date().toLocaleString()}</p>
                   </div>
                   <p style="margin-top: 20px; color: #c9a959;">
                       <strong>📌 The review is pending approval.</strong><br>
                       To publish it on the website, go to MongoDB Atlas → collection "resenas" and change "aprobada" to true.
                   </p>
                   <p style="font-size: 0.9rem; color: #666;">📍 Detailing Team - www.detailingteamtx.com</p>`;

            await transporter.sendMail({
                from: `"Detailing Team" <${destinatario}>`,
                to: destinatario,
                subject: asunto,
                html: contenido
            });
            
            console.log(`✅ Email de reseña enviado a ${destinatario}`);
        } catch (emailError) {
            console.error('❌ Error al enviar email de reseña:', emailError);
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
// PUT /api/resenas/:id/aprobar - Aprobar una reseña
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
// DELETE /api/resenas/:id - Eliminar una reseña
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