// =============================================
// SISTEMA DE RESEÑAS - DETAILING TEAM
// =============================================
// Versión: 1.1 (CON LOGS MEJORADOS)
// Fecha: 28/07/2026
// =============================================

// =============================================
// BACKEND URL
// =============================================
const RESENAS_BACKEND_URL = 'https://detailingteam.onrender.com';
console.log('📡 RESENAS_BACKEND_URL:', RESENAS_BACKEND_URL);

// =============================================
// FUNCIÓN: enviarResena
// =============================================
function enviarResena(event) {
    event.preventDefault();
    console.log('📝 Intentando enviar reseña...');
    
    // Obtener datos del formulario
    const nombre = document.getElementById('review-name').value.trim();
    const email = document.getElementById('review-email').value.trim();
    const servicio = document.getElementById('review-service').value;
    const comentario = document.getElementById('review-comment').value.trim();
    
    // Obtener puntuación seleccionada
    const ratingInput = document.querySelector('input[name="rating"]:checked');
    const puntuacion = ratingInput ? parseInt(ratingInput.value) : 0;
    
    console.log('📋 Datos del formulario:', { nombre, email, servicio, puntuacion, comentario });
    
    // Validaciones
    if (!nombre || !email || !comentario) {
        mostrarMensaje('⚠️ Por favor, completa todos los campos obligatorios.', 'error');
        return;
    }
    
    if (puntuacion === 0) {
        mostrarMensaje('⭐ Por favor, selecciona una puntuación de 1 a 5 estrellas.', 'error');
        return;
    }
    
    // Validar email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mostrarMensaje('📧 Por favor, ingresa un email válido.', 'error');
        return;
    }
    
    // Deshabilitar botón para evitar doble envío
    const submitBtn = document.getElementById('review-submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    // Preparar datos
    const data = {
        nombre: nombre,
        email: email,
        servicio: servicio || '',
        puntuacion: puntuacion,
        comentario: comentario
    };
    
    console.log('📤 Enviando reseña al backend:', data);
    console.log('🌐 URL:', RESENAS_BACKEND_URL + '/api/resenas');
    
    // Enviar al backend
    fetch(RESENAS_BACKEND_URL + '/api/resenas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log('📊 Respuesta del servidor:', response.status);
        if (!response.ok) throw new Error('Error al enviar la reseña');
        return response.json();
    })
    .then(data => {
        console.log('✅ Reseña enviada:', data);
        mostrarMensaje('✅ ¡Gracias por tu reseña! Será revisada y publicada pronto.', 'success');
        
        // Resetear formulario
        document.getElementById('reviewForm').reset();
        document.querySelectorAll('.star-rating input').forEach(input => input.checked = false);
        
        // Recargar reseñas después de 2 segundos
        setTimeout(cargarResenas, 2000);
    })
    .catch(error => {
        console.error('❌ Error:', error);
        mostrarMensaje('❌ Hubo un problema al enviar tu reseña. Por favor, intenta de nuevo. Error: ' + error.message, 'error');
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-star"></i> Enviar Reseña';
    });
}

// =============================================
// FUNCIÓN: cargarResenas
// =============================================
function cargarResenas() {
    const container = document.getElementById('reviewsContainer');
    if (!container) return;
    
    console.log('🔄 Cargando reseñas...');
    container.innerHTML = '<p style="text-align: center; color: #999;">Cargando reseñas...</p>';
    
    fetch(RESENAS_BACKEND_URL + '/api/resenas')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar reseñas');
            return response.json();
        })
        .then(resenas => {
            console.log('📋 Reseñas cargadas:', resenas.length);
            
            if (resenas.length === 0) {
                container.innerHTML = `
                    <p style="text-align: center; color: #999; padding: 2rem;">
                        🌟 Aún no hay reseñas. ¡Sé el primero en dejar tu opinión!
                    </p>
                `;
                return;
            }
            
            let html = '';
            resenas.forEach(resena => {
                const fecha = new Date(resena.fecha);
                const fechaFormateada = fecha.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                let estrellas = '';
                for (let i = 0; i < 5; i++) {
                    estrellas += i < resena.puntuacion ? '★' : '☆';
                }
                
                html += `
                    <div class="review-card">
                        <div class="review-header">
                            <span class="review-author">${escapeHTML(resena.nombre)}</span>
                            <span class="review-date">${fechaFormateada}</span>
                        </div>
                        <div class="review-stars">${estrellas}</div>
                        ${resena.servicio ? `<div class="review-service"><strong>Servicio:</strong> ${escapeHTML(resena.servicio)}</div>` : ''}
                        <div class="review-comment">${escapeHTML(resena.comentario)}</div>
                    </div>
                `;
            });
            
            container.innerHTML = html;
        })
        .catch(error => {
            console.error('❌ Error al cargar reseñas:', error);
            container.innerHTML = `
                <p style="text-align: center; color: #dc3545;">
                    ⚠️ No se pudieron cargar las reseñas. Por favor, intenta de nuevo más tarde.
                </p>
            `;
        });
}

// =============================================
// FUNCIÓN: mostrarMensaje
// =============================================
function mostrarMensaje(texto, tipo) {
    const container = document.getElementById('reviewResponseMessage');
    if (!container) return;
    
    container.className = tipo === 'success' ? 'review-success' : 'review-error';
    container.textContent = texto;
    container.style.display = 'block';
    
    clearTimeout(container._timeout);
    container._timeout = setTimeout(() => {
        container.style.display = 'none';
    }, 5000);
}

// =============================================
// FUNCIÓN: escapeHTML
// =============================================
function escapeHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// =============================================
// INICIALIZACIÓN
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('⭐ Sistema de reseñas inicializado');
    
    if (document.getElementById('reviewsContainer')) {
        cargarResenas();
    }
    
    const stars = document.querySelectorAll('.star-rating .star');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const input = document.getElementById(this.getAttribute('for'));
            if (input) input.checked = true;
        });
    });
});