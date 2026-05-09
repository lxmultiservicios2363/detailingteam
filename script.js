// =============================================
// DETAILING TEAM - SCRIPT PRINCIPAL
// =============================================
// VERSIÓN: 10.0 (IDIOMAS COMPLETOS + REGISTRO CON VEHÍCULOS)
// FECHA: 19/04/2026
// =============================================

// =============================================
// CONSTANTES GLOBALES
// =============================================
const MAX_ORDENES_DIARIAS = 30;
const HORARIO_INICIO = "07:00";
const HORARIO_FIN = "17:30";
const TELEFONO_PROPIETARIO = "17139280466";
const MAX_VEHICULOS = 3;
const BACKEND_URL = 'https://detailingteam-backend.onrender.com';

// =============================================
// VARIABLES GLOBALES
// =============================================
let clienteActualGlobal = null;
let vehiculosRegistrados = [];

// =============================================
// OBJETO PARA MAPEAR TIPOS DE VEHÍCULO A TEXTO
// =============================================
const tipoVehiculoTexto = {
    'sedan': '🚗 Sedán (4 puertas, 5 asientos)',
    'hatchback': '🚗 Hatchback (5 puertas, 5 asientos)',
    'coupe': '🏎️ Coupé (2 puertas, 4 asientos)',
    'convertible': '🏎️ Convertible / Descapotable (2 puertas, 2-4 asientos)',
    'suv': '🚙 SUV (5-7 asientos)',
    'pickup': '🛻 Pickup (2-5 asientos)',
    'van': '🚐 Van / Minivan (7-8 asientos)',
    'truck': '🚛 Camión / Truck (2-3 asientos)'
};

// =============================================
// TEXTOS EN INGLÉS (COMPLETOS)
// =============================================
const textosIndexEn = {
    'page-title': 'Detailing Team TX - Excellence in Shine',
    'nav-services': 'Services',
    'nav-gallery': 'Gallery',
    'nav-catalog': 'Catalog',
    'nav-register': 'Register',
    'nav-bookings': 'Bookings',
    'nav-contact': 'Contact',
    'header-logo': 'Detailing Team Logo',
    'services-title': '✨ Professional Services ✨',
    'services-description': '🌟 The shine your car deserves, the protection it needs. Competitive prices in Houston, TX. 🌟',
    'schedule-title': '🕒 Business Hours',
    'schedule-text': '<strong>Monday to Sunday:</strong> 7:00 AM - 5:30 PM',
    'service1-name': 'Express Detail',
    'service1-desc': 'Ideal for quick maintenance. Hand wash, wheel cleaning, interior vacuuming, dashboard, console, windows. Renew your car in minutes!',
    'service2-name': 'Silver Package',
    'service2-desc': 'Deeper cleaning. Includes Express + panels/doors, light carpet shampoo, tire shine, stain removal. Impeccable result.',
    'service3-name': 'Gold Package',
    'service3-desc': 'Includes Silver + deep carpet/upholstery shampoo, wax/sealant, plastic protection, high gloss finish. Feel the difference!',
    'service4-name': 'Diamond Package',
    'service4-desc': 'Premium Detail + 90 Day Ceramic Protection. Deep cleaning + ceramic sealant. UV protection, guaranteed showroom effect.',
    'service5-name': 'Ceramic 1 Year',
    'service5-desc': '12-month ceramic protection. Deep wash, chemical decontamination, clay bar, coating, hydrophobic effect. Your car like new longer.',
    'service6-name': 'Ceramic 3 Years (Mid Level)',
    'service6-desc': 'Mid-level ceramic protection, lasts 3 years. Maximum shine and resistance.',
    'service7-name': 'Ceramic 5 Years (Premium)',
    'service7-desc': 'Premium ceramic protection, lasts 5 years. Maximum protection for your vehicle. Investment in beauty and care.',
    'gallery-title': '📸 Results That Speak for Themselves 📸',
    'gallery-description': 'Before and after each service. Discover the magic of Detailing Team!',
    'filter-all': 'All',
    'filter-express': 'Express Detail',
    'filter-silver': 'Silver',
    'filter-gold': 'Gold',
    'filter-diamond': 'Diamond',
    'filter-ceramic1': 'Ceramic 1Y',
    'filter-ceramic3': 'Ceramic 3Y',
    'filter-ceramic5': 'Ceramic 5Y',
    'register-title': '📝 Customer Registration 📝',
    'register-description': 'Save your vehicle data for faster, personalized service. We look forward to seeing you!',
    'register-label-name': 'Full Name *',
    'register-label-email': 'Email *',
    'register-label-phone': 'Phone *',
    'register-label-address': 'Address *',
    'register-label-model': 'Make and Model *',
    'register-label-year': 'Year',
    'register-label-plate': 'License Plate (optional)',
    'register-btn': 'Register Me',
    'booking-title': '📅 Book Your Appointment 📅',
    'booking-description': 'Choose service, date and time. We will confirm via WhatsApp instantly.',
    'booking-label-service': 'Service *',
    'booking-service-default': 'Select a service',
    'booking-service-express': 'Express Detail - Sedan: $100-$120 / SUV: $140-$160',
    'booking-service-silver': 'Silver Package - Sedan: $150-$180 / SUV: $190-$220',
    'booking-service-gold': 'Gold Package - Sedan: $200-$240 / SUV: $240-$280',
    'booking-service-diamond': 'Diamond Package - Sedan: $280 / SUV: $320',
    'booking-service-ceramic1': 'Ceramic 1 Year - Sedan: $700 / SUV: $900',
    'booking-service-ceramic3': 'Ceramic 3 Years - Sedan: $950 / SUV: $1,300',
    'booking-service-ceramic5': 'Ceramic 5 Years - Sedan: $1,500 / SUV: $1,800',
    'booking-label-vehicle': 'Vehicle Type *',
    'booking-vehicle-default': 'Select vehicle type',
    'booking-vehicle-sedan': '🚗 Sedan (4 doors, 5 seats)',
    'booking-vehicle-hatchback': '🚗 Hatchback (5 doors, 5 seats)',
    'booking-vehicle-coupe': '🏎️ Coupe (2 doors, 4 seats)',
    'booking-vehicle-convertible': '🏎️ Convertible (2 doors, 2-4 seats)',
    'booking-vehicle-suv': '🚙 SUV (5-7 seats) +$40',
    'booking-vehicle-pickup': '🛻 Pickup (2-5 seats) +$40',
    'booking-vehicle-van': '🚐 Van / Minivan (7-8 seats) +$60',
    'booking-vehicle-truck': '🚛 Truck (2-3 seats) +$80',
    'booking-label-date': 'Date *',
    'booking-label-time': 'Time *',
    'booking-time-note': 'Schedule: 7:00 AM - 5:30 PM',
    'booking-label-notes': 'Additional Notes',
    'booking-textarea-notes': 'Any special instructions...',
    'booking-label-price': 'Final price:',
    'booking-btn': 'Continue to payment',
    'payment-step2-title': 'Choose payment method',
    'payment-paypal-title': 'Pay with PayPal',
    'payment-paypal-desc': 'Secure online payment. You will be redirected to PayPal.',
    'payment-cash-title': 'Pay in cash',
    'payment-cash-desc': 'You pay directly at the workshop. We will confirm your reservation.',
    'payment-back-btn': 'Back',
    'contact-title': '📱 Contact Us - Mobile Service 📱',
    'contact-mobile-service': 'Home service in Houston, TX',
    'contact-location-text': 'We come to your home or location',
    'contact-phone-title': 'Call us',
    'contact-sms-title': 'Send us an SMS',
    'contact-email-title': 'Email us',
    'contact-wa-title': 'WhatsApp',
    'contact-wa-detail': 'Chat with us',
    'social-title': 'Follow us on social media',
    'payment-title': '💳 Accepted payment methods 💳',
    'footer-about-title': 'Detailing Team',
    'footer-about-text': 'Excellence in automotive shine and protection in Houston, Texas. Home service!',
    'footer-about-country': 'Professional and guaranteed service.',
    'footer-quick-title': 'Quick links',
    'footer-quick-services': 'Services',
    'footer-quick-gallery': 'Gallery',
    'footer-quick-products': 'Products',
    'footer-quick-register': 'Register',
    'footer-quick-bookings': 'Bookings',
    'footer-legal-title': 'Legal',
    'footer-legal-privacy': 'Privacy Policy',
    'footer-legal-terms': 'Terms of Service',
    'footer-legal-cookies': 'Cookie Settings',
    'footer-domain-title': 'Next domain',
    'footer-domain': 'www.detailingteamtx.com',
    'footer-secure': 'Secure with HTTPS',
    'developer-title': 'Want a website for your business?',
    'qr-message': 'Scan me! 📱',
    'copyright-text': '© 2025 Detailing Team. All rights reserved.',
    'copyright-security': 'By using this site, you accept our privacy and security practices.'
};

// =============================================
// TEXTOS EN ESPAÑOL (COMPLETOS)
// =============================================
const textosIndexEs = {
    'page-title': 'Detailing Team TX - Excelencia en Brillo',
    'nav-services': 'Servicios',
    'nav-gallery': 'Galería',
    'nav-catalog': 'Catálogo',
    'nav-register': 'Registro',
    'nav-bookings': 'Reservas',
    'nav-contact': 'Contacto',
    'header-logo': 'Detailing Team Logo',
    'services-title': '✨ Servicios Profesionales ✨',
    'services-description': '🌟 El brillo que tu auto merece, la protección que necesita. Precios competitivos en Houston, TX. 🌟',
    'schedule-title': '🕒 Horario de atención',
    'schedule-text': '<strong>Lunes a Domingo:</strong> 7:00 AM - 5:30 PM',
    'service1-name': 'Express Detail',
    'service1-desc': 'Ideal para mantenimiento rápido. Lavado a mano, limpieza de rines, aspirado interior, tablero, consola, cristales. ¡Renueva tu auto en minutos!',
    'service2-name': 'Silver Package',
    'service2-desc': 'Limpieza más profunda. Incluye Express + paneles/puertas, shampoo ligero de alfombras, brillo llantas, eliminación manchas. Resultado impecable.',
    'service3-name': 'Gold Package',
    'service3-desc': 'Incluye Silver + shampoo profundo alfombras/tapicería, cera/sellador, protección plásticos, acabado alto brillo. ¡Siente la diferencia!',
    'service4-name': 'Diamond Package',
    'service4-desc': 'Premium Detail + 90 Day Ceramic Protection. Limpieza profunda + sellador cerámico. Protección UV, efecto showroom garantizado.',
    'service5-name': 'Ceramic 1 Year',
    'service5-desc': 'Protección cerámica 12 meses. Lavado profundo, descontaminación química, clay bar, coating, efecto hidrofóbico. Tu auto como nuevo por más tiempo.',
    'service6-name': 'Ceramic 3 Years (Mid Level)',
    'service6-desc': 'Protección cerámica nivel medio, duración 3 años. Máximo brillo y resistencia.',
    'service7-name': 'Ceramic 5 Years (Premium)',
    'service7-desc': 'Protección cerámica premium, duración 5 años. La máxima protección para tu vehículo. Inversión en belleza y cuidado.',
    'gallery-title': '📸 Resultados que Hablan Solos 📸',
    'gallery-description': 'Antes y después de cada servicio. ¡Descubre la magia de Detailing Team!',
    'filter-all': 'Todos',
    'filter-express': 'Express Detail',
    'filter-silver': 'Silver',
    'filter-gold': 'Gold',
    'filter-diamond': 'Diamond',
    'filter-ceramic1': 'Ceramic 1Y',
    'filter-ceramic3': 'Ceramic 3Y',
    'filter-ceramic5': 'Ceramic 5Y',
    'register-title': '📝 Registro de Clientes 📝',
    'register-description': 'Guarda los datos de tu vehículo para un servicio más rápido y personalizado. ¡Te esperamos!',
    'register-label-name': 'Nombre y Apellidos *',
    'register-label-email': 'Email *',
    'register-label-phone': 'Teléfono *',
    'register-label-address': 'Dirección *',
    'register-label-model': 'Marca y Modelo *',
    'register-label-year': 'Año',
    'register-label-plate': 'Placa (opcional)',
    'register-btn': 'Registrarme',
    'booking-title': '📅 Reserva tu Turno 📅',
    'booking-description': 'Elige servicio, fecha y hora. Te confirmaremos por WhatsApp al instante.',
    'booking-label-service': 'Servicio *',
    'booking-service-default': 'Selecciona un servicio',
    'booking-service-express': 'Express Detail - Sedán: $100-$120 / SUV: $140-$160',
    'booking-service-silver': 'Silver Package - Sedán: $150-$180 / SUV: $190-$220',
    'booking-service-gold': 'Gold Package - Sedán: $200-$240 / SUV: $240-$280',
    'booking-service-diamond': 'Diamond Package - Sedán: $280 / SUV: $320',
    'booking-service-ceramic1': 'Ceramic 1 Year - Sedán: $700 / SUV: $900',
    'booking-service-ceramic3': 'Ceramic 3 Years - Sedán: $950 / SUV: $1,300',
    'booking-service-ceramic5': 'Ceramic 5 Years - Sedán: $1,500 / SUV: $1,800',
    'booking-label-vehicle': 'Tipo de vehículo *',
    'booking-vehicle-default': 'Selecciona tipo de vehículo',
    'booking-vehicle-sedan': '🚗 Sedán (4 puertas, 5 asientos)',
    'booking-vehicle-hatchback': '🚗 Hatchback (5 puertas, 5 asientos)',
    'booking-vehicle-coupe': '🏎️ Coupé (2 puertas, 4 asientos)',
    'booking-vehicle-convertible': '🏎️ Convertible / Descapotable (2 puertas, 2-4 asientos)',
    'booking-vehicle-suv': '🚙 SUV (5-7 asientos) +$40',
    'booking-vehicle-pickup': '🛻 Pickup (2-5 asientos) +$40',
    'booking-vehicle-van': '🚐 Van / Minivan (7-8 asientos) +$60',
    'booking-vehicle-truck': '🚛 Camión / Truck (2-3 asientos) +$80',
    'booking-label-date': 'Fecha *',
    'booking-label-time': 'Hora *',
    'booking-time-note': 'Horario: 7:00 AM - 5:30 PM',
    'booking-label-notes': 'Notas adicionales',
    'booking-textarea-notes': 'Alguna indicación especial...',
    'booking-label-price': 'Precio final:',
    'booking-btn': 'Continuar al pago',
    'payment-step2-title': 'Elige método de pago',
    'payment-paypal-title': 'Pagar con PayPal',
    'payment-paypal-desc': 'Pago seguro online. Serás redirigido a PayPal.',
    'payment-cash-title': 'Pagar en efectivo',
    'payment-cash-desc': 'Pagas directamente en el taller. Confirmaremos tu reserva.',
    'payment-back-btn': 'Volver',
    'contact-title': '📱 Contáctanos - Servicio Móvil 📱',
    'contact-mobile-service': 'Servicio a domicilio en Houston, TX',
    'contact-location-text': 'Nos desplazamos a tu domicilio o ubicación',
    'contact-phone-title': 'Llámanos',
    'contact-sms-title': 'Envíanos un SMS',
    'contact-email-title': 'Escríbenos un Email',
    'contact-wa-title': 'WhatsApp',
    'contact-wa-detail': 'Chatea con nosotros',
    'social-title': 'Síguenos en redes',
    'payment-title': '💳 Métodos de pago aceptados 💳',
    'footer-about-title': 'Detailing Team',
    'footer-about-text': 'Excelencia en brillo y protección automotriz en Houston, Texas. ¡Servicio a domicilio!',
    'footer-about-country': 'Servicio profesional y garantizado.',
    'footer-quick-title': 'Enlaces rápidos',
    'footer-quick-services': 'Servicios',
    'footer-quick-gallery': 'Galería',
    'footer-quick-products': 'Productos',
    'footer-quick-register': 'Registro',
    'footer-quick-bookings': 'Reservas',
    'footer-legal-title': 'Legal',
    'footer-legal-privacy': 'Políticas de Privacidad',
    'footer-legal-terms': 'Términos de Servicio',
    'footer-legal-cookies': 'Configuración de Cookies',
    'footer-domain-title': 'Próximo dominio',
    'footer-domain': 'www.detailingteamtx.com',
    'footer-secure': 'Seguro con HTTPS',
    'developer-title': '¿Quieres una página web para tu negocio?',
    'qr-message': '¡Escáneame! 📱',
    'copyright-text': '© 2025 Detailing Team. Todos los derechos reservados.',
    'copyright-security': 'Al usar este sitio, aceptas nuestras prácticas de privacidad y seguridad.'
};

// =============================================
// FUNCIÓN: actualizarIdioma
// =============================================
function actualizarIdioma() {
    const idioma = localStorage.getItem('idioma') || 'es';
    const textos = idioma === 'en' ? textosIndexEn : textosIndexEs;
    
    for (let id in textos) {
        const elemento = document.getElementById(id);
        if (elemento) {
            if (id === 'schedule-text' || id.includes('desc') || id.includes('description')) {
                elemento.innerHTML = textos[id];
            } else if (id.includes('placeholder')) {
                elemento.placeholder = textos[id];
            } else if (elemento.tagName === 'INPUT' || elemento.tagName === 'TEXTAREA') {
                elemento.placeholder = textos[id];
            } else if (elemento.tagName === 'IMG') {
                elemento.alt = textos[id];
            } else {
                elemento.innerText = textos[id];
            }
        }
    }
    
    document.title = textos['page-title'];
    
    const btnEnglish = document.getElementById('btnEnglish');
    const btnSpanish = document.getElementById('btnSpanish');
    if (btnEnglish) btnEnglish.classList.toggle('active', idioma === 'en');
    if (btnSpanish) btnSpanish.classList.toggle('active', idioma === 'es');
    
    document.documentElement.lang = idioma === 'en' ? 'en' : 'es';
}

function cambiarIdioma(idioma) {
    localStorage.setItem('idioma', idioma);
    actualizarIdioma();
}

function detectarIdiomaNavegador() {
    const lang = navigator.language || navigator.userLanguage;
    return lang.startsWith('es') ? 'es' : 'en';
}

// =============================================
// FUNCIONES DE TEMA (CLARO/OSCURO)
// =============================================
function toggleTema() {
    const checkbox = document.getElementById('themeToggle');
    if (checkbox && checkbox.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('tema', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('tema', 'light');
    }
}

function inicializarTema() {
    const temaGuardado = localStorage.getItem('tema');
    const checkbox = document.getElementById('themeToggle');
    if (temaGuardado === 'dark') {
        document.body.classList.add('dark-mode');
        if (checkbox) checkbox.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        if (checkbox) checkbox.checked = false;
        if (!temaGuardado) localStorage.setItem('tema', 'light');
    }
}

// =============================================
// FUNCIÓN: verificarClienteExistente
// =============================================
function verificarClienteExistente() {
    const emailGuardado = localStorage.getItem('clienteEmail');
    if (emailGuardado) {
        const clienteGuardado = localStorage.getItem('clienteActual');
        if (clienteGuardado) {
            try {
                clienteActualGlobal = JSON.parse(clienteGuardado);
                vehiculosRegistrados = clienteActualGlobal.vehiculos || [];
                return true;
            } catch(e) {
                console.error('Error al parsear cliente:', e);
                return false;
            }
        }
    }
    return false;
}

// =============================================
// FUNCIÓN: mostrarFormularioRegistroCompleto
// =============================================
function mostrarFormularioRegistroCompleto() {
    const idioma = localStorage.getItem('idioma') || 'es';
    const formContainer = document.querySelector('#registro .form-container');
    if (!formContainer) return;
    
    let vehiculosHtml = '';
    for (let i = 1; i <= MAX_VEHICULOS; i++) {
        vehiculosHtml += `
            <div class="vehiculo-group" style="border: 1px solid var(--border-color, #ddd); border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem;">
                <h4 style="color: var(--accent-gold);"><i class="fas fa-car"></i> ${idioma === 'es' ? 'Vehículo ' + i : 'Vehicle ' + i}</h4>
                <div class="form-group">
                    <label>${idioma === 'es' ? 'Marca y Modelo' : 'Make and Model'} ${i} *</label>
                    <input type="text" class="form-control" id="vehiculo-marca-${i}" placeholder="${idioma === 'es' ? 'Ej: Honda Civic' : 'Ex: Honda Civic'}" required>
                </div>
                <div class="form-group">
                    <label>${idioma === 'es' ? 'Año' : 'Year'} ${i}</label>
                    <input type="number" class="form-control" id="vehiculo-anio-${i}" placeholder="${idioma === 'es' ? 'Ej: 2020' : 'Ex: 2020'}">
                </div>
                <div class="form-group">
                    <label>${idioma === 'es' ? 'Matrícula/Placa' : 'License Plate'} ${i} *</label>
                    <input type="text" class="form-control" id="vehiculo-placa-${i}" placeholder="${idioma === 'es' ? 'Ej: ABC-1234' : 'Ex: ABC-1234'}" required>
                </div>
            </div>
        `;
    }
    
    formContainer.innerHTML = `
        <form id="registerFormCompleto" onsubmit="guardarRegistroCompleto(event)">
            <div class="form-group">
                <label>${idioma === 'es' ? 'Nombre y Apellidos' : 'Full Name'} *</label>
                <input type="text" class="form-control" id="register-nombre" required>
            </div>
            <div class="form-group">
                <label>Email *</label>
                <input type="email" class="form-control" id="register-email" required>
            </div>
            <div class="form-group">
                <label>${idioma === 'es' ? 'Teléfono' : 'Phone'} *</label>
                <input type="tel" class="form-control" id="register-telefono" required>
            </div>
            <div class="form-group">
                <label>${idioma === 'es' ? 'Dirección' : 'Address'} *</label>
                <input type="text" class="form-control" id="register-direccion" required>
            </div>
            <h3>${idioma === 'es' ? 'Datos de tus vehículos (máximo ' + MAX_VEHICULOS + ')' : 'Your vehicle data (max ' + MAX_VEHICULOS + ')'}</h3>
            ${vehiculosHtml}
            <button type="submit" class="btn btn-block">${idioma === 'es' ? 'Registrarme' : 'Register'}</button>
        </form>
    `;
}

// =============================================
// FUNCIÓN: guardarRegistroCompleto
// =============================================
function guardarRegistroCompleto(event) {
    event.preventDefault();
    const idioma = localStorage.getItem('idioma') || 'es';
    
    const nombre = document.getElementById('register-nombre').value;
    const email = document.getElementById('register-email').value;
    const telefono = document.getElementById('register-telefono').value;
    const direccion = document.getElementById('register-direccion').value;
    
    const vehiculos = [];
    for (let i = 1; i <= MAX_VEHICULOS; i++) {
        const marca = document.getElementById('vehiculo-marca-' + i) ? document.getElementById('vehiculo-marca-' + i).value : '';
        const anio = document.getElementById('vehiculo-anio-' + i) ? document.getElementById('vehiculo-anio-' + i).value : '';
        const placa = document.getElementById('vehiculo-placa-' + i) ? document.getElementById('vehiculo-placa-' + i).value : '';
        if (marca && placa) {
            vehiculos.push({ marca: marca, modelo: marca, anio: anio, placa: placa });
        }
    }
    
    if (vehiculos.length === 0) {
        alert(idioma === 'es' ? 'Debes registrar al menos un vehículo' : 'You must register at least one vehicle');
        return;
    }
    
    const clienteData = { nombre: nombre, email: email, telefono: telefono, direccion: direccion, vehiculos: vehiculos };
    
    fetch(BACKEND_URL + '/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteData)
    })
    .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
    })
    .then(function(data) {
        localStorage.setItem('clienteActual', JSON.stringify(clienteData));
        localStorage.setItem('clienteEmail', email);
        alert(idioma === 'es' 
            ? '✅ Registro exitoso. Has registrado ' + vehiculos.length + ' vehículo(s).'
            : '✅ Registration successful. You have registered ' + vehiculos.length + ' vehicle(s).');
        location.reload();
    })
    .catch(function(err) {
        console.error('Error:', err);
        alert(idioma === 'es' ? 'Error al registrar: ' + err.message : 'Registration error: ' + err.message);
    });
}

// =============================================
// FUNCIÓN: mostrarSelectorVehiculosEnReserva
// =============================================
function mostrarSelectorVehiculosEnReserva() {
    const precioContainer = document.getElementById('precioCalculadoContainer');
    if (!precioContainer) return;
    
    if (vehiculosRegistrados.length > 0 && !document.getElementById('vehiculo-selector')) {
        const idioma = localStorage.getItem('idioma') || 'es';
        let selectorHtml = `
            <div class="form-group">
                <label>${idioma === 'es' ? 'Selecciona el vehículo para este servicio' : 'Select the vehicle for this service'} *</label>
                <select id="vehiculo-selector" class="form-control" required>
                    <option value="">${idioma === 'es' ? 'Selecciona un vehículo' : 'Select a vehicle'}</option>
        `;
        for (let i = 0; i < vehiculosRegistrados.length; i++) {
            const v = vehiculosRegistrados[i];
            selectorHtml += '<option value="' + v.placa + '">' + v.marca + ' - ' + v.placa + (v.anio ? ' (' + v.anio + ')' : '') + '</option>';
        }
        selectorHtml += '</select></div>';
        precioContainer.insertAdjacentHTML('beforebegin', selectorHtml);
    }
}

// =============================================
// FUNCIÓN: ocultarPreciosServicios
// =============================================
function ocultarPreciosServicios() {
    const precios = document.querySelectorAll('.service-price');
    for (let i = 0; i < precios.length; i++) {
        precios[i].style.display = 'none';
    }
}

// =============================================
// FUNCIÓN: guardarRegistro (original - por compatibilidad)
// =============================================
function guardarRegistro(event) {
    event.preventDefault();
    const idioma = localStorage.getItem('idioma') || 'es';
    alert(idioma === 'es' 
        ? 'Usa el formulario de registro completo en la sección "Registro"'
        : 'Use the complete registration form in the "Register" section');
}

// =============================================
// FUNCIÓN: procesarReserva (MODIFICADA con vehículo)
// =============================================
function procesarReserva(event) {
    event.preventDefault();
    const idioma = localStorage.getItem('idioma') || 'es';
    
    if (!verificarClienteExistente()) {
        alert(idioma === 'es' 
            ? '⚠️ Debes registrarte antes de hacer una reserva.'
            : '⚠️ You must register before making a booking.');
        window.location.href = '#registro';
        return false;
    }
    
    const vehiculoSelector = document.getElementById('vehiculo-selector');
    if (!vehiculoSelector || !vehiculoSelector.value) {
        alert(idioma === 'es'
            ? '⚠️ Por favor selecciona un vehículo registrado.'
            : '⚠️ Please select a registered vehicle.');
        return false;
    }
    
    const matriculaSeleccionada = vehiculoSelector.value;
    let vehiculoSeleccionado = null;
    for (let i = 0; i < vehiculosRegistrados.length; i++) {
        if (vehiculosRegistrados[i].placa === matriculaSeleccionada) {
            vehiculoSeleccionado = vehiculosRegistrados[i];
            break;
        }
    }
    
    const hora = document.getElementById('booking-input-time')?.value;
    if (!hora || hora < HORARIO_INICIO || hora > HORARIO_FIN) {
        alert(idioma === 'es' 
            ? '❌ Horario no válido. Atendemos de 7:00 AM a 5:30 PM.'
            : '❌ Invalid time. We are open from 7:00 AM to 5:30 PM.');
        return false;
    }
    
    const fecha = document.getElementById('booking-input-date')?.value;
    if (!fecha) return false;
    
    if (obtenerReservasPorFecha(fecha).length >= MAX_ORDENES_DIARIAS) {
        alert(idioma === 'es' 
            ? '❌ No hay cupos disponibles para esta fecha.'
            : '❌ No slots available for this date.');
        return false;
    }
    
    const servicioSelect = document.getElementById('booking-select-service');
    const tipoVehiculo = document.getElementById('booking-select-vehicle')?.value;
    const notas = document.getElementById('booking-textarea-notes')?.value || '';
    const servicioOption = servicioSelect.options[servicioSelect.selectedIndex];
    const precioFinal = calcularPrecioFinal(servicioOption, tipoVehiculo);
    
    const reserva = {
        servicio: servicioOption.value,
        tipoVehiculo: tipoVehiculo,
        fecha: fecha,
        hora: hora,
        notas: notas,
        precio: precioFinal,
        clienteEmail: clienteActualGlobal.email,
        matricula: matriculaSeleccionada,
        vehiculoInfo: vehiculoSeleccionado,
        metodoPago: 'Efectivo'
    };
    
    fetch(BACKEND_URL + '/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reserva)
    })
    .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
    })
    .then(function(data) {
        let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        reservas.push(reserva);
        localStorage.setItem('reservas', JSON.stringify(reservas));
        
        const ticket = generarTicket(reserva, clienteActualGlobal);
        enviarWhatsApp(ticket);
        
        return fetch(BACKEND_URL + '/api/enviar-reserva', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cliente: clienteActualGlobal, reserva: reserva, tipo: 'cliente', idioma: idioma })
        });
    })
    .then(function(res) { return res.json(); })
    .then(function() {
        return fetch(BACKEND_URL + '/api/enviar-reserva', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cliente: clienteActualGlobal, reserva: reserva, tipo: 'propietario', idioma: idioma })
        });
    })
    .then(function(res) { return res.json(); })
    .then(function() {
        alert(idioma === 'es' 
            ? '✅ Reserva confirmada. Se han enviado los emails de confirmación.'
            : '✅ Booking confirmed. Confirmation emails have been sent.');
    })
    .catch(function(err) {
        console.error('Error:', err);
        alert(idioma === 'es'
            ? '⚠️ Reserva guardada localmente, pero hubo un problema con el servidor.'
            : '⚠️ Booking saved locally, but there was a server problem.');
    });
    
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) bookingForm.reset();
    actualizarDisponibilidad();
    return false;
}

function obtenerReservasPorFecha(fecha) {
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    const resultado = [];
    for (let i = 0; i < reservas.length; i++) {
        if (reservas[i].fecha === fecha) resultado.push(reservas[i]);
    }
    return resultado;
}

function actualizarDisponibilidad() {
    const fechaInput = document.getElementById('booking-input-date');
    if (!fechaInput || !fechaInput.value) return;
    
    const fecha = fechaInput.value;
    const reservasDia = obtenerReservasPorFecha(fecha);
    const disponibles = MAX_ORDENES_DIARIAS - reservasDia.length;
    const msgDiv = document.getElementById('availabilityMessage');
    if (!msgDiv) return;
    
    const idioma = localStorage.getItem('idioma') || 'es';
    
    if (disponibles <= 0) {
        msgDiv.innerHTML = idioma === 'es' 
            ? '❌ No hay cupos disponibles para esta fecha.'
            : '❌ No slots available for this date.';
        msgDiv.className = 'availability-message error';
    } else {
        msgDiv.innerHTML = idioma === 'es'
            ? '✅ Cupos disponibles: ' + disponibles + ' de ' + MAX_ORDENES_DIARIAS
            : '✅ Available slots: ' + disponibles + ' out of ' + MAX_ORDENES_DIARIAS;
        msgDiv.className = 'availability-message success';
    }
}

function validarHora(hora) {
    return hora >= HORARIO_INICIO && hora <= HORARIO_FIN;
}

function calcularPrecioFinal(servicioOption, tipoVehiculo) {
    const precioBase = servicioOption.getAttribute('data-price-sedan');
    let precio = parseInt(precioBase.split('-')[0]);
    if (tipoVehiculo === 'suv' || tipoVehiculo === 'pickup') precio += 40;
    else if (tipoVehiculo === 'van') precio += 60;
    else if (tipoVehiculo === 'truck') precio += 80;
    if (precioBase.indexOf('-') !== -1) {
        const precioMaxOriginal = parseInt(precioBase.split('-')[1]);
        const precioMax = precioMaxOriginal + (precio - parseInt(precioBase.split('-')[0]));
        return precio + '-' + precioMax;
    }
    return precio.toString();
}

function enviarWhatsApp(mensaje) {
    const mensajeCodificado = encodeURIComponent(mensaje);
    const url = 'https://api.whatsapp.com/send?phone=' + TELEFONO_PROPIETARIO + '&text=' + mensajeCodificado;
    window.open(url, '_blank');
}

function generarTicket(reserva, cliente) {
    const idioma = localStorage.getItem('idioma') || 'es';
    const linea = '══════════════════════════════';
    const sep = '──────────────────────────';
    const tipo = tipoVehiculoTexto[reserva.tipoVehiculo] || reserva.tipoVehiculo;
    let precio = reserva.precio;
    if (precio && precio.indexOf('$') === -1) precio = '$' + precio;
    const matricula = reserva.matricula || 'No especificada';
    const vehiculoMarca = (reserva.vehiculoInfo && reserva.vehiculoInfo.marca) || 'No especificado';
    const vehiculoAnio = (reserva.vehiculoInfo && reserva.vehiculoInfo.anio) || 'N/E';
    
    if (idioma === 'es') {
        return '🔔 NUEVA RESERVA 🔔\n' + linea + '\n👤 CLIENTE\n' + sep + '\n📌 ' + cliente.nombre + '\n📧 ' + cliente.email + '\n📞 ' + cliente.telefono + '\n🏠 ' + cliente.direccion + '\n' + sep + '\n🚗 VEHÍCULO\n' + sep + '\n🔢 Tipo: ' + tipo + '\n🚙 Marca/Modelo: ' + vehiculoMarca + '\n🔖 Placa: ' + matricula + '\n📅 Año: ' + vehiculoAnio + '\n' + sep + '\n📋 SERVICIO\n' + sep + '\n🛠️ ' + reserva.servicio + '\n💰 ' + precio + '\n📅 Fecha: ' + reserva.fecha + '\n⏰ Hora: ' + reserva.hora + '\n📝 Notas: ' + (reserva.notas || 'Ninguna') + '\n' + sep + '\n💰 TOTAL: ' + precio + '\n' + linea + '\n📍 Servicio a domicilio\n📞 +1 (713) 928-0466';
    } else {
        return '🔔 NEW BOOKING 🔔\n' + linea + '\n👤 CUSTOMER\n' + sep + '\n📌 ' + cliente.nombre + '\n📧 ' + cliente.email + '\n📞 ' + cliente.telefono + '\n🏠 ' + cliente.direccion + '\n' + sep + '\n🚗 VEHICLE\n' + sep + '\n🔢 Type: ' + tipo + '\n🚙 Make/Model: ' + vehiculoMarca + '\n🔖 Plate: ' + matricula + '\n📅 Year: ' + vehiculoAnio + '\n' + sep + '\n📋 SERVICE\n' + sep + '\n🛠️ ' + reserva.servicio + '\n💰 ' + precio + '\n📅 Date: ' + reserva.fecha + '\n⏰ Time: ' + reserva.hora + '\n📝 Notes: ' + (reserva.notas || 'None') + '\n' + sep + '\n💰 TOTAL: ' + precio + '\n' + linea + '\n📍 Mobile service\n📞 +1 (713) 928-0466';
    }
}

function volverAlFormulario() {
    const step2 = document.getElementById('bookingStep2');
    const step1 = document.getElementById('bookingStep1');
    if (step2) step2.classList.add('hidden');
    if (step1) step1.classList.remove('hidden');
}

function procesarPagoPayPal() { 
    const idioma = localStorage.getItem('idioma') || 'es';
    alert(idioma === 'es' ? 'Redirigiendo a PayPal...' : 'Redirecting to PayPal...'); 
}

function procesarPagoEfectivo() { 
    const idioma = localStorage.getItem('idioma') || 'es';
    alert(idioma === 'es' ? 'Reserva confirmada para pago en efectivo.' : 'Booking confirmed for cash payment.'); 
}

function mostrarQRExterno() {
    const qrContainer = document.getElementById('qrCode');
    if (!qrContainer) return;
    qrContainer.innerHTML = '';
    const img = document.createElement('img');
    img.src = 'assets/images/qr-whatsapp.png';
    img.alt = 'Código QR - Contacto WhatsApp Business';
    img.style.width = '160px';
    img.style.cursor = 'pointer';
    img.onclick = function() {
        window.open('https://wa.me/593987384110?text=Hola%20Luis%2C%20vi%20tu%20trabajo%20en%20Detailing%20Team%20y%20me%20interesa%20una%20p%C3%A1gina%20web%20para%20mi%20negocio', '_blank');
    };
    img.onerror = function() {
        console.error('❌ No se pudo cargar la imagen QR');
        qrContainer.innerHTML = '<p style="color: red;">⚠️ QR no disponible</p>';
    };
    qrContainer.appendChild(img);
}

// =============================================
// INICIALIZACIÓN
// =============================================
window.onload = function() {
    console.log('🚀 Página cargada');
    
    inicializarTema();
    
    const idiomaGuardado = localStorage.getItem('idioma');
    actualizarIdioma();
    if (idiomaGuardado === 'en') cambiarIdioma('en');
    else if (idiomaGuardado === 'es') cambiarIdioma('es');
    else cambiarIdioma(detectarIdiomaNavegador());
    
    ocultarPreciosServicios();
    
    if (!verificarClienteExistente()) {
        mostrarFormularioRegistroCompleto();
    } else {
        mostrarSelectorVehiculosEnReserva();
        const registerForm = document.getElementById('registerForm');
        if (registerForm) registerForm.style.display = 'none';
    }
    
    const horaInput = document.getElementById('booking-input-time');
    if (horaInput) {
        horaInput.min = HORARIO_INICIO;
        horaInput.max = HORARIO_FIN;
        horaInput.step = "1800";
    }
    
    const fechaInput = document.getElementById('booking-input-date');
    if (fechaInput) fechaInput.addEventListener('change', actualizarDisponibilidad);
    
    mostrarQRExterno();
    
    window.addEventListener('storage', function(e) {
        if (e.key === 'idioma') actualizarIdioma();
    });
    
    console.log('✅ Configuración completada');
};