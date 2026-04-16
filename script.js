// =============================================
// DETAILING TEAM - SCRIPT PRINCIPAL
// =============================================
// Este archivo contiene toda la lógica del frontend:
// - Sistema de idiomas (español/inglés)
// - Modo oscuro/claro
// - Gestión de reservas
// - Registro de clientes (manual)
// - Comunicación con el backend (MongoDB)
// - Envío de WhatsApp con ticket detallado
// - Envío de emails al cliente y propietario
// - Validaciones
//
// 📌 VERSIÓN: 6.2 (CORREGIDA - TRADUCCIÓN COMPLETA)
// 📌 FECHA: 17/03/2026
// =============================================

// =============================================
// CONSTANTES GLOBALES
// =============================================
const MAX_ORDENES_DIARIAS = 30;           // Límite de reservas por día
const HORARIO_INICIO = "07:00";            // Hora de apertura
const HORARIO_FIN = "17:30";               // Hora de cierre
const TELEFONO_PROPIETARIO = "17139280466"; // WhatsApp del propietario (sin +)
const BACKEND_URL = 'http://localhost:3001'; // URL del backend (cambiar en producción)

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
// SISTEMA DE IDIOMAS - TEXTOS EN INGLÉS
// =============================================
const textosEn = {
    // Título página
    'page-title': 'Detailing Team TX',
    
    // Header
    'header-title': 'Detailing Team',
    'header-slogan': 'Excellence in Shine - Automotive Protection',
    
    // Navegación
    'nav-services': 'Services',
    'nav-gallery': 'Gallery',
    'nav-catalog': 'Catalog',
    'nav-register': 'Register',
    'nav-bookings': 'Bookings',
    'nav-contact': 'Contact',

    // Servicios
    'services-title': '✨ Professional Services ✨',
    'services-description': '🌟 The shine your car deserves, the protection it needs. Competitive prices in Houston, TX. 🌟',
    'schedule-title': '🕒 Business Hours',
    'schedule-text': '<strong>Monday to Sunday:</strong> 7:00 AM - 5:30 PM',

    'service1-name': 'Express Detail',
    'service1-desc': 'Ideal for quick maintenance. Hand wash, wheel cleaning, interior vacuuming, dashboard, console, windows. Renew your car in minutes!',
    'service1-btn': 'Book Now',
    'service1-price': '$100 – $120',

    'service2-name': 'Silver Package',
    'service2-desc': 'Deeper cleaning. Includes Express + panels/doors, light carpet shampoo, tire shine, stain removal. Impeccable result.',
    'service2-btn': 'Book Now',
    'service2-price': '$150 – $180',

    'service3-name': 'Gold Package',
    'service3-desc': 'Includes Silver + deep carpet/upholstery shampoo, wax/sealant, plastic protection, high gloss finish. Feel the difference!',
    'service3-btn': 'Book Now',
    'service3-price': '$200 – $240',

    'service4-name': 'Diamond Package',
    'service4-desc': 'Premium Detail + 90 Day Ceramic Protection. Deep cleaning + ceramic sealant. UV protection, guaranteed showroom effect.',
    'service4-btn': 'Book Now',
    'service4-price': '$280',

    'service5-name': 'Ceramic 1 Year',
    'service5-desc': '12-month ceramic protection. Deep wash, chemical decontamination, clay bar, coating, hydrophobic effect. Your car like new longer.',
    'service5-btn': 'Book Now',
    'service5-price': '$700',

    'service6-name': 'Ceramic 3 Years (Mid Level)',
    'service6-desc': 'Mid-level ceramic protection, lasts 3 years. Maximum shine and resistance.',
    'service6-btn': 'Book Now',
    'service6-price': '$950',

    'service7-name': 'Ceramic 5 Years (Premium)',
    'service7-desc': 'Premium ceramic protection, lasts 5 years. Maximum protection for your vehicle. Investment in beauty and care.',
    'service7-btn': 'Book Now',
    'service7-price': '$1,500',

    // Galería
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

    // Productos
    'products-title': '🛒 Professional Products 🛒',
    'products-description': 'The best oils, coolants and fluids for your vehicle. Quality guaranteed!',
    'product1-name': '5W-30 Oil',
    'product1-desc': 'Gallon (3.78L) - Mobil 1. Superior protection for your engine.',
    'product1-btn': 'Add',
    'product2-name': 'Coolant',
    'product2-desc': '50/50 Concentrate - Gallon. Keep your engine at ideal temperature.',
    'product2-btn': 'Add',
    'product3-name': 'Brake Fluid DOT 4',
    'product3-desc': '12 oz - Prestone. Safety and confidence in every brake.',
    'product3-btn': 'Add',
    'product4-name': 'Windshield Washer',
    'product4-desc': 'Gallon - Ready to use. Impeccable visibility.',
    'product4-btn': 'Add',

    // Registro - Formulario
    'register-title': '📝 Customer Registration 📝',
    'register-description': 'Save your vehicle data for faster, personalized service. We look forward to seeing you!',
    'register-label-name': 'Full Name *',
    'register-input-name': 'Full name',
    'register-label-email': 'Email *',
    'register-input-email': 'customer@example.com',
    'register-label-phone': 'Phone *',
    'register-input-phone': '+1 123 456 7890',
    'register-label-address': 'Address *',
    'register-input-address': 'Street, number, city, zip code',
    'register-label-model': 'Make and Model *',
    'register-input-model': 'Ex: Honda Civic',
    'register-label-year': 'Year',
    'register-input-year': '2020',
    'register-label-plate': 'License Plate (optional)',
    'register-input-plate': 'ABC-1234',
    'register-btn': 'Register Me',

    // Reservas - Formulario Paso 1
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

    // Reservas - Paso 2 (Pago)
    'payment-step2-title': 'Choose payment method',
    'payment-paypal-title': 'Pay with PayPal',
    'payment-paypal-desc': 'Secure online payment. You will be redirected to PayPal.',
    'payment-cash-title': 'Pay in cash',
    'payment-cash-desc': 'You pay directly at the workshop. We will confirm your reservation.',
    'payment-back-btn': 'Back',

    // Contacto
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

    // Footer
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
    'copyright-text': '© 2024 Detailing Team. All rights reserved.',
    'copyright-security': 'By using this site, you accept our privacy and security practices.',
    
    // Developer section
    'developer-title': 'Want a website for your business?',
    'qr-message': 'Scan me! 📱',
    'cta-message': 'Professional, modern and 100% responsive websites.'
};

