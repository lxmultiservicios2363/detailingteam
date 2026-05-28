// =============================================
// DETAILING TEAM - SCRIPT PRINCIPAL
// =============================================
// VERSIÓN: 10.12 (FORMULARIOS DINÁMICOS TRADUCIDOS)
// FECHA: 27/05/2026
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
// PRECIOS BASE DE SERVICIOS (SEDÁN / STANDARD)
// =============================================
const PRECIOS_BASE = {
    'Express Detail': [100, 120],
    'Silver Package': [150, 180],
    'Gold Package': [200, 220],
    'Diamond Package': [280, 280],
    'Ceramic 1 Year': [700, 700],
    'Ceramic 3 Years': [950, 950],
    'Ceramic 5 Years': [1500, 1500]
};

// =============================================
// INCREMENTOS POR TIPO DE VEHÍCULO
// =============================================
const INCREMENTOS_EXPRESS = {
    'suv': 45,
    'pickup': 35,
    'van': 60
};

const INCREMENTOS_STANDARD = {
    'suv': 30,
    'pickup': 20,
    'van': 40
};

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
    'convertible': '🏎️ Convertible / Descapotable (2 puertas, 2-4 asientos)',
    'suv': '🚙 SUV (5-7 asientos)',
    'pickup': '🛻 Pickup (2-5 asientos)',
    'van': '🚐 Van / Minivan (7-8 asientos)'
};

// =============================================
// TRADUCCIONES DE DESCRIPCIONES DE SERVICIOS
// =============================================
const serviceDescriptions = {
    'Express Detail': {
        es: 'Ideal para mantenimiento rápido y efectivo. Este servicio incluye:',
        en: 'Ideal for quick and effective maintenance. This service includes:'
    },
    'Silver Package': {
        es: 'Limpieza profunda que va más allá del mantenimiento básico. Este servicio incluye:',
        en: 'Deep cleaning that goes beyond basic maintenance. This service includes:'
    },
    'Gold Package': {
        es: 'Limpieza premium con protección de cera. Incluye:',
        en: 'Premium cleaning with wax protection. Includes:'
    },
    'Diamond Package': {
        es: 'Premium Detail con protección cerámica por 90 días. Incluye:',
        en: 'Premium Detail with 90-day ceramic protection. Includes:'
    },
    'Ceramic 1 Year': {
        es: 'Protección cerámica de alta duración por 12 meses. Incluye:',
        en: 'High durability ceramic protection for 12 months. Includes:'
    },
    'Ceramic 3 Years': {
        es: 'Protección cerámica nivel medio con duración de 3 años. Incluye:',
        en: 'Mid-level ceramic protection lasting 3 years. Includes:'
    },
    'Ceramic 5 Years': {
        es: 'Protección cerámica premium con duración de 5 años. Incluye:',
        en: 'Premium ceramic protection lasting 5 years. Includes:'
    }
};

// =============================================
// TRADUCCIONES DE ÍTEMS DE LISTA POR SERVICIO
// =============================================
const serviceListItems = {
    'Express Detail': {
        es: [
            'Lavado a mano de toda la carrocería',
            'Limpieza profesional de rines y llantas',
            'Aspirado completo del interior',
            'Limpieza de tablero, consola y paneles',
            'Limpieza de cristales por dentro y por fuera',
            'Secado con microfibra para evitar rayones'
        ],
        en: [
            'Hand wash of the entire body',
            'Professional cleaning of rims and tires',
            'Complete interior vacuuming',
            'Dashboard, console and panel cleaning',
            'Window cleaning inside and out',
            'Microfiber drying to prevent scratches'
        ]
    },
    'Silver Package': {
        es: [
            'Todo lo incluido en Express Detail',
            'Limpieza de paneles y puertas a fondo',
            'Shampoo ligero de alfombras',
            'Brillo de llantas',
            'Eliminación de manchas superficiales',
            'Limpieza de áreas difíciles (respiradores, molduras)'
        ],
        en: [
            'Everything included in Express Detail',
            'Thorough cleaning of panels and doors',
            'Light carpet shampoo',
            'Tire shine',
            'Removal of light stains',
            'Cleaning of difficult areas (vents, moldings)'
        ]
    },
    'Gold Package': {
        es: [
            'Todo lo incluido en Silver Package',
            'Shampoo profundo de alfombras y tapicería',
            'Aplicación de cera o sellador de pintura',
            'Protección de plásticos exteriores e interiores',
            'Acabado de alto brillo',
            'Eliminación de manchas difíciles'
        ],
        en: [
            'Everything included in Silver Package',
            'Deep carpet and upholstery shampoo',
            'Wax or paint sealant application',
            'Protection of exterior and interior plastics',
            'High gloss finish',
            'Removal of difficult stains'
        ]
    },
    'Diamond Package': {
        es: [
            'Todo lo incluido en Gold Package',
            'Limpieza profunda de pintura',
            'Aplicación de sellador cerámico',
            'Protección UV avanzada',
            'Efecto hidrofóbico',
            'Garantía de 90 días en el brillo'
        ],
        en: [
            'Everything included in Gold Package',
            'Deep paint cleaning',
            'Ceramic sealant application',
            'Advanced UV protection',
            'Hydrophobic effect',
            '90-day shine guarantee'
        ]
    },
    'Ceramic 1 Year': {
        es: [
            'Lavado profundo de pintura',
            'Descontaminación química',
            'Clay bar para eliminar contaminantes',
            'Aplicación de coating cerámico',
            'Efecto hidrofóbico avanzado',
            'Protección UV, química y ambiental'
        ],
        en: [
            'Deep paint washing',
            'Chemical decontamination',
            'Clay bar to remove contaminants',
            'Ceramic coating application',
            'Advanced hydrophobic effect',
            'UV, chemical and environmental protection'
        ]
    },
    'Ceramic 3 Years': {
        es: [
            'Preparación avanzada de pintura',
            'Descontaminación química y mecánica',
            'Aplicación de capa cerámica base',
            'Aplicación de capa cerámica de sacrificio',
            'Efecto hidrofóbico mejorado',
            'Protección contra rayos UV y contaminantes'
        ],
        en: [
            'Advanced paint preparation',
            'Chemical and mechanical decontamination',
            'Base ceramic layer application',
            'Sacrificial ceramic layer application',
            'Enhanced hydrophobic effect',
            'Protection against UV rays and contaminants'
        ]
    },
    'Ceramic 5 Years': {
        es: [
            'Preparación profesional de pintura (pulido de una etapa)',
            'Descontaminación química y mecánica completa',
            'Aplicación de capa cerámica base premium',
            'Aplicación de capa cerámica reforzada',
            'Aplicación de capa de sacrificio hidrofóbica',
            'Protección superior contra rayos UV, químicos y contaminantes'
        ],
        en: [
            'Professional paint preparation (one-stage polishing)',
            'Complete chemical and mechanical decontamination',
            'Premium base ceramic layer application',
            'Reinforced ceramic layer application',
            'Hydrophobic sacrificial layer application',
            'Superior protection against UV rays, chemicals and contaminants'
        ]
    }
};

// =============================================
// TRADUCCIONES DE NOTAS DE SERVICIOS
// =============================================
const serviceNotes = {
    'Express Detail': {
        es: '✨ Tu auto quedará renovado en minutos, con un brillo espectacular y protección básica.',
        en: '✨ Your car will be renewed in minutes, with spectacular shine and basic protection.'
    },
    'Silver Package': {
        es: '✨ Resultado impecable para tu vehículo, ideal si buscas una limpieza completa pero no necesitas un detailing completo.',
        en: '✨ Impeccable result for your vehicle, ideal if you are looking for a complete cleaning but do not need a full detailing.'
    },
    'Gold Package': {
        es: '✨ Tu auto lucirá como recién salido del concesionario. Ideal para ocasiones especiales o si quieres mimar tu vehículo.',
        en: '✨ Your car will look like it just left the dealership. Ideal for special occasions or if you want to pamper your vehicle.'
    },
    'Diamond Package': {
        es: '✨ Tu auto lucirá como en un showroom. La protección cerámica repele agua, suciedad y rayos UV.',
        en: '✨ Your car will look like in a showroom. Ceramic protection repels water, dirt and UV rays.'
    },
    'Ceramic 1 Year': {
        es: '✨ Tu auto se mantendrá más limpio por más tiempo, el agua resbalará fácilmente y el brillo será impresionante.',
        en: '✨ Your car will stay cleaner longer, water will slide off easily, and the shine will be impressive.'
    },
    'Ceramic 3 Years': {
        es: '✨ Resistencia superior a químicos y contaminantes. Garantía de 3 años en condiciones normales de uso.',
        en: '✨ Superior resistance to chemicals and contaminants. 3-year warranty under normal use conditions.'
    },
    'Ceramic 5 Years': {
        es: '✨ La máxima protección disponible para tu vehículo. Inversión en belleza y cuidado a largo plazo.',
        en: '✨ The maximum protection available for your vehicle. Investment in long-term beauty and care.'
    }
};

// =============================================
// TEXTOS EN INGLÉS (COMPLETOS CON FOOTER)
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
    'booking-service-express': 'Express Detail - Exterior: $100 / Interior+Exterior: $120 (+SUV/Pickup/Van)',
    'booking-service-silver': 'Silver Package - Exterior: $150 / Interior+Exterior: $180 (+SUV/Pickup/Van)',
    'booking-service-gold': 'Gold Package - Exterior: $200 / Interior+Exterior: $220 (+SUV/Pickup/Van)',
    'booking-service-diamond': 'Diamond Package - $280 (+SUV/Pickup/Van)',
    'booking-service-ceramic1': 'Ceramic 1 Year - $700 (+SUV/Pickup/Van)',
    'booking-service-ceramic3': 'Ceramic 3 Years - $950 (+SUV/Pickup/Van)',
    'booking-service-ceramic5': 'Ceramic 5 Years - $1,500 (+SUV/Pickup/Van)',
    'booking-label-vehicle': 'Vehicle Type *',
    'booking-vehicle-default': 'Select vehicle type',
    'booking-vehicle-sedan': '🚗 Sedan (4 doors, 5 seats)',
    'booking-vehicle-convertible': '🏎️ Convertible (2 doors, 2-4 seats)',
    'booking-vehicle-suv': '🚙 SUV (5-7 seats)',
    'booking-vehicle-pickup': '🛻 Pickup (2-5 seats)',
    'booking-vehicle-van': '🚐 Van / Minivan (7-8 seats)',
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
// TEXTOS EN ESPAÑOL (COMPLETOS CON FOOTER)
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
    'booking-service-express': 'Express Detail - Exterior: $100 / Interior+Exterior: $120 (+SUV/Pickup/Van)',
    'booking-service-silver': 'Silver Package - Exterior: $150 / Interior+Exterior: $180 (+SUV/Pickup/Van)',
    'booking-service-gold': 'Gold Package - Exterior: $200 / Interior+Exterior: $220 (+SUV/Pickup/Van)',
    'booking-service-diamond': 'Diamond Package - $280 (+SUV/Pickup/Van)',
    'booking-service-ceramic1': 'Ceramic 1 Year - $700 (+SUV/Pickup/Van)',
    'booking-service-ceramic3': 'Ceramic 3 Years - $950 (+SUV/Pickup/Van)',
    'booking-service-ceramic5': 'Ceramic 5 Years - $1,500 (+SUV/Pickup/Van)',
    'booking-label-vehicle': 'Tipo de vehículo *',
    'booking-vehicle-default': 'Selecciona tipo de vehículo',
    'booking-vehicle-sedan': '🚗 Sedán (4 puertas, 5 asientos)',
    'booking-vehicle-convertible': '🏎️ Convertible / Descapotable (2 puertas, 2-4 asientos)',
    'booking-vehicle-suv': '🚙 SUV (5-7 asientos)',
    'booking-vehicle-pickup': '🛻 Pickup (2-5 asientos)',
    'booking-vehicle-van': '🚐 Van / Minivan (7-8 asientos)',
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
    var idioma = localStorage.getItem('idioma') || 'es';
    var textos = idioma === 'en' ? textosIndexEn : textosIndexEs;
    
    // Traducir elementos con ID
    for (var id in textos) {
        var elemento = document.getElementById(id);
        if (elemento) {
            if (id === 'schedule-text' || id.indexOf('desc') !== -1 || id.indexOf('description') !== -1) {
                elemento.innerHTML = textos[id];
            } else if (id.indexOf('placeholder') !== -1) {
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
    
    // Traducir navegación
    var navIds = ['nav-services', 'nav-gallery', 'nav-catalog', 'nav-register', 'nav-bookings', 'nav-contact'];
    for (var i = 0; i < navIds.length; i++) {
        var navEl = document.getElementById(navIds[i]);
        if (navEl && textos[navIds[i]]) {
            navEl.innerText = textos[navIds[i]];
        }
    }
    
    // Traducir título "Descripción del Servicio"
    var descTitle = document.getElementById('service-description-title');
    if (descTitle) {
        descTitle.innerHTML = '<i class="fas fa-info-circle"></i> ' + (idioma === 'en' ? 'Service Description' : 'Descripción del Servicio');
    }
    
    // Traducir título "Precios"
    var pricesTitle = document.getElementById('prices-title');
    if (pricesTitle) {
        pricesTitle.innerHTML = '<i class="fas fa-tag"></i> ' + (idioma === 'en' ? 'Prices' : 'Precios');
    }
    
    // Traducir texto de descripción principal del servicio
    var serviceDescText = document.getElementById('service-description-text');
    if (serviceDescText) {
        var serviceName = getServiceNameFromPage();
        if (serviceName && serviceDescriptions[serviceName]) {
            serviceDescText.innerText = serviceDescriptions[serviceName][idioma];
        }
    }
    
    // Traducir los ítems de la lista
    for (var j = 1; j <= 6; j++) {
        var item = document.getElementById('service-include-' + j);
        if (item) {
            var serviceName = getServiceNameFromPage();
            if (serviceName && serviceListItems[serviceName]) {
                var icon = item.querySelector('i');
                var text = serviceListItems[serviceName][idioma][j-1];
                if (icon) {
                    item.innerHTML = '';
                    item.appendChild(icon);
                    item.appendChild(document.createTextNode(' ' + text));
                } else {
                    item.innerText = text;
                }
            }
        }
    }
    
    // Traducir la nota del servicio
    var serviceNoteElem = document.getElementById('service-note');
    if (serviceNoteElem) {
        var serviceName = getServiceNameFromPage();
        if (serviceName && serviceNotes[serviceName]) {
            var strong = serviceNoteElem.querySelector('strong');
            var noteText = serviceNotes[serviceName][idioma];
            if (strong) {
                serviceNoteElem.innerHTML = '✨ ' + strong.outerHTML + ' ' + noteText.substring(noteText.indexOf(' '));
            } else {
                serviceNoteElem.innerHTML = '✨ ' + noteText;
            }
        }
    }
    
    // Traducir títulos de precios
    var priceBasicTitle = document.getElementById('price-basic-title');
    if (priceBasicTitle) {
        priceBasicTitle.innerText = idioma === 'en' ? 'Basic finish' : 'Sin acabado interior';
    }
    
    var pricePremiumTitle = document.getElementById('price-premium-title');
    if (pricePremiumTitle) {
        pricePremiumTitle.innerText = idioma === 'en' ? 'Premium finish' : 'Con acabado completo';
    }
    
    // Traducir notas de precios
    var priceNoteBasic = document.getElementById('price-note-basic');
    if (priceNoteBasic) {
        priceNoteBasic.innerText = idioma === 'en' ? '(Base price - Sedan)' : '(Precio base - Sedán)';
    }
    
    var priceNotePremium = document.getElementById('price-note-premium');
    if (priceNotePremium) {
        priceNotePremium.innerText = idioma === 'en' ? '(Base price - Sedan)' : '(Precio base - Sedán)';
    }
    
    // Traducir información de vehículos grandes
    var additionalInfo = document.getElementById('additional-info-text');
    if (additionalInfo) {
        var strong = additionalInfo.querySelector('strong');
        if (idioma === 'en') {
            if (strong) {
                additionalInfo.innerHTML = '<i class="fas fa-plus-circle"></i> <strong>Large vehicles (SUV, Pickup, Van):</strong> Additional price';
            }
        } else {
            if (strong) {
                additionalInfo.innerHTML = '<i class="fas fa-plus-circle"></i> <strong>Vehículos grandes (SUV, Pickup, Van):</strong> Consultar precio adicional';
            }
        }
    }
    
    // Traducir texto del botón de reserva
    var bookingBtnText = document.getElementById('booking-btn-text');
    if (bookingBtnText) {
        bookingBtnText.innerText = idioma === 'en' ? 'Book' : 'Reservar';
    }
    
    // Traducir nota de acción
    var actionNote = document.getElementById('action-note');
    if (actionNote) {
        actionNote.innerText = idioma === 'en' 
            ? 'When booking, select "' + getServiceNameFromPage() + '" in the form'
            : 'Al reservar, selecciona "' + getServiceNameFromPage() + '" en el formulario';
    }
    
    // Traducir "Volver a Servicios"
    var backButton = document.getElementById('back-button');
    if (backButton) {
        var icon = backButton.querySelector('i');
        var backText = idioma === 'en' ? 'Back to Services' : 'Volver a Servicios';
        if (icon) {
            backButton.innerHTML = '';
            backButton.appendChild(icon);
            backButton.appendChild(document.createTextNode(' ' + backText));
        } else {
            backButton.innerText = backText;
        }
    }
    
    document.title = textos['page-title'];
    
    var btnEnglish = document.getElementById('btnEnglish');
    var btnSpanish = document.getElementById('btnSpanish');
    if (btnEnglish) {
        if (idioma === 'en') btnEnglish.classList.add('active');
        else btnEnglish.classList.remove('active');
    }
    if (btnSpanish) {
        if (idioma === 'es') btnSpanish.classList.add('active');
        else btnSpanish.classList.remove('active');
    }
    
    document.documentElement.lang = idioma === 'en' ? 'en' : 'es';
    
    // Regenerar formularios dinámicos con el nuevo idioma
    regenerarFormularioRegistro();
    regenerarFormularioReserva();
    
    console.log('🌐 Idioma actualizado a:', idioma);
}

function getServiceNameFromPage() {
    var url = window.location.pathname;
    var serviceMap = {
        'express-detail': 'Express Detail',
        'silver-detail': 'Silver Package',
        'gold-detail': 'Gold Package',
        'diamond-detail': 'Diamond Package',
        'ceramic1-detail': 'Ceramic 1 Year',
        'ceramic3-detail': 'Ceramic 3 Years',
        'ceramic5-detail': 'Ceramic 5 Years'
    };
    
    for (var key in serviceMap) {
        if (url.indexOf(key) !== -1) {
            return serviceMap[key];
        }
    }
    
    var titleElem = document.querySelector('.service-detail-title');
    if (titleElem) {
        var titleText = titleElem.innerText;
        if (titleText.indexOf('Express') !== -1) return 'Express Detail';
        if (titleText.indexOf('Silver') !== -1) return 'Silver Package';
        if (titleText.indexOf('Gold') !== -1) return 'Gold Package';
        if (titleText.indexOf('Diamond') !== -1) return 'Diamond Package';
        if (titleText.indexOf('Ceramic 1') !== -1) return 'Ceramic 1 Year';
        if (titleText.indexOf('Ceramic 3') !== -1) return 'Ceramic 3 Years';
        if (titleText.indexOf('Ceramic 5') !== -1) return 'Ceramic 5 Years';
    }
    
    return 'Express Detail';
}

// =============================================
// FUNCIÓN: regenerarFormularioRegistro
// =============================================
function regenerarFormularioRegistro() {
    var idioma = localStorage.getItem('idioma') || 'es';
    var textos = idioma === 'en' ? textosIndexEn : textosIndexEs;
    
    var formContainer = document.querySelector('#registro .form-container');
    if (!formContainer) return;
    
    // Verificar si el formulario completo ya existe
    var existingForm = document.getElementById('registerFormCompleto');
    if (existingForm) {
        // Si existe, solo actualizar los textos sin regenerar todo
        var labels = document.querySelectorAll('#registerFormCompleto .form-group label');
        if (labels.length >= 4) {
            if (labels[0] && textos['register-label-name']) labels[0].innerHTML = textos['register-label-name'];
            if (labels[1] && textos['register-label-email']) labels[1].innerHTML = textos['register-label-email'];
            if (labels[2] && textos['register-label-phone']) labels[2].innerHTML = textos['register-label-phone'];
            if (labels[3] && textos['register-label-address']) labels[3].innerHTML = textos['register-label-address'];
        }
        
        // Actualizar placeholders
        var inputs = ['register-nombre', 'register-email', 'register-telefono', 'register-direccion'];
        for (var i = 0; i < inputs.length; i++) {
            var input = document.getElementById(inputs[i]);
            if (input) {
                if (inputs[i] === 'register-nombre') input.placeholder = textos['register-label-name'] || 'Full Name';
                else if (inputs[i] === 'register-email') input.placeholder = 'Email';
                else if (inputs[i] === 'register-telefono') input.placeholder = textos['register-label-phone'] || 'Phone';
                else if (inputs[i] === 'register-direccion') input.placeholder = textos['register-label-address'] || 'Address';
            }
        }
        
        // Actualizar título de vehículos
        var titleElement = document.querySelector('#registerFormCompleto h3');
        if (titleElement) {
            titleElement.innerText = idioma === 'es' 
                ? 'Datos de tus vehículos (máximo ' + MAX_VEHICULOS + ')'
                : 'Your vehicle data (max ' + MAX_VEHICULOS + ')';
        }
        
        // Actualizar texto de ayuda
        var helpText = document.querySelector('#registerFormCompleto > p');
        if (helpText) {
            helpText.innerText = idioma === 'es'
                ? 'El primer vehículo es obligatorio. Los demás son opcionales.'
                : 'The first vehicle is required. Others are optional.';
        }
        
        // Actualizar etiquetas de vehículos
        for (var i = 1; i <= MAX_VEHICULOS; i++) {
            var vehiculoGroup = document.getElementById('vehiculo-group-' + i);
            if (vehiculoGroup) {
                var h4 = vehiculoGroup.querySelector('h4');
                if (h4) {
                    h4.innerHTML = '<i class="fas fa-car"></i> ' + (idioma === 'es' ? 'Vehículo ' + i : 'Vehicle ' + i) + (i === 1 ? ' *' : ' (opcional)');
                }
                
                var labelsGroup = vehiculoGroup.querySelectorAll('label');
                if (labelsGroup[0]) labelsGroup[0].innerHTML = (idioma === 'es' ? 'Marca y Modelo' : 'Make and Model') + ' ' + i + (i === 1 ? ' *' : ' (opcional)');
                if (labelsGroup[1]) labelsGroup[1].innerHTML = (idioma === 'es' ? 'Año' : 'Year') + ' ' + i;
                if (labelsGroup[2]) labelsGroup[2].innerHTML = (idioma === 'es' ? 'Matrícula/Placa' : 'License Plate') + ' ' + i + (i === 1 ? ' *' : ' (opcional)');
                
                var inputsGroup = vehiculoGroup.querySelectorAll('input');
                if (inputsGroup[0]) inputsGroup[0].placeholder = idioma === 'es' ? 'Ej: Honda Civic' : 'Ex: Honda Civic';
                if (inputsGroup[1]) inputsGroup[1].placeholder = idioma === 'es' ? 'Ej: 2020' : 'Ex: 2020';
                if (inputsGroup[2]) inputsGroup[2].placeholder = idioma === 'es' ? 'Ej: ABC-1234' : 'Ex: ABC-1234';
            }
        }
        
        // Actualizar botón de registro
        var submitBtn = document.querySelector('#registerFormCompleto button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerText = idioma === 'es' ? 'Registrarme' : 'Register';
        }
    }
}

// =============================================
// FUNCIÓN: regenerarFormularioReserva
// =============================================
function regenerarFormularioReserva() {
    var idioma = localStorage.getItem('idioma') || 'es';
    var textos = idioma === 'en' ? textosIndexEn : textosIndexEs;
    
    // Actualizar opciones del select de servicios
    var serviceSelect = document.getElementById('booking-select-service');
    if (serviceSelect) {
        var defaultOption = document.getElementById('booking-service-default');
        if (defaultOption && textos['booking-service-default']) defaultOption.innerText = textos['booking-service-default'];
        
        var expressOption = document.getElementById('booking-service-express');
        if (expressOption && textos['booking-service-express']) expressOption.innerText = textos['booking-service-express'];
        
        var silverOption = document.getElementById('booking-service-silver');
        if (silverOption && textos['booking-service-silver']) silverOption.innerText = textos['booking-service-silver'];
        
        var goldOption = document.getElementById('booking-service-gold');
        if (goldOption && textos['booking-service-gold']) goldOption.innerText = textos['booking-service-gold'];
        
        var diamondOption = document.getElementById('booking-service-diamond');
        if (diamondOption && textos['booking-service-diamond']) diamondOption.innerText = textos['booking-service-diamond'];
        
        var ceramic1Option = document.getElementById('booking-service-ceramic1');
        if (ceramic1Option && textos['booking-service-ceramic1']) ceramic1Option.innerText = textos['booking-service-ceramic1'];
        
        var ceramic3Option = document.getElementById('booking-service-ceramic3');
        if (ceramic3Option && textos['booking-service-ceramic3']) ceramic3Option.innerText = textos['booking-service-ceramic3'];
        
        var ceramic5Option = document.getElementById('booking-service-ceramic5');
        if (ceramic5Option && textos['booking-service-ceramic5']) ceramic5Option.innerText = textos['booking-service-ceramic5'];
    }
    
    // Actualizar opciones del select de vehículos
    var vehicleSelect = document.getElementById('booking-select-vehicle');
    if (vehicleSelect) {
        var currentValue = vehicleSelect.value;
        
        vehicleSelect.innerHTML = '';
        
        var defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.id = 'booking-vehicle-default';
        defaultOption.innerText = textos['booking-vehicle-default'];
        vehicleSelect.appendChild(defaultOption);
        
        var allowedVehicles = [
            { value: 'sedan', id: 'booking-vehicle-sedan', text: textos['booking-vehicle-sedan'] },
            { value: 'convertible', id: 'booking-vehicle-convertible', text: textos['booking-vehicle-convertible'] },
            { value: 'suv', id: 'booking-vehicle-suv', text: textos['booking-vehicle-suv'] },
            { value: 'pickup', id: 'booking-vehicle-pickup', text: textos['booking-vehicle-pickup'] },
            { value: 'van', id: 'booking-vehicle-van', text: textos['booking-vehicle-van'] }
        ];
        
        for (var j = 0; j < allowedVehicles.length; j++) {
            var option = document.createElement('option');
            option.value = allowedVehicles[j].value;
            option.id = allowedVehicles[j].id;
            option.innerText = allowedVehicles[j].text;
            vehicleSelect.appendChild(option);
        }
        
        if (currentValue && (currentValue === 'sedan' || currentValue === 'convertible' || currentValue === 'suv' || currentValue === 'pickup' || currentValue === 'van')) {
            vehicleSelect.value = currentValue;
        }
    }
    
    // Actualizar etiquetas del formulario de reserva
    var bookingLabels = document.querySelectorAll('#bookingStep1 .form-group label .label-text');
    if (bookingLabels.length >= 6) {
        if (bookingLabels[0] && textos['booking-label-service']) bookingLabels[0].innerText = textos['booking-label-service'];
        if (bookingLabels[1] && textos['booking-label-vehicle']) bookingLabels[1].innerText = textos['booking-label-vehicle'];
        if (bookingLabels[2] && textos['booking-label-date']) bookingLabels[2].innerText = textos['booking-label-date'];
        if (bookingLabels[3] && textos['booking-label-time']) bookingLabels[3].innerText = textos['booking-label-time'];
        if (bookingLabels[4] && textos['booking-label-notes']) bookingLabels[4].innerText = textos['booking-label-notes'];
        if (bookingLabels[5] && textos['booking-label-price']) bookingLabels[5].innerText = textos['booking-label-price'];
    }
    
    // Actualizar placeholders
    var dateInput = document.getElementById('booking-input-date');
    if (dateInput && textos['booking-label-date']) dateInput.placeholder = textos['booking-label-date'];
    
    var timeInput = document.getElementById('booking-input-time');
    if (timeInput && textos['booking-label-time']) timeInput.placeholder = textos['booking-label-time'];
    
    var notesTextarea = document.getElementById('booking-textarea-notes');
    if (notesTextarea && textos['booking-label-notes']) notesTextarea.placeholder = textos['booking-label-notes'];
    
    // Actualizar nota de horario
    var timeNote = document.getElementById('booking-time-note');
    if (timeNote && textos['booking-time-note']) timeNote.innerText = textos['booking-time-note'];
    
    // Actualizar texto del botón
    var bookingBtn = document.getElementById('booking-btn');
    if (bookingBtn && textos['booking-btn']) bookingBtn.innerText = textos['booking-btn'];
    
    // Actualizar textos del paso de pago
    var paymentStep2Title = document.getElementById('payment-step2-title');
    if (paymentStep2Title && textos['payment-step2-title']) paymentStep2Title.innerText = textos['payment-step2-title'];
    
    var paymentPaypalTitle = document.getElementById('payment-paypal-title');
    if (paymentPaypalTitle && textos['payment-paypal-title']) paymentPaypalTitle.innerText = textos['payment-paypal-title'];
    
    var paymentPaypalDesc = document.getElementById('payment-paypal-desc');
    if (paymentPaypalDesc && textos['payment-paypal-desc']) paymentPaypalDesc.innerText = textos['payment-paypal-desc'];
    
    var paymentCashTitle = document.getElementById('payment-cash-title');
    if (paymentCashTitle && textos['payment-cash-title']) paymentCashTitle.innerText = textos['payment-cash-title'];
    
    var paymentCashDesc = document.getElementById('payment-cash-desc');
    if (paymentCashDesc && textos['payment-cash-desc']) paymentCashDesc.innerText = textos['payment-cash-desc'];
    
    var paymentBackBtn = document.getElementById('payment-back-btn');
    if (paymentBackBtn && textos['payment-back-btn']) paymentBackBtn.innerText = textos['payment-back-btn'];
}

function cambiarIdioma(idioma) {
    localStorage.setItem('idioma', idioma);
    actualizarIdioma();
    actualizarDisponibilidad();
}

function detectarIdiomaNavegador() {
    var lang = navigator.language || navigator.userLanguage;
    return lang.startsWith('es') ? 'es' : 'en';
}

// =============================================
// FUNCIONES DE TEMA
// =============================================
function toggleTema() {
    var checkbox = document.getElementById('themeToggle');
    if (checkbox && checkbox.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('tema', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('tema', 'light');
    }
}

function inicializarTema() {
    var temaGuardado = localStorage.getItem('tema');
    var checkbox = document.getElementById('themeToggle');
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
    var emailGuardado = localStorage.getItem('clienteEmail');
    if (emailGuardado) {
        var clienteGuardado = localStorage.getItem('clienteActual');
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
    var idioma = localStorage.getItem('idioma') || 'es';
    var formContainer = document.querySelector('#registro .form-container');
    if (!formContainer) return;
    
    var vehiculosHtml = '';
    for (var i = 1; i <= MAX_VEHICULOS; i++) {
        var esObligatorio = i === 1 ? 'required' : '';
        var textObligatorio = i === 1 ? ' *' : ' (opcional)';
        vehiculosHtml += `
            <div class="vehiculo-group" style="border: 1px solid var(--border-color, #ddd); border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem;" id="vehiculo-group-${i}">
                <h4 style="color: var(--accent-gold);"><i class="fas fa-car"></i> ${idioma === 'es' ? 'Vehículo ' + i : 'Vehicle ' + i}${i === 1 ? ' *' : ' (opcional)'}</h4>
                <div class="form-group">
                    <label>${idioma === 'es' ? 'Marca y Modelo' : 'Make and Model'} ${i}${textObligatorio}</label>
                    <input type="text" class="form-control" id="vehiculo-marca-${i}" placeholder="${idioma === 'es' ? 'Ej: Honda Civic' : 'Ex: Honda Civic'}" ${esObligatorio}>
                </div>
                <div class="form-group">
                    <label>${idioma === 'es' ? 'Año' : 'Year'} ${i}</label>
                    <input type="number" class="form-control" id="vehiculo-anio-${i}" placeholder="${idioma === 'es' ? 'Ej: 2020' : 'Ex: 2020'}">
                </div>
                <div class="form-group">
                    <label>${idioma === 'es' ? 'Matrícula/Placa' : 'License Plate'} ${i}${textObligatorio}</label>
                    <input type="text" class="form-control" id="vehiculo-placa-${i}" placeholder="${idioma === 'es' ? 'Ej: ABC-1234' : 'Ex: ABC-1234'}" ${esObligatorio}>
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
            <p style="font-size: 0.9rem; margin-bottom: 1rem;">${idioma === 'es' ? 'El primer vehículo es obligatorio. Los demás son opcionales.' : 'The first vehicle is required. Others are optional.'}</p>
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
    var idioma = localStorage.getItem('idioma') || 'es';
    
    var nombre = document.getElementById('register-nombre').value;
    var email = document.getElementById('register-email').value;
    var telefono = document.getElementById('register-telefono').value;
    var direccion = document.getElementById('register-direccion').value;
    
    var vehiculos = [];
    var primerVehiculoModelo = '';
    var primerVehiculoAnio = '';
    var primerVehiculoPlaca = '';
    
    for (var i = 1; i <= MAX_VEHICULOS; i++) {
        var marca = document.getElementById('vehiculo-marca-' + i) ? document.getElementById('vehiculo-marca-' + i).value.trim() : '';
        var anio = document.getElementById('vehiculo-anio-' + i) ? document.getElementById('vehiculo-anio-' + i).value.trim() : '';
        var placa = document.getElementById('vehiculo-placa-' + i) ? document.getElementById('vehiculo-placa-' + i).value.trim() : '';
        
        if (i === 1) {
            if (!marca || !placa) {
                alert(idioma === 'es' ? 'El primer vehículo debe tener marca y placa' : 'The first vehicle must have make and license plate');
                return;
            }
            primerVehiculoModelo = marca;
            primerVehiculoAnio = anio;
            primerVehiculoPlaca = placa;
            vehiculos.push({ marca: marca, modelo: marca, anio: anio, placa: placa });
        } else {
            if (marca && placa) {
                vehiculos.push({ marca: marca, modelo: marca, anio: anio, placa: placa });
            }
        }
    }
    
    var clienteData = {
        nombre: nombre,
        email: email,
        telefono: telefono,
        direccion: direccion,
        modelo: primerVehiculoModelo,
        anio: primerVehiculoAnio,
        placa: primerVehiculoPlaca
    };
    
    console.log('📤 Enviando datos al backend:', clienteData);
    
    fetch(BACKEND_URL + '/api/clientes', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(clienteData)
    })
    .then(function(res) {
        console.log('📊 Status:', res.status);
        if (!res.ok) {
            return res.text().then(function(text) {
                console.error('Error response:', text);
                throw new Error('HTTP ' + res.status + ': ' + text);
            });
        }
        return res.json();
    })
    .then(function(data) {
        console.log('✅ Registro exitoso:', data);
        localStorage.setItem('clienteActual', JSON.stringify({ 
            nombre: nombre, 
            email: email, 
            telefono: telefono, 
            direccion: direccion, 
            vehiculos: vehiculos 
        }));
        localStorage.setItem('clienteEmail', email);
        alert(idioma === 'es' 
            ? '✅ Registro exitoso. Has registrado ' + vehiculos.length + ' vehículo(s).'
            : '✅ Registration successful. You have registered ' + vehiculos.length + ' vehicle(s).');
        location.reload();
    })
    .catch(function(err) {
        console.error('❌ Error en registro:', err);
        alert(idioma === 'es' 
            ? 'Error al registrar: ' + err.message 
            : 'Registration error: ' + err.message);
    });
}

// =============================================
// FUNCIÓN: mostrarSelectorVehiculosEnReserva
// =============================================
function mostrarSelectorVehiculosEnReserva() {
    var precioContainer = document.getElementById('precioCalculadoContainer');
    if (!precioContainer) return;
    
    if (vehiculosRegistrados.length > 0 && !document.getElementById('vehiculo-selector')) {
        var idioma = localStorage.getItem('idioma') || 'es';
        var selectorHtml = `
            <div class="form-group">
                <label>${idioma === 'es' ? 'Selecciona el vehículo para este servicio' : 'Select the vehicle for this service'} *</label>
                <select id="vehiculo-selector" class="form-control" required>
                    <option value="">${idioma === 'es' ? 'Selecciona un vehículo' : 'Select a vehicle'}</option>
        `;
        for (var i = 0; i < vehiculosRegistrados.length; i++) {
            var v = vehiculosRegistrados[i];
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
    var precios = document.querySelectorAll('.service-price');
    for (var i = 0; i < precios.length; i++) {
        precios[i].style.display = 'none';
    }
}

// =============================================
// FUNCIÓN: guardarRegistro (original - por compatibilidad)
// =============================================
function guardarRegistro(event) {
    event.preventDefault();
    var idioma = localStorage.getItem('idioma') || 'es';
    alert(idioma === 'es' 
        ? 'Usa el formulario de registro completo en la sección "Registro"'
        : 'Use the complete registration form in the "Register" section');
}

// =============================================
// FUNCIÓN: calcularPrecioFinal
// =============================================
function calcularPrecioFinal(servicioOption, tipoVehiculo) {
    var servicioNombre = servicioOption.value;
    var precios = PRECIOS_BASE[servicioNombre];
    
    if (!precios) {
        console.error('Servicio no encontrado:', servicioNombre);
        return '0';
    }
    
    var precioBase = precios[1];
    
    var incremento = 0;
    if (servicioNombre === 'Express Detail') {
        incremento = INCREMENTOS_EXPRESS[tipoVehiculo] || 0;
    } else {
        incremento = INCREMENTOS_STANDARD[tipoVehiculo] || 0;
    }
    
    var precioFinal = precioBase + incremento;
    return precioFinal.toString();
}

// =============================================
// FUNCIÓN: procesarReserva
// =============================================
function procesarReserva(event) {
    event.preventDefault();
    var idioma = localStorage.getItem('idioma') || 'es';
    
    if (!verificarClienteExistente()) {
        alert(idioma === 'es' 
            ? '⚠️ Debes registrarte antes de hacer una reserva.'
            : '⚠️ You must register before making a booking.');
        window.location.href = '#registro';
        return false;
    }
    
    var vehiculoSelector = document.getElementById('vehiculo-selector');
    if (!vehiculoSelector || !vehiculoSelector.value) {
        alert(idioma === 'es'
            ? '⚠️ Por favor selecciona un vehículo registrado.'
            : '⚠️ Please select a registered vehicle.');
        return false;
    }
    
    var matriculaSeleccionada = vehiculoSelector.value;
    var vehiculoSeleccionado = null;
    for (var i = 0; i < vehiculosRegistrados.length; i++) {
        if (vehiculosRegistrados[i].placa === matriculaSeleccionada) {
            vehiculoSeleccionado = vehiculosRegistrados[i];
            break;
        }
    }
    
    var hora = document.getElementById('booking-input-time') ? document.getElementById('booking-input-time').value : null;
    if (!hora || hora < HORARIO_INICIO || hora > HORARIO_FIN) {
        alert(idioma === 'es' 
            ? '❌ Horario no válido. Atendemos de 7:00 AM a 5:30 PM.'
            : '❌ Invalid time. We are open from 7:00 AM to 5:30 PM.');
        return false;
    }
    
    var fecha = document.getElementById('booking-input-date') ? document.getElementById('booking-input-date').value : null;
    if (!fecha) return false;
    
    if (obtenerReservasPorFecha(fecha).length >= MAX_ORDENES_DIARIAS) {
        alert(idioma === 'es' 
            ? '❌ No hay cupos disponibles para esta fecha.'
            : '❌ No slots available for this date.');
        return false;
    }
    
    var servicioSelect = document.getElementById('booking-select-service');
    var tipoVehiculo = document.getElementById('booking-select-vehicle') ? document.getElementById('booking-select-vehicle').value : null;
    var notas = document.getElementById('booking-textarea-notes') ? document.getElementById('booking-textarea-notes').value : '';
    
    var precioFinal = calcularPrecioFinal(servicioSelect.options[servicioSelect.selectedIndex], tipoVehiculo);
    
    var reserva = {
        servicio: servicioSelect.value,
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
    
    console.log('📤 Enviando reserva:', reserva);
    
    fetch(BACKEND_URL + '/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reserva)
    })
    .then(function(res) {
        if (!res.ok) return res.text().then(function(text) { throw new Error('HTTP ' + res.status + ': ' + text); });
        return res.json();
    })
    .then(function(data) {
        var reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        reservas.push(reserva);
        localStorage.setItem('reservas', JSON.stringify(reservas));
        
        var ticket = generarTicket(reserva, clienteActualGlobal);
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
        console.error('Error en reserva:', err);
        alert(idioma === 'es'
            ? '⚠️ Reserva guardada localmente, pero hubo un problema con el servidor. Error: ' + err.message
            : '⚠️ Booking saved locally, but there was a server problem. Error: ' + err.message);
    });
    
    var bookingForm = document.getElementById('bookingForm');
    if (bookingForm) bookingForm.reset();
    actualizarDisponibilidad();
    return false;
}

function obtenerReservasPorFecha(fecha) {
    var reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    var resultado = [];
    for (var i = 0; i < reservas.length; i++) {
        if (reservas[i].fecha === fecha) resultado.push(reservas[i]);
    }
    return resultado;
}

function actualizarDisponibilidad() {
    var fechaInput = document.getElementById('booking-input-date');
    if (!fechaInput || !fechaInput.value) return;
    
    var fecha = fechaInput.value;
    var reservasDia = obtenerReservasPorFecha(fecha);
    var disponibles = MAX_ORDENES_DIARIAS - reservasDia.length;
    var msgDiv = document.getElementById('availabilityMessage');
    if (!msgDiv) return;
    
    var idioma = localStorage.getItem('idioma') || 'es';
    
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

function enviarWhatsApp(mensaje) {
    var mensajeCodificado = encodeURIComponent(mensaje);
    var url = 'https://api.whatsapp.com/send?phone=' + TELEFONO_PROPIETARIO + '&text=' + mensajeCodificado;
    window.open(url, '_blank');
}

function generarTicket(reserva, cliente) {
    var idioma = localStorage.getItem('idioma') || 'es';
    var linea = '══════════════════════════════';
    var sep = '──────────────────────────';
    var tipo = tipoVehiculoTexto[reserva.tipoVehiculo] || reserva.tipoVehiculo;
    var precio = reserva.precio;
    if (precio && precio.indexOf('$') === -1) precio = '$' + precio;
    var matricula = reserva.matricula || 'No especificada';
    var vehiculoMarca = (reserva.vehiculoInfo && reserva.vehiculoInfo.marca) || 'No especificado';
    var vehiculoAnio = (reserva.vehiculoInfo && reserva.vehiculoInfo.anio) || 'N/E';
    
    if (idioma === 'es') {
        return '🔔 NUEVA RESERVA 🔔\n' + linea + '\n👤 CLIENTE\n' + sep + '\n📌 ' + cliente.nombre + '\n📧 ' + cliente.email + '\n📞 ' + cliente.telefono + '\n🏠 ' + cliente.direccion + '\n' + sep + '\n🚗 VEHÍCULO\n' + sep + '\n🔢 Tipo: ' + tipo + '\n🚙 Marca/Modelo: ' + vehiculoMarca + '\n🔖 Placa: ' + matricula + '\n📅 Año: ' + vehiculoAnio + '\n' + sep + '\n📋 SERVICIO\n' + sep + '\n🛠️ ' + reserva.servicio + '\n💰 ' + precio + '\n📅 Fecha: ' + reserva.fecha + '\n⏰ Hora: ' + reserva.hora + '\n📝 Notas: ' + (reserva.notas || 'Ninguna') + '\n' + sep + '\n💰 TOTAL: ' + precio + '\n' + linea + '\n📍 Servicio a domicilio\n📞 +1 (713) 928-0466';
    } else {
        return '🔔 NEW BOOKING 🔔\n' + linea + '\n👤 CUSTOMER\n' + sep + '\n📌 ' + cliente.nombre + '\n📧 ' + cliente.email + '\n📞 ' + cliente.telefono + '\n🏠 ' + cliente.direccion + '\n' + sep + '\n🚗 VEHICLE\n' + sep + '\n🔢 Type: ' + tipo + '\n🚙 Make/Model: ' + vehiculoMarca + '\n🔖 Plate: ' + matricula + '\n📅 Year: ' + vehiculoAnio + '\n' + sep + '\n📋 SERVICE\n' + sep + '\n🛠️ ' + reserva.servicio + '\n💰 ' + precio + '\n📅 Date: ' + reserva.fecha + '\n⏰ Time: ' + reserva.hora + '\n📝 Notes: ' + (reserva.notas || 'None') + '\n' + sep + '\n💰 TOTAL: ' + precio + '\n' + linea + '\n📍 Mobile service\n📞 +1 (713) 928-0466';
    }
}

function volverAlFormulario() {
    var step2 = document.getElementById('bookingStep2');
    var step1 = document.getElementById('bookingStep1');
    if (step2) step2.classList.add('hidden');
    if (step1) step1.classList.remove('hidden');
}

function procesarPagoPayPal() { 
    var idioma = localStorage.getItem('idioma') || 'es';
    alert(idioma === 'es' ? 'Redirigiendo a PayPal...' : 'Redirecting to PayPal...'); 
}

function procesarPagoEfectivo() { 
    var idioma = localStorage.getItem('idioma') || 'es';
    alert(idioma === 'es' ? 'Reserva confirmada para pago en efectivo.' : 'Booking confirmed for cash payment.'); 
}

function mostrarQRExterno() {
    var qrContainer = document.getElementById('qrCode');
    if (!qrContainer) return;
    qrContainer.innerHTML = '';
    var img = document.createElement('img');
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
    
    var idiomaGuardado = localStorage.getItem('idioma');
    var idiomaDetectado = detectarIdiomaNavegador();
    
    actualizarIdioma();
    if (idiomaGuardado) {
        cambiarIdioma(idiomaGuardado);
    } else {
        cambiarIdioma(idiomaDetectado);
    }
    
    ocultarPreciosServicios();
    
    if (!verificarClienteExistente()) {
        mostrarFormularioRegistroCompleto();
    } else {
        mostrarSelectorVehiculosEnReserva();
        var registerForm = document.getElementById('registerForm');
        if (registerForm) registerForm.style.display = 'none';
    }
    
    var horaInput = document.getElementById('booking-input-time');
    if (horaInput) {
        horaInput.min = HORARIO_INICIO;
        horaInput.max = HORARIO_FIN;
        horaInput.step = "1800";
    }
    
    var fechaInput = document.getElementById('booking-input-date');
    if (fechaInput) fechaInput.addEventListener('change', actualizarDisponibilidad);
    
    mostrarQRExterno();
    
    var btnEnglish = document.getElementById('btnEnglish');
    var btnSpanish = document.getElementById('btnSpanish');
    
    if (btnEnglish) {
        btnEnglish.onclick = function() { cambiarIdioma('en'); };
    }
    if (btnSpanish) {
        btnSpanish.onclick = function() { cambiarIdioma('es'); };
    }
    
    // CONFIGURAR SWITCH DE TEMA (MODO OSCURO)
    var themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTema);
    }
    
    // Sincronizar tema entre pestañas
    window.addEventListener('storage', function(e) {
        if (e.key === 'idioma') actualizarIdioma();
        if (e.key === 'tema') inicializarTema();
    });
    
    console.log('✅ Configuración completada');
};