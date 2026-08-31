// =============================================
// SERVICIO DE EMAILS PARA RESEÑAS
// =============================================
// Versión: 1.0
// Fecha: 31/08/2026
// =============================================

const nodemailer = require('nodemailer');

let transporter = null;

function initEmailService(emailUser, emailPass) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPass
        }
    });
    console.log('📧 Servicio de email para reseñas iniciado');
    return transporter;
}

async function enviarEmailResena(resena, destinatario, idioma = 'es') {
    if (!transporter) {
        console.error('❌ Transporter no inicializado');
        return false;
    }

    const asunto = idioma === 'es' 
        ? '⭐ Nueva reseña recibida - Detailing Team'
        : '⭐ New review received - Detailing Team';

    const contenido = idioma === 'es'
        ? `<h1>⭐ NUEVA RESEÑA RECIBIDA</h1>
           <h2 style="color: #0a2b5c;">Datos del Cliente:</h2>
           <div style="background-color: #f0f0f0; padding: 15px; border-radius: 8px;">
               <p><strong>👤 Nombre:</strong> ${resena.nombre}</p>
               <p><strong>📧 Email:</strong> ${resena.email}</p>
               ${resena.servicio ? `<p><strong>🛠️ Servicio:</strong> ${resena.servicio}</p>` : ''}
               <p><strong>⭐ Puntuación:</strong> ${'★'.repeat(resena.puntuacion)}${'☆'.repeat(5 - resena.puntuacion)} (${resena.puntuacion}/5)</p>
               <p><strong>💬 Comentario:</strong><br>${resena.comentario}</p>
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
               <p><strong>👤 Name:</strong> ${resena.nombre}</p>
               <p><strong>📧 Email:</strong> ${resena.email}</p>
               ${resena.servicio ? `<p><strong>🛠️ Service:</strong> ${resena.servicio}</p>` : ''}
               <p><strong>⭐ Rating:</strong> ${'★'.repeat(resena.puntuacion)}${'☆'.repeat(5 - resena.puntuacion)} (${resena.puntuacion}/5)</p>
               <p><strong>💬 Comment:</strong><br>${resena.comentario}</p>
               <p><strong>📆 Date:</strong> ${new Date().toLocaleString()}</p>
           </div>
           <p style="margin-top: 20px; color: #c9a959;">
               <strong>📌 The review is pending approval.</strong><br>
               To publish it on the website, go to MongoDB Atlas → collection "resenas" and change "aprobada" to true.
           </p>
           <p style="font-size: 0.9rem; color: #666;">📍 Detailing Team - www.detailingteamtx.com</p>`;

    try {
        await transporter.sendMail({
            from: `"Detailing Team" <${destinatario}>`,
            to: destinatario,
            subject: asunto,
            html: contenido
        });
        console.log(`✅ Email de reseña enviado a ${destinatario}`);
        return true;
    } catch (error) {
        console.error('❌ Error enviando email de reseña:', error);
        return false;
    }
}

module.exports = {
    initEmailService,
    enviarEmailResena
};