// =============================================
// SISTEMA DE IDIOMAS - TEXTOS EN ESPAÑOL
// =============================================
const textosEs = {
    // Título página
    'page-title': 'Detailing Team TX',
    
    // Header
    'header-title': 'Detailing Team',
    'header-slogan': 'Excelencia en Brillo - Protección Automotriz',
    
    // Navegación
    'nav-services': 'Servicios',
    'nav-gallery': 'Galería',
    'nav-catalog': 'Catálogo',
    'nav-register': 'Registro',
    'nav-bookings': 'Reservas',
    'nav-contact': 'Contacto',

    // Servicios
    'services-title': '✨ Servicios Profesionales ✨',
    'services-description': '🌟 El brillo que tu auto merece, la protección que necesita. Precios competitivos en Houston, TX. 🌟',
    'schedule-title': '🕒 Horario de atención',
    'schedule-text': '<strong>Lunes a Domingo:</strong> 7:00 AM - 5:30 PM',

    'service1-name': 'Express Detail',
    'service1-desc': 'Ideal para mantenimiento rápido. Lavado a mano, limpieza de rines, aspirado interior, tablero, consola, cristales. ¡Renueva tu auto en minutos!',
    'service1-btn': 'Reservar',
    'service1-price': '$100 – $120',

    'service2-name': 'Silver Package',
    'service2-desc': 'Limpieza más profunda. Incluye Express + paneles/puertas, shampoo ligero de alfombras, brillo llantas, eliminación manchas. Resultado impecable.',
    'service2-btn': 'Reservar',
    'service2-price': '$150 – $180',

    'service3-name': 'Gold Package',
    'service3-desc': 'Incluye Silver + shampoo profundo alfombras/tapicería, cera/sellador, protección plásticos, acabado alto brillo. ¡Siente la diferencia!',
    'service3-btn': 'Reservar',
    'service3-price': '$200 – $240',

    'service4-name': 'Diamond Package',
    'service4-desc': 'Premium Detail + 90 Day Ceramic Protection. Limpieza profunda + sellador cerámico. Protección UV, efecto showroom garantizado.',
    'service4-btn': 'Reservar',
    'service4-price': '$280',

    'service5-name': 'Ceramic 1 Year',
    'service5-desc': 'Protección cerámica 12 meses. Lavado profundo, descontaminación química, clay bar, coating, efecto hidrofóbico. Tu auto como nuevo por más tiempo.',
    'service5-btn': 'Reservar',
    'service5-price': '$700',

    'service6-name': 'Ceramic 3 Years (Mid Level)',
    'service6-desc': 'Protección cerámica nivel medio, duración 3 años. Máximo brillo y resistencia.',
    'service6-btn': 'Reservar',
    'service6-price': '$950',

    'service7-name': 'Ceramic 5 Years (Premium)',
    'service7-desc': 'Protección cerámica premium, duración 5 años. La máxima protección para tu vehículo. Inversión en belleza y cuidado.',
    'service7-btn': 'Reservar',
    'service7-price': '$1,500',

    // Galería
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

    // Productos
    'products-title': '🛒 Productos Profesionales 🛒',
    'products-description': 'Los mejores aceites, refrigerantes y líquidos para tu vehículo. ¡Calidad garantizada!',
    'product1-name': 'Aceite 5W-30',
    'product1-desc': 'Galón (3.78L) - Mobil 1. Protección superior para tu motor.',
    'product1-btn': 'Añadir',
    'product2-name': 'Refrigerante',
    'product2-desc': 'Concentrado 50/50 - Galón. Mantén tu motor a temperatura ideal.',
    'product2-btn': 'Añadir',
    'product3-name': 'Líquido Frenos DOT 4',
    'product3-desc': '12 oz - Prestone. Seguridad y confianza en cada frenada.',
    'product3-btn': 'Añadir',
    'product4-name': 'Limpiaparabrisas',
    'product4-desc': 'Galón - Ready to use. Visibilidad impecable.',
    'product4-btn': 'Añadir',

    // Registro - Formulario
    'register-title': '📝 Registro de Clientes 📝',
    'register-description': 'Guarda los datos de tu vehículo para un servicio más rápido y personalizado. ¡Te esperamos!',
    'register-label-name': 'Nombre y Apellidos *',
    'register-input-name': 'Nombre completo',
    'register-label-email': 'Email *',
    'register-input-email': 'cliente@ejemplo.com',
    'register-label-phone': 'Teléfono *',
    'register-input-phone': '+1 123 456 7890',
    'register-label-address': 'Dirección *',
    'register-input-address': 'Calle, número, ciudad, código postal',
    'register-label-model': 'Marca y Modelo *',
    'register-input-model': 'Ej: Honda Civic',
    'register-label-year': 'Año',
    'register-input-year': '2020',
    'register-label-plate': 'Placa (opcional)',
    'register-input-plate': 'ABC-1234',
    'register-btn': 'Registrarme',

    // Reservas - Formulario Paso 1
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

    // Reservas - Paso 2 (Pago)
    'payment-step2-title': 'Elige método de pago',
    'payment-paypal-title': 'Pagar con PayPal',
    'payment-paypal-desc': 'Pago seguro online. Serás redirigido a PayPal.',
    'payment-cash-title': 'Pagar en efectivo',
    'payment-cash-desc': 'Pagas directamente en el taller. Confirmaremos tu reserva.',
    'payment-back-btn': 'Volver',

    // Contacto
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

    // Footer
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
    'copyright-text': '© 2024 Detailing Team. Todos los derechos reservados.',
    'copyright-security': 'Al usar este sitio, aceptas nuestras prácticas de privacidad y seguridad.',
    
    // Developer section
    'developer-title': '¿Quieres una página web para tu negocio?',
    'qr-message': '¡Escáneame! 📱',
    'cta-message': 'Sitios web profesionales, modernos y 100% responsivos.'
};

// =============================================
// FUNCIÓN: cambiarIdioma
// =============================================
// Actualiza todos los textos de la página según el idioma seleccionado
// También actualiza placeholders, atributos alt y el título de la página
// =============================================
function cambiarIdioma(idioma) {
    const textos = idioma === 'en' ? textosEn : textosEs;
    
    // Actualizar elementos con ID
    for (let id in textos) {
        const elemento = document.getElementById(id);
        if (elemento) {
            // Si es schedule-text o contiene HTML, usar innerHTML
            if (id === 'schedule-text' || id.includes('desc') || id.includes('description')) {
                elemento.innerHTML = textos[id];
            } 
            // Si es placeholder de input, actualizar placeholder
            else if (id.includes('input-') && id.includes('placeholder')) {
                elemento.placeholder = textos[id];
            }
            // Si es un input que necesita placeholder
            else if (elemento.tagName === 'INPUT' || elemento.tagName === 'TEXTAREA') {
                elemento.placeholder = textos[id];
            }
            // Para el resto, usar innerText
            else {
                elemento.innerText = textos[id];
            }
        }
    }
    
    // Actualizar placeholders específicos de los inputs del registro
    const registerInputs = [
        'register-input-name', 'register-input-email', 'register-input-phone',
        'register-input-address', 'register-input-model', 'register-input-year', 'register-input-plate'
    ];
    
    registerInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input && textos[inputId]) {
            input.placeholder = textos[inputId];
        }
    });
    
    // Actualizar placeholders específicos del formulario de reservas
    const bookingInputs = ['booking-input-date', 'booking-input-time', 'booking-textarea-notes'];
    
    bookingInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input && textos[inputId]) {
            if (inputId === 'booking-textarea-notes') {
                input.placeholder = textos[inputId];
            }
        }
    });
    
    // Actualizar el atributo alt del logo
    const logo = document.getElementById('header-logo');
    if (logo && textos['header-logo']) {
        logo.alt = textos['header-logo'];
    }
    
    // Actualizar el título de la página
    document.title = textos['page-title'] || 'Detailing Team TX';
    
    // Actualizar clases activas de los botones de idioma
    const btnEnglish = document.getElementById('btnEnglish');
    const btnSpanish = document.getElementById('btnSpanish');
    if (btnEnglish) btnEnglish.classList.toggle('active', idioma === 'en');
    if (btnSpanish) btnSpanish.classList.toggle('active', idioma === 'es');
    
    // Actualizar el idioma del HTML
    document.documentElement.lang = idioma === 'en' ? 'en' : 'es';
    
    // Guardar preferencia en localStorage
    localStorage.setItem('idioma', idioma);
    
    // Actualizar disponibilidad para que use el nuevo idioma
    actualizarDisponibilidad();
    
    console.log(`🌐 Idioma cambiado a: ${idioma === 'en' ? 'English' : 'Español'}`);
}

// =============================================
// FUNCIÓN: detectarIdiomaNavegador
// =============================================
// Detecta el idioma del navegador del usuario
// =============================================
function detectarIdiomaNavegador() {
    const lang = navigator.language || navigator.userLanguage;
    return lang.startsWith('es') ? 'es' : (lang.startsWith('en') ? 'en' : 'es');
}

// =============================================
// FUNCIONES DE TEMA (Modo oscuro/claro)
// =============================================
function cambiarTema(modo) {
    const body = document.body;
    body.classList.remove('dark-mode');
    if (modo === 'dark') body.classList.add('dark-mode');
    else if (modo === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) body.classList.add('dark-mode');
    localStorage.setItem('tema', modo);
}

function aplicarTemaGuardado() {
    const temaGuardado = localStorage.getItem('tema');
    cambiarTema(temaGuardado || 'system');
}

// Escuchar cambios del sistema para el modo oscuro
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('tema') === 'system') {
        if (e.matches) document.body.classList.add('dark-mode');
        else document.body.classList.remove('dark-mode');
    }
});

// =============================================
// GESTIÓN DE RESERVAS
// =============================================
function obtenerReservasPorFecha(fecha) {
    let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    return reservas.filter(r => r.fecha === fecha);
}

function actualizarDisponibilidad() {
    const fechaInput = document.getElementById('fecha');
    if (!fechaInput || !fechaInput.value) return;
    
    const fecha = fechaInput.value;
    const reservasDia = obtenerReservasPorFecha(fecha);
    const disponibles = MAX_ORDENES_DIARIAS - reservasDia.length;
    const msgDiv = document.getElementById('availabilityMessage');
    if (!msgDiv) return;
    
    // Obtener idioma actual desde localStorage
    const idioma = localStorage.getItem('idioma') || 'es';
    
    if (disponibles <= 0) {
        msgDiv.innerHTML = idioma === 'es' 
            ? '❌ No hay cupos disponibles para esta fecha. Por favor elige otro día.'
            : '❌ No slots available for this date. Please choose another day.';
        msgDiv.className = 'availability-message error';
    } else {
        msgDiv.innerHTML = idioma === 'es'
            ? `✅ Cupos disponibles: ${disponibles} de ${MAX_ORDENES_DIARIAS} para esta fecha`
            : `✅ Available slots: ${disponibles} out of ${MAX_ORDENES_DIARIAS} for this date`;
        msgDiv.className = 'availability-message success';
    }
}

function validarHora(hora) {
    return hora >= HORARIO_INICIO && hora <= HORARIO_FIN;
}

// =============================================
// FUNCIÓN: calcularPrecioFinal
// =============================================
// Calcula el precio final del servicio según el tipo de vehículo
// =============================================
function calcularPrecioFinal(servicioOption, tipoVehiculo) {
    const precioBase = servicioOption.getAttribute('data-price-sedan');
    let precioNumerico = parseInt(precioBase.split('-')[0]);
    
    // Ajustes por tipo de vehículo
    if (tipoVehiculo === 'suv' || tipoVehiculo === 'pickup') {
        precioNumerico += 40;
    } else if (tipoVehiculo === 'van') {
        precioNumerico += 60;
    } else if (tipoVehiculo === 'truck') {
        precioNumerico += 80;
    }
    
    // Si el precio tiene rango (ej: 100-120)
    if (precioBase.includes('-')) {
        const precioMaxOriginal = parseInt(precioBase.split('-')[1]);
        const precioMax = precioMaxOriginal + (precioNumerico - parseInt(precioBase.split('-')[0]));
        return `${precioNumerico}-${precioMax}`;
    }
    return precioNumerico.toString();
}

// =============================================
// FUNCIÓN: enviarWhatsApp
// =============================================
function enviarWhatsApp(mensaje) {
    const mensajeCodificado = encodeURIComponent(mensaje);
    const url = `https://api.whatsapp.com/send?phone=${TELEFONO_PROPIETARIO}&text=${mensajeCodificado}`;
    window.open(url, '_blank');
}

// =============================================
// FUNCIÓN: generarTicket
// =============================================
// Genera el ticket de reserva para enviar por WhatsApp
// =============================================
function generarTicket(reserva, cliente) {
    const idioma = localStorage.getItem('idioma') || 'es';
    const salto = '\n';
    const linea = '══════════════════════════════';
    const separador = '──────────────────────────';
    let precioFormateado = reserva.precio;
    if (precioFormateado && !precioFormateado.includes('$')) {
        precioFormateado = `$${precioFormateado}`;
    }
    const tipoVehiculoDesc = tipoVehiculoTexto[reserva.tipoVehiculo] || reserva.tipoVehiculo;
    
    if (idioma === 'es') {
        return (
            `🔔 NUEVA RESERVA RECIBIDA 🔔` + salto +
            linea + salto +
            `👤 DATOS DEL CLIENTE` + salto +
            separador + salto +
            `📌 Nombre: ${cliente.nombre || ''}` + salto +
            `📧 Email: ${cliente.email || ''}` + salto +
            `📞 Celular: ${cliente.telefono || ''}` + salto +
            `🏠 Dirección: ${cliente.direccion || ''}` + salto +
            separador + salto +
            `🚗 DATOS DEL VEHÍCULO` + salto +
            separador + salto +
            `🔢 Tipo: ${tipoVehiculoDesc}` + salto +
            `📅 Año: ${cliente.anio || 'No especificado'}` + salto +
            separador + salto +
            `📋 DETALLE DEL SERVICIO` + salto +
            separador + salto +
            `🛠️ Servicio: ${reserva.servicio || ''}` + salto +
            `💰 Costo: ${precioFormateado}` + salto +
            `📅 Fecha: ${reserva.fecha || ''}` + salto +
            `⏰ Hora: ${reserva.hora || ''}` + salto +
            separador + salto +
            `💰💰 TOTAL A PAGAR: ${precioFormateado}` + salto +
            linea + salto +
            `📍 Servicio móvil - Nos desplazamos a tu domicilio` + salto +
            `📞 Contacto: +1 (713) 928-0466`
        );
    } else {
        return (
            `🔔 NEW BOOKING RECEIVED 🔔` + salto +
            linea + salto +
            `👤 CUSTOMER DATA` + salto +
            separador + salto +
            `📌 Name: ${cliente.nombre || ''}` + salto +
            `📧 Email: ${cliente.email || ''}` + salto +
            `📞 Phone: ${cliente.telefono || ''}` + salto +
            `🏠 Address: ${cliente.direccion || ''}` + salto +
            separador + salto +
            `🚗 VEHICLE DATA` + salto +
            separador + salto +
            `🔢 Type: ${tipoVehiculoDesc}` + salto +
            `📅 Year: ${cliente.anio || 'Not specified'}` + salto +
            separador + salto +
            `📋 SERVICE DETAILS` + salto +
            separador + salto +
            `🛠️ Service: ${reserva.servicio || ''}` + salto +
            `💰 Cost: ${precioFormateado}` + salto +
            `📅 Date: ${reserva.fecha || ''}` + salto +
            `⏰ Time: ${reserva.hora || ''}` + salto +
            separador + salto +
            `💰💰 TOTAL TO PAY: ${precioFormateado}` + salto +
            linea + salto +
            `📍 Mobile service - We come to your location` + salto +
            `📞 Contact: +1 (713) 928-0466`
        );
    }
}

// =============================================
// FUNCIÓN: guardarRegistro
// =============================================
// Guarda los datos del cliente en MongoDB y localStorage
// =============================================
function guardarRegistro(event) {
    event.preventDefault();
    console.log('📝 Iniciando registro...');
    
    // Obtener valores del formulario usando IDs del HTML corregido
    const nombreInput = document.getElementById('register-input-name');
    const emailInput = document.getElementById('register-input-email');
    const telefonoInput = document.getElementById('register-input-phone');
    const direccionInput = document.getElementById('register-input-address');
    const modeloInput = document.getElementById('register-input-model');
    const anioInput = document.getElementById('register-input-year');
    const placaInput = document.getElementById('register-input-plate');
    
    if (!nombreInput || !emailInput || !telefonoInput || !direccionInput || !modeloInput) {
        alert('Error: No se encontró el formulario de registro. Por favor recarga la página.');
        return;
    }
    
    const registro = {
        nombre: nombreInput.value,
        email: emailInput.value,
        telefono: telefonoInput.value,
        direccion: direccionInput.value,
        modelo: modeloInput.value,
        anio: anioInput ? anioInput.value : '',
        placa: placaInput ? placaInput.value : ''
    };
    
    console.log('📤 Enviando datos al backend:', registro);
    
    fetch(`${BACKEND_URL}/api/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registro)
    })
    .then(res => {
        console.log('📊 Status de respuesta:', res.status);
        if (!res.ok) {
            return res.text().then(text => {
                throw new Error(`HTTP ${res.status}: ${text}`);
            });
        }
        return res.json();
    })
    .then(data => {
        console.log('✅ Respuesta exitosa del servidor:', data);
        
        // Guardar en localStorage como respaldo
        let registros = JSON.parse(localStorage.getItem('clientes')) || [];
        registros.push(registro);
        localStorage.setItem('clientes', JSON.stringify(registros));
        
        const idioma = localStorage.getItem('idioma') || 'es';
        
        return fetch(`${BACKEND_URL}/api/enviar-bienvenida`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: registro.nombre,
                email: registro.email,
                idioma: idioma
            })
        });
    })
    .then(response => response.json())
    .then(data => {
        console.log('✅ Email de bienvenida enviado:', data);
        const idioma = localStorage.getItem('idioma') || 'es';
        alert(idioma === 'es' ? '✅ Registro exitoso. Se ha enviado un email de bienvenida.' : '✅ Registration successful. A welcome email has been sent.');
    })
    .catch(err => {
        console.error('❌ Error en el proceso:', err);
        const idioma = localStorage.getItem('idioma') || 'es';
        alert(idioma === 'es' 
            ? '✅ Registro guardado, pero hubo un problema con el email. Error: ' + err.message 
            : '✅ Registration saved, but there was an email problem. Error: ' + err.message);
    });
    
    // Limpiar formulario
    const registerForm = document.getElementById('registerForm');
    if (registerForm) registerForm.reset();
}

// =============================================
// FUNCIÓN: procesarReserva
// =============================================
// Procesa la reserva, guarda en MongoDB y envía notificaciones
// =============================================
function procesarReserva(event) {
    event.preventDefault();
    
    const idioma = localStorage.getItem('idioma') || 'es';
    
    // Validar hora
    const horaInput = document.getElementById('booking-input-time');
    if (!horaInput) {
        alert('Error: Campo hora no encontrado');
        return false;
    }
    
    const hora = horaInput.value;
    if (!validarHora(hora)) {
        alert(idioma === 'es' 
            ? '❌ Horario no válido. Atendemos de 7:00 AM a 5:30 PM.'
            : '❌ Invalid time. We are open from 7:00 AM to 5:30 PM.');
        return false;
    }
    
    // Validar fecha
    const fechaInput = document.getElementById('booking-input-date');
    if (!fechaInput) {
        alert('Error: Campo fecha no encontrado');
        return false;
    }
    
    const fecha = fechaInput.value;
    const reservasDia = obtenerReservasPorFecha(fecha);
    if (reservasDia.length >= MAX_ORDENES_DIARIAS) {
        alert(idioma === 'es' 
            ? '❌ Lo sentimos, no hay cupos disponibles para esta fecha.'
            : '❌ Sorry, no slots available for this date.');
        return false;
    }
    
    // Obtener cliente actual
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    if (clientes.length === 0) {
        alert(idioma === 'es' 
            ? '⚠️ Debes registrarte antes de hacer una reserva.'
            : '⚠️ You must register before making a booking.');
        window.location.href = '#registro';
        return false;
    }
    
    const clienteActual = clientes[clientes.length - 1];
    
    // Obtener valores del formulario
    const servicioSelect = document.getElementById('booking-select-service');
    const tipoVehiculoSelect = document.getElementById('booking-select-vehicle');
    const notasTextarea = document.getElementById('booking-textarea-notes');
    
    if (!servicioSelect || !tipoVehiculoSelect) {
        alert('Error: Campos de servicio no encontrados');
        return false;
    }
    
    const servicioOption = servicioSelect.options[servicioSelect.selectedIndex];
    const tipoVehiculo = tipoVehiculoSelect.value;
    const precioFinal = calcularPrecioFinal(servicioOption, tipoVehiculo);
    
    const reserva = {
        servicio: servicioOption.value,
        tipoVehiculo: tipoVehiculo,
        fecha: fecha,
        hora: hora,
        notas: notasTextarea ? notasTextarea.value : '',
        precio: precioFinal,
        clienteEmail: clienteActual.email,
        metodoPago: 'Efectivo'
    };
    
    console.log('📤 Enviando reserva:', reserva);
    
    fetch(`${BACKEND_URL}/api/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reserva)
    })
    .then(res => {
        console.log('📊 Status:', res.status);
        if (!res.ok) {
            return res.text().then(text => {
                throw new Error(`HTTP ${res.status}: ${text}`);
            });
        }
        return res.json();
    })
    .then(data => {
        console.log('✅ Reserva guardada en MongoDB:', data);
        
        // Guardar en localStorage como respaldo
        let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        reservas.push(reserva);
        localStorage.setItem('reservas', JSON.stringify(reservas));
        
        // Enviar WhatsApp con ticket
        const ticket = generarTicket(reserva, clienteActual);
        enviarWhatsApp(ticket);
        
        // Enviar email al cliente
        return fetch(`${BACKEND_URL}/api/enviar-reserva`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cliente: clienteActual,
                reserva: reserva,
                tipo: 'cliente',
                idioma: idioma
            })
        });
    })
    .then(response => response.json())
    .then(data => {
        console.log('✅ Email al cliente enviado:', data);
        
        // Enviar email al propietario
        return fetch(`${BACKEND_URL}/api/enviar-reserva`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cliente: clienteActual,
                reserva: reserva,
                tipo: 'propietario',
                idioma: idioma
            })
        });
    })
    .then(response => response.json())
    .then(data => {
        console.log('✅ Email al propietario enviado:', data);
        alert(idioma === 'es' 
            ? '✅ Reserva confirmada. Se ha guardado en la base de datos y enviado emails de confirmación.'
            : '✅ Booking confirmed. It has been saved in the database and confirmation emails sent.');
    })
    .catch(err => {
        console.error('❌ Error en el proceso:', err);
        
        // Guardar localmente como fallback
        let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        reservas.push(reserva);
        localStorage.setItem('reservas', JSON.stringify(reservas));
        
        alert(idioma === 'es'
            ? '⚠️ Reserva guardada localmente, pero hubo un problema con el servidor. Error: ' + err.message
            : '⚠️ Booking saved locally, but there was a server problem. Error: ' + err.message);
    });
    
    // Limpiar formulario y actualizar disponibilidad
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) bookingForm.reset();
    actualizarDisponibilidad();
    
    return false;
}

// =============================================
// FUNCIONES DE PAGO
// =============================================
function procesarPagoPayPal() {
    const idioma = localStorage.getItem('idioma') || 'es';
    alert(idioma === 'es' ? 'Redirigiendo a PayPal...' : 'Redirecting to PayPal...');
}

function procesarPagoEfectivo() {
    const idioma = localStorage.getItem('idioma') || 'es';
    alert(idioma === 'es' ? 'Reserva confirmada para pago en efectivo.' : 'Booking confirmed for cash payment.');
}

function volverAlFormulario() {
    const step1 = document.getElementById('bookingStep1');
    const step2 = document.getElementById('bookingStep2');
    if (step1) step1.classList.remove('hidden');
    if (step2) step2.classList.add('hidden');
}

// =============================================
// INICIALIZACIÓN
// =============================================
// Se ejecuta cuando la página termina de cargar
// =============================================
window.onload = function() {
    console.log('🚀 Página cargada, iniciando configuración...');
    
    // Cargar idioma guardado o detectar del navegador
    const idiomaGuardado = localStorage.getItem('idioma');
    cambiarIdioma(idiomaGuardado || detectarIdiomaNavegador());
    
    // Cargar tema guardado
    aplicarTemaGuardado();
    
    // Configurar input de hora con los límites
    const horaInput = document.getElementById('booking-input-time');
    if (horaInput) {
        horaInput.min = HORARIO_INICIO;
        horaInput.max = HORARIO_FIN;
        horaInput.step = "1800";
    }
    
    // Configurar evento de cambio de fecha
    const fechaInput = document.getElementById('booking-input-date');
    if (fechaInput) {
        fechaInput.addEventListener('change', actualizarDisponibilidad);
    }
    
    // Escuchar cambios en localStorage (cuando se cambia el idioma desde otra página)
    window.addEventListener('storage', function(e) {
        if (e.key === 'idioma') {
            cambiarIdioma(e.newValue);
        }
    });
    
    console.log('✅ Configuración completada');
};