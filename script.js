// =============================================
// DETAILING TEAM - SCRIPT PRINCIPAL
// =============================================
// VERSIÓN: 11.9 (CORREGIDO)
// FECHA: 27/07/2026
// 
// CAMBIOS REALIZADOS EN ESTA VERSIÓN:
// 1. Traducción completa al inglés (todas las claves y mensajes de alerta)
// 2. Corrección del contador de visitas (se ejecuta correctamente en cada carga)
// 3. Eliminado el contador de reservas del frontend
// 4. Flujo de reserva: sin pago, solo WhatsApp al dueño
// 5. Código documentado y optimizado
// =============================================

// =============================================
// CONSTANTES GLOBALES
// =============================================
const MAX_ORDENES_DIARIAS = 30;
const TELEFONO_PROPIETARIO = "17139280466";
const MAX_VEHICULOS = 3;

// 🔥 BACKEND URL FIJA (SIEMPRE USA RENDER)
const BACKEND_URL = 'https://detailingteam.onrender.com';
console.log('📡 BACKEND_URL configurada (fija a Render):', BACKEND_URL);

// =============================================
// MATRIZ DE PRECIOS POR SERVICIO Y TIPO DE VEHÍCULO
// =============================================
const PRECIOS_MATRIZ = {
    'Express Detail': {
        'sedan': 100,
        'coupe': 110,
        'convertible': 120,
        'suv': 140,
        'pickup': 150,
        'van': 160
    },
    'Silver Package': {
        'sedan': 150,
        'coupe': 160,
        'convertible': 170,
        'suv': 190,
        'pickup': 200,
        'van': 220
    },
    'Gold Package': {
        'sedan': 200,
        'coupe': 210,
        'convertible': 220,
        'suv': 240,
        'pickup': 260,
        'van': 280
    },
    'Diamond Package': {
        'sedan': 280,
        'coupe': 290,
        'convertible': 300,
        'suv': 320,
        'pickup': 340,
        'van': 360
    },
    'Ceramic 1 Year': {
        'sedan': 700,
        'coupe': 720,
        'convertible': 740,
        'suv': 900,
        'pickup': 950,
        'van': 1000
    },
    'Ceramic 3 Years': {
        'sedan': 950,
        'coupe': 980,
        'convertible': 1000,
        'suv': 1300,
        'pickup': 1350,
        'van': 1400
    },
    'Ceramic 5 Years': {
        'sedan': 1500,
        'coupe': 1550,
        'convertible': 1600,
        'suv': 1800,
        'pickup': 1900,
        'van': 2000
    }
};

// =============================================
// AGREGADOS/EXTRAS (precio fijo)
// =============================================
const AGREGADOS = {
    'pulido_faros': { es: 'Pulido de Faros', en: 'Headlight Polishing', precio: 50 },
    'limpieza_tapizados': { es: 'Limpieza de Tapizados', en: 'Upholstery Cleaning', precio: 60 },
    'ozonizado': { es: 'Ozonizado (eliminación olores)', en: 'Ozonization (odor removal)', precio: 40 },
    'tratamiento_cuero': { es: 'Tratamiento de Cuero', en: 'Leather Treatment', precio: 80 },
    'cera_extra': { es: 'Aplicación de Cera Extra', en: 'Extra Wax Application', precio: 30 }
};

// =============================================
// TRADUCCIONES DE DESCRIPCIONES DE SERVICIOS (para páginas de detalle)
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
// VARIABLES GLOBALES
// =============================================
let clienteActualGlobal = null;
let vehiculosRegistrados = [];

// =============================================
// OBJETO PARA MAPEAR TIPOS DE VEHÍCULO A TEXTO
// =============================================
const tipoVehiculoTexto = {
    'sedan': '🚗 Sedán',
    'coupe': '🏎️ Coupé',
    'convertible': '🏎️ Convertible',
    'suv': '🚙 SUV',
    'pickup': '🛻 Pickup',
    'van': '🚐 Van / Minivan'
};

// =============================================
// TEXTO COMPLETO PARA TICKET
// =============================================
const tipoVehiculoTicket = {
    'sedan': '🚗 Sedán (4 puertas, 5 asientos)',
    'coupe': '🏎️ Coupé (2 puertas, 4 asientos)',
    'convertible': '🏎️ Convertible / Descapotable (2 puertas, 2-4 asientos)',
    'suv': '🚙 SUV (5-7 asientos)',
    'pickup': '🛻 Pickup (2-5 asientos)',
    'van': '🚐 Van / Minivan (7-8 asientos)'
};

// =============================================
// TEXTOS EN INGLÉS (con claves para páginas de detalle)
// =============================================
const textosIndexEn = {
    'page-title': 'Detailing Team TX - Excellence in Shine',
    'nav-services': 'Services',
    'nav-gallery': 'Gallery',
    'nav-register': 'Register',
    'nav-bookings': 'Bookings',
    'nav-contact': 'Contact',
    'header-logo': 'Detailing Team Logo',
    'services-title': '✨ Professional Services ✨',
    'services-description': '🌟 The shine your car deserves, the protection it needs. Competitive prices in Houston, TX. 🌟',
    'schedule-title': '🕒 Business Hours',
    'schedule-text': '<strong>24/7 - Every day of the year</strong>',
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
    'booking-description': 'Choose service, vehicle type and extras. We will confirm via WhatsApp instantly.',
    'booking-label-service': 'Service *',
    'booking-service-default': 'Select a service',
    'booking-service-express': 'Express Detail',
    'booking-service-silver': 'Silver Package',
    'booking-service-gold': 'Gold Package',
    'booking-service-diamond': 'Diamond Package',
    'booking-service-ceramic1': 'Ceramic 1 Year',
    'booking-service-ceramic3': 'Ceramic 3 Years',
    'booking-service-ceramic5': 'Ceramic 5 Years',
    'booking-label-vehicle': 'Vehicle Type *',
    'booking-vehicle-default': 'Select vehicle type',
    'booking-vehicle-sedan': '🚗 Sedan (4 doors, 5 seats)',
    'booking-vehicle-coupe': '🏎️ Coupe (2 doors, 4 seats)',
    'booking-vehicle-convertible': '🏎️ Convertible (2 doors, 2-4 seats)',
    'booking-vehicle-suv': '🚙 SUV (5-7 seats)',
    'booking-vehicle-pickup': '🛻 Pickup (2-5 seats)',
    'booking-vehicle-van': '🚐 Van / Minivan (7-8 seats)',
    'booking-label-date': 'Date *',
    'booking-label-time': 'Time *',
    'booking-time-note': '24/7 - Always open',
    'booking-label-notes': 'Additional Notes',
    'booking-textarea-notes': 'Any special instructions...',
    'booking-label-extras': 'Extras (optional)',
    'booking-label-price': 'Final price:',
    // ✅ CAMBIO: Botón ahora dice "Continue with Booking"
    'booking-btn': 'Continue with Booking',
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
    'copyright-security': 'By using this site, you accept our privacy and security practices.',
    'header-visits-label': 'visits this month',
    // Claves para páginas de detalle
    'service-description-title': 'Service Description',
    'prices-title': 'Prices',
    'price-basic-title': 'Basic finish',
    'price-premium-title': 'Premium finish',
    'price-note-basic': '(Base price - Sedan)',
    'price-note-premium': '(Base price - Sedan)',
    'additional-info-text': 'Large vehicles (SUV, Pickup, Van): Additional price',
    'back-button': 'Back to Services'
};

// =============================================
// TEXTOS EN ESPAÑOL (con claves para páginas de detalle)
// =============================================
const textosIndexEs = {
    'page-title': 'Detailing Team TX - Excelencia en Brillo',
    'nav-services': 'Servicios',
    'nav-gallery': 'Galería',
    'nav-register': 'Registro',
    'nav-bookings': 'Reservas',
    'nav-contact': 'Contacto',
    'header-logo': 'Detailing Team Logo',
    'services-title': '✨ Servicios Profesionales ✨',
    'services-description': '🌟 El brillo que tu auto merece, la protección que necesita. Precios competitivos en Houston, TX. 🌟',
    'schedule-title': '🕒 Horario de atención',
    'schedule-text': '<strong>24/7 - Todos los días del año</strong>',
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
    'booking-description': 'Elige servicio, tipo de vehículo y extras. Te confirmaremos por WhatsApp al instante.',
    'booking-label-service': 'Servicio *',
    'booking-service-default': 'Selecciona un servicio',
    'booking-service-express': 'Express Detail',
    'booking-service-silver': 'Silver Package',
    'booking-service-gold': 'Gold Package',
    'booking-service-diamond': 'Diamond Package',
    'booking-service-ceramic1': 'Ceramic 1 Year',
    'booking-service-ceramic3': 'Ceramic 3 Years',
    'booking-service-ceramic5': 'Ceramic 5 Years',
    'booking-label-vehicle': 'Tipo de vehículo *',
    'booking-vehicle-default': 'Selecciona tipo de vehículo',
    'booking-vehicle-sedan': '🚗 Sedán (4 puertas, 5 asientos)',
    'booking-vehicle-coupe': '🏎️ Coupé (2 puertas, 4 asientos)',
    'booking-vehicle-convertible': '🏎️ Convertible / Descapotable (2 puertas, 2-4 asientos)',
    'booking-vehicle-suv': '🚙 SUV (5-7 asientos)',
    'booking-vehicle-pickup': '🛻 Pickup (2-5 asientos)',
    'booking-vehicle-van': '🚐 Van / Minivan (7-8 asientos)',
    'booking-label-date': 'Fecha *',
    'booking-label-time': 'Hora *',
    'booking-time-note': '24/7 - Siempre abiertos',
    'booking-label-notes': 'Notas adicionales',
    'booking-textarea-notes': 'Alguna indicación especial...',
    'booking-label-extras': 'Extras (opcional)',
    'booking-label-price': 'Precio final:',
    // ✅ CAMBIO: Botón ahora dice "Continuar con la Reserva"
    'booking-btn': 'Continuar con la Reserva',
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
    'copyright-security': 'Al usar este sitio, aceptas nuestras prácticas de privacidad y seguridad.',
    'header-visits-label': 'visitas este mes',
    // Claves para páginas de detalle
    'service-description-title': 'Descripción del Servicio',
    'prices-title': 'Precios',
    'price-basic-title': 'Sin acabado interior',
    'price-premium-title': 'Con acabado completo',
    'price-note-basic': '(Precio base - Sedán)',
    'price-note-premium': '(Precio base - Sedán)',
    'additional-info-text': 'Vehículos grandes (SUV, Pickup, Van): Consultar precio adicional',
    'back-button': 'Volver a Servicios'
};

// =============================================
// FUNCIÓN: getServiceNameFromPage
// =============================================
// Detecta el nombre del servicio según la URL de la página actual.
// Retorna el nombre del servicio o null si no está en una página de detalle.
// =============================================
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
    
    // Si no se detecta por URL, intentar por el título de la página
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
    
    return null;
}

// =============================================
// FUNCIÓN: actualizarPaginaDetalle
// =============================================
// Actualiza los textos de una página de detalle de servicio según el idioma.
// Usa serviceDescriptions, serviceListItems, serviceNotes y las claves de textosIndex.
// =============================================
function actualizarPaginaDetalle() {
    var idioma = localStorage.getItem('idioma') || 'es';
    var textos = idioma === 'en' ? textosIndexEn : textosIndexEs;
    
    // Detectar si estamos en una página de detalle
    var serviceName = getServiceNameFromPage();
    if (!serviceName) {
        // No es una página de detalle, salir
        return;
    }
    
    console.log('🔄 Actualizando página de detalle para:', serviceName, 'Idioma:', idioma);
    
    // Actualizar título "Descripción del Servicio"
    var descTitle = document.getElementById('service-description-title');
    if (descTitle && textos['service-description-title']) {
        descTitle.innerHTML = '<i class="fas fa-info-circle"></i> ' + textos['service-description-title'];
    }
    
    // Actualizar título "Precios"
    var pricesTitle = document.getElementById('prices-title');
    if (pricesTitle && textos['prices-title']) {
        pricesTitle.innerHTML = '<i class="fas fa-tag"></i> ' + textos['prices-title'];
    }
    
    // Actualizar descripción principal
    var descText = document.getElementById('service-description-text');
    if (descText && serviceDescriptions[serviceName]) {
        descText.innerText = serviceDescriptions[serviceName][idioma];
    }
    
    // Actualizar lista de ítems (service-include-1 a 6)
    if (serviceListItems[serviceName]) {
        var items = serviceListItems[serviceName][idioma];
        for (var i = 1; i <= items.length; i++) {
            var item = document.getElementById('service-include-' + i);
            if (item) {
                // Conservar el icono si existe
                var icon = item.querySelector('i');
                if (icon) {
                    item.innerHTML = '';
                    item.appendChild(icon);
                    item.appendChild(document.createTextNode(' ' + items[i-1]));
                } else {
                    item.innerText = items[i-1];
                }
            }
        }
    }
    
    // Actualizar nota del servicio
    var noteElem = document.getElementById('service-note');
    if (noteElem && serviceNotes[serviceName]) {
        var noteText = serviceNotes[serviceName][idioma];
        // Si tiene un <strong> dentro, mantenerlo
        var strong = noteElem.querySelector('strong');
        if (strong) {
            // Reemplazar solo el texto después del strong
            var prefix = noteElem.innerText.substring(0, noteElem.innerText.indexOf(strong.innerText) + strong.innerText.length);
            noteElem.innerHTML = prefix + ' ' + noteText.substring(noteText.indexOf(' ') + 1);
        } else {
            noteElem.innerHTML = '✨ ' + noteText;
        }
    }
    
    // Actualizar títulos de precios (basic y premium)
    var priceBasicTitle = document.getElementById('price-basic-title');
    if (priceBasicTitle && textos['price-basic-title']) {
        priceBasicTitle.innerText = textos['price-basic-title'];
    }
    var pricePremiumTitle = document.getElementById('price-premium-title');
    if (pricePremiumTitle && textos['price-premium-title']) {
        pricePremiumTitle.innerText = textos['price-premium-title'];
    }
    
    // Actualizar notas de precios
    var noteBasic = document.getElementById('price-note-basic');
    if (noteBasic && textos['price-note-basic']) {
        noteBasic.innerText = textos['price-note-basic'];
    }
    var notePremium = document.getElementById('price-note-premium');
    if (notePremium && textos['price-note-premium']) {
        notePremium.innerText = textos['price-note-premium'];
    }
    
    // Actualizar información adicional
    var additionalInfo = document.getElementById('additional-info-text');
    if (additionalInfo && textos['additional-info-text']) {
        var icon = additionalInfo.querySelector('i');
        var strong = additionalInfo.querySelector('strong');
        if (icon && strong) {
            var newText = textos['additional-info-text'];
            additionalInfo.innerHTML = '';
            additionalInfo.appendChild(icon.cloneNode(true));
            additionalInfo.appendChild(document.createTextNode(' '));
            var newStrong = document.createElement('strong');
            var strongText = newText.substring(0, newText.indexOf(':') + 1);
            newStrong.innerText = strongText;
            additionalInfo.appendChild(newStrong);
            additionalInfo.appendChild(document.createTextNode(' ' + newText.substring(newText.indexOf(':') + 1).trim()));
        } else {
            additionalInfo.innerText = textos['additional-info-text'];
        }
    }
    
    // Actualizar texto del botón "Reservar"
    var bookingBtnText = document.getElementById('booking-btn-text');
    if (bookingBtnText) {
        bookingBtnText.innerText = (idioma === 'es' ? 'Reservar' : 'Book') + ' ' + serviceName;
    }
    
    // Actualizar nota de acción
    var actionNote = document.getElementById('action-note');
    if (actionNote) {
        actionNote.innerText = (idioma === 'es' 
            ? 'Al reservar, selecciona "' + serviceName + '" en el formulario'
            : 'When booking, select "' + serviceName + '" in the form');
    }
    
    // Actualizar botón "Volver"
    var backBtn = document.getElementById('back-button');
    if (backBtn && textos['back-button']) {
        var icon = backBtn.querySelector('i');
        if (icon) {
            backBtn.innerHTML = '';
            backBtn.appendChild(icon.cloneNode(true));
            backBtn.appendChild(document.createTextNode(' ' + textos['back-button']));
        } else {
            backBtn.innerText = textos['back-button'];
        }
    }
    
    console.log('✅ Página de detalle actualizada al idioma:', idioma);
}

// =============================================
// FUNCIÓN: actualizarIdioma
// =============================================
function actualizarIdioma() {
    var idioma = localStorage.getItem('idioma') || 'es';
    var textos = idioma === 'en' ? textosIndexEn : textosIndexEs;
    
    // Actualizar elementos de la página principal (index.html)
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
    
    // ACTUALIZAR LABELS DE CONTADORES (solo visitas)
    var visitsLabel = document.getElementById('header-visits-label');
    if (visitsLabel && textos['header-visits-label']) {
        visitsLabel.innerText = textos['header-visits-label'];
    }
    
    document.title = textos['page-title'];
    
    var btnEnglish = document.getElementById('btnEnglish');
    var btnSpanish = document.getElementById('btnSpanish');
    if (btnEnglish) btnEnglish.classList.toggle('active', idioma === 'en');
    if (btnSpanish) btnSpanish.classList.toggle('active', idioma === 'es');
    
    document.documentElement.lang = idioma === 'en' ? 'en' : 'es';
    
    // Regenerar formularios SOLO si estamos en index.html (existen los elementos)
    var bookingStep1 = document.getElementById('bookingStep1');
    if (bookingStep1) {
        regenerarFormularioRegistro();
        regenerarFormularioReserva();
        actualizarPrecio();
    }
    
    // SIEMPRE actualizar la página de detalle si estamos en una
    actualizarPaginaDetalle();
    
    console.log('🌐 Idioma actualizado a:', idioma);
}

function cambiarIdioma(idioma) {
    localStorage.setItem('idioma', idioma);
    actualizarIdioma();
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
// FUNCIÓN: generarOpcionesAnios (1990 - 2050)
// =============================================
function generarOpcionesAnios(selected) {
    var html = '';
    for (var year = 2050; year >= 1990; year--) {
        var sel = (selected && selected == year) ? 'selected' : '';
        html += '<option value="' + year + '" ' + sel + '>' + year + '</option>';
    }
    return html;
}

// =============================================
// FUNCIÓN: mostrarFormularioRegistroCompleto
// =============================================
function mostrarFormularioRegistroCompleto() {
    var formContainer = document.querySelector('#registro .form-container');
    if (!formContainer) return; // Si no existe, salir (página de detalle)
    
    var idioma = localStorage.getItem('idioma') || 'es';
    
    var vehiculosHtml = '';
    for (var i = 1; i <= MAX_VEHICULOS; i++) {
        var esObligatorio = i === 1 ? 'required' : '';
        var textObligatorio = i === 1 ? ' *' : ' (opcional)';
        var opcionesAnios = generarOpcionesAnios('');
        vehiculosHtml += `
            <div class="vehiculo-group" style="border: 1px solid var(--border-color, #ddd); border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem;" id="vehiculo-group-${i}">
                <h4 style="color: var(--accent-gold);"><i class="fas fa-car"></i> ${idioma === 'es' ? 'Vehículo ' + i : 'Vehicle ' + i}${i === 1 ? ' *' : ' (opcional)'}</h4>
                <div class="form-group">
                    <label>${idioma === 'es' ? 'Marca y Modelo' : 'Make and Model'} ${i}${textObligatorio}</label>
                    <input type="text" class="form-control" id="vehiculo-marca-${i}" placeholder="${idioma === 'es' ? 'Ej: Honda Civic' : 'Ex: Honda Civic'}" ${esObligatorio}>
                </div>
                <div class="form-group">
                    <label>${idioma === 'es' ? 'Año' : 'Year'} ${i}</label>
                    <select class="form-control" id="vehiculo-anio-${i}">
                        <option value="">${idioma === 'es' ? 'Selecciona año' : 'Select year'}</option>
                        ${opcionesAnios}
                    </select>
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
        placa: primerVehiculoPlaca,
        vehiculos: vehiculos
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
// FUNCIÓN: regenerarFormularioRegistro
// =============================================
function regenerarFormularioRegistro() {
    var formContainer = document.querySelector('#registro .form-container');
    if (!formContainer) return;
    
    var idioma = localStorage.getItem('idioma') || 'es';
    var textos = idioma === 'en' ? textosIndexEn : textosIndexEs;
    
    var existingForm = document.getElementById('registerFormCompleto');
    if (existingForm) {
        var labels = document.querySelectorAll('#registerFormCompleto .form-group label');
        if (labels.length >= 4) {
            if (labels[0] && textos['register-label-name']) labels[0].innerHTML = textos['register-label-name'];
            if (labels[1] && textos['register-label-email']) labels[1].innerHTML = 'Email *';
            if (labels[2] && textos['register-label-phone']) labels[2].innerHTML = textos['register-label-phone'];
            if (labels[3] && textos['register-label-address']) labels[3].innerHTML = textos['register-label-address'];
        }
        
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
        
        var titleElement = document.querySelector('#registerFormCompleto h3');
        if (titleElement) {
            titleElement.innerText = idioma === 'es' 
                ? 'Datos de tus vehículos (máximo ' + MAX_VEHICULOS + ')'
                : 'Your vehicle data (max ' + MAX_VEHICULOS + ')';
        }
        
        var helpText = document.querySelector('#registerFormCompleto > p');
        if (helpText) {
            helpText.innerText = idioma === 'es'
                ? 'El primer vehículo es obligatorio. Los demás son opcionales.'
                : 'The first vehicle is required. Others are optional.';
        }
        
        for (var j = 1; j <= MAX_VEHICULOS; j++) {
            var vehiculoGroup = document.getElementById('vehiculo-group-' + j);
            if (vehiculoGroup) {
                var h4 = vehiculoGroup.querySelector('h4');
                if (h4) {
                    h4.innerHTML = '<i class="fas fa-car"></i> ' + (idioma === 'es' ? 'Vehículo ' + j : 'Vehicle ' + j) + (j === 1 ? ' *' : ' (opcional)');
                }
                
                var labelsGroup = vehiculoGroup.querySelectorAll('label');
                if (labelsGroup[0]) labelsGroup[0].innerHTML = (idioma === 'es' ? 'Marca y Modelo' : 'Make and Model') + ' ' + j + (j === 1 ? ' *' : ' (opcional)');
                if (labelsGroup[1]) labelsGroup[1].innerHTML = (idioma === 'es' ? 'Año' : 'Year') + ' ' + j;
                if (labelsGroup[2]) labelsGroup[2].innerHTML = (idioma === 'es' ? 'Matrícula/Placa' : 'License Plate') + ' ' + j + (j === 1 ? ' *' : ' (opcional)');
                
                var anioSelect = vehiculoGroup.querySelector('select[id^="vehiculo-anio-"]');
                if (anioSelect) {
                    var currentValue = anioSelect.value;
                    var opciones = generarOpcionesAnios(currentValue);
                    anioSelect.innerHTML = '<option value="">' + (idioma === 'es' ? 'Selecciona año' : 'Select year') + '</option>' + opciones;
                }
                
                var inputsGroup = vehiculoGroup.querySelectorAll('input');
                if (inputsGroup[0]) inputsGroup[0].placeholder = idioma === 'es' ? 'Ej: Honda Civic' : 'Ex: Honda Civic';
                if (inputsGroup[1]) inputsGroup[1].placeholder = idioma === 'es' ? 'Ej: ABC-1234' : 'Ex: ABC-1234';
            }
        }
        
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
    // Verificar que estamos en la página principal (existen los elementos)
    var serviceSelect = document.getElementById('booking-select-service');
    if (!serviceSelect) return;
    
    var idioma = localStorage.getItem('idioma') || 'es';
    var textos = idioma === 'en' ? textosIndexEn : textosIndexEs;
    
    // Actualizar opciones del select de servicios
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
    
    // Actualizar opciones del select de vehículos
    var vehicleSelect = document.getElementById('booking-select-vehicle');
    if (vehicleSelect) {
        var currentValue = vehicleSelect.value;
        
        vehicleSelect.innerHTML = '';
        
        var defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.id = 'booking-vehicle-default';
        defaultOpt.innerText = textos['booking-vehicle-default'];
        vehicleSelect.appendChild(defaultOpt);
        
        var allowedVehicles = [
            { value: 'sedan', id: 'booking-vehicle-sedan', text: textos['booking-vehicle-sedan'] },
            { value: 'coupe', id: 'booking-vehicle-coupe', text: textos['booking-vehicle-coupe'] },
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
        
        if (currentValue && (currentValue === 'sedan' || currentValue === 'coupe' || currentValue === 'convertible' || currentValue === 'suv' || currentValue === 'pickup' || currentValue === 'van')) {
            vehicleSelect.value = currentValue;
        }
    }
    
    // Actualizar etiquetas del formulario
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
    
    var timeNote = document.getElementById('booking-time-note');
    if (timeNote && textos['booking-time-note']) timeNote.innerText = textos['booking-time-note'];
    
    // ✅ CAMBIO: Texto del botón actualizado
    var bookingBtn = document.getElementById('booking-btn');
    if (bookingBtn && textos['booking-btn']) bookingBtn.innerText = textos['booking-btn'];
    
    regenerarAgregados();
}

// =============================================
// FUNCIÓN: regenerarAgregados
// =============================================
function regenerarAgregados() {
    var container = document.getElementById('extrasContainer');
    if (!container) return;
    
    var idioma = localStorage.getItem('idioma') || 'es';
    
    container.innerHTML = '';
    
    var label = document.createElement('span');
    label.className = 'label-text';
    label.id = 'booking-label-extras';
    label.innerText = idioma === 'es' ? 'Extras (opcional)' : 'Extras (optional)';
    container.appendChild(label);
    
    var extrasGrid = document.createElement('div');
    extrasGrid.className = 'extras-grid';
    
    for (var key in AGREGADOS) {
        var extra = AGREGADOS[key];
        var nombre = idioma === 'es' ? extra.es : extra.en;
        var precio = extra.precio;
        
        var labelCheck = document.createElement('label');
        labelCheck.className = 'extra-checkbox';
        
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'extra-input';
        input.dataset.key = key;
        input.dataset.precio = precio;
        input.onchange = actualizarPrecio;
        
        var span = document.createElement('span');
        span.className = 'extra-label';
        span.innerText = nombre + ' (+$' + precio + ')';
        
        labelCheck.appendChild(input);
        labelCheck.appendChild(span);
        extrasGrid.appendChild(labelCheck);
    }
    
    container.appendChild(extrasGrid);
}

// =============================================
// FUNCIÓN: actualizarPrecio
// =============================================
function actualizarPrecio() {
    var serviceSelect = document.getElementById('booking-select-service');
    var vehicleSelect = document.getElementById('booking-select-vehicle');
    var precioDiv = document.getElementById('precioCalculado');
    
    if (!serviceSelect || !vehicleSelect || !precioDiv) return;
    
    var servicio = serviceSelect.value;
    var vehiculo = vehicleSelect.value;
    
    if (!servicio || !vehiculo || !PRECIOS_MATRIZ[servicio]) {
        precioDiv.innerText = '$0';
        return;
    }
    
    var precioBase = PRECIOS_MATRIZ[servicio][vehiculo];
    if (precioBase === undefined) {
        precioDiv.innerText = '$0';
        return;
    }
    
    var total = precioBase;
    
    var extras = document.querySelectorAll('.extra-input:checked');
    for (var i = 0; i < extras.length; i++) {
        total += parseInt(extras[i].dataset.precio);
    }
    
    var idioma = localStorage.getItem('idioma') || 'es';
    precioDiv.innerText = '$' + total;
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
// FUNCIÓN: obtenerReservasPorFecha
// =============================================
function obtenerReservasPorFecha(fecha) {
    var reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    var resultado = [];
    for (var i = 0; i < reservas.length; i++) {
        if (reservas[i].fecha === fecha) resultado.push(reservas[i]);
    }
    return resultado;
}

// =============================================
// FUNCIÓN: enviarWhatsApp
// =============================================
function enviarWhatsApp(mensaje) {
    var mensajeCodificado = encodeURIComponent(mensaje);
    var url = 'https://api.whatsapp.com/send?phone=' + TELEFONO_PROPIETARIO + '&text=' + mensajeCodificado;
    window.open(url, '_blank');
}

// =============================================
// FUNCIÓN: generarTicket
// =============================================
function generarTicket(reserva, cliente) {
    var idioma = localStorage.getItem('idioma') || 'es';
    var linea = '══════════════════════════════';
    var sep = '──────────────────────────';
    var tipo = tipoVehiculoTicket[reserva.tipoVehiculo] || reserva.tipoVehiculo;
    var precio = '$' + reserva.precio;
    var matricula = reserva.matricula || 'No especificada';
    var vehiculoMarca = (reserva.vehiculoInfo && reserva.vehiculoInfo.marca) || 'No especificado';
    var vehiculoAnio = (reserva.vehiculoInfo && reserva.vehiculoInfo.anio) || 'N/E';
    var extrasTexto = reserva.extras && reserva.extras.length > 0 ? reserva.extras.join(', ') : 'Ninguno';
    
    if (idioma === 'es') {
        return '🔔 NUEVA RESERVA 🔔\n' + linea + '\n👤 CLIENTE\n' + sep + '\n📌 ' + cliente.nombre + '\n📧 ' + cliente.email + '\n📞 ' + cliente.telefono + '\n🏠 ' + cliente.direccion + '\n' + sep + '\n🚗 VEHÍCULO\n' + sep + '\n🔢 Tipo: ' + tipo + '\n🚙 Marca/Modelo: ' + vehiculoMarca + '\n🔖 Placa: ' + matricula + '\n📅 Año: ' + vehiculoAnio + '\n' + sep + '\n📋 SERVICIO\n' + sep + '\n🛠️ ' + reserva.servicio + '\n💰 Precio base: $' + reserva.precioBase + '\n➕ Extras: ' + extrasTexto + '\n💰 TOTAL: ' + precio + '\n📅 Fecha: ' + reserva.fecha + '\n⏰ Hora: ' + reserva.hora + '\n📝 Notas: ' + (reserva.notas || 'Ninguna') + '\n' + sep + '\n💰💰 TOTAL A PAGAR: ' + precio + '\n' + linea + '\n📍 Servicio a domicilio\n📞 +1 (713) 928-0466';
    } else {
        return '🔔 NEW BOOKING 🔔\n' + linea + '\n👤 CUSTOMER\n' + sep + '\n📌 ' + cliente.nombre + '\n📧 ' + cliente.email + '\n📞 ' + cliente.telefono + '\n🏠 ' + cliente.direccion + '\n' + sep + '\n🚗 VEHICLE\n' + sep + '\n🔢 Type: ' + tipo + '\n🚙 Make/Model: ' + vehiculoMarca + '\n🔖 Plate: ' + matricula + '\n📅 Year: ' + vehiculoAnio + '\n' + sep + '\n📋 SERVICE\n' + sep + '\n🛠️ ' + reserva.servicio + '\n💰 Base price: $' + reserva.precioBase + '\n➕ Extras: ' + extrasTexto + '\n💰 TOTAL: ' + precio + '\n📅 Date: ' + reserva.fecha + '\n⏰ Time: ' + reserva.hora + '\n📝 Notes: ' + (reserva.notas || 'None') + '\n' + sep + '\n💰💰 TOTAL TO PAY: ' + precio + '\n' + linea + '\n📍 Mobile service\n📞 +1 (713) 928-0466';
    }
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
// FUNCIÓN: procesarReserva (CORREGIDA)
// =============================================
// Cambios realizados:
// 1. Eliminado el paso de pago (bookingStep2)
// 2. El botón ahora dice "Continuar con la Reserva"
// 3. No envía emails, solo envía ticket por WhatsApp al dueño
// 4. Mensajes de alerta bilingües
// =============================================
function procesarReserva(event) {
    event.preventDefault();
    var idioma = localStorage.getItem('idioma') || 'es';
    
    // Validar que el cliente esté registrado
    if (!verificarClienteExistente()) {
        alert(idioma === 'es' 
            ? '⚠️ Debes registrarte antes de hacer una reserva.'
            : '⚠️ You must register before making a booking.');
        window.location.href = '#registro';
        return false;
    }
    
    // Validar que haya seleccionado un vehículo
    var vehiculoSelector = document.getElementById('vehiculo-selector');
    if (!vehiculoSelector || !vehiculoSelector.value) {
        alert(idioma === 'es'
            ? '⚠️ Por favor selecciona un vehículo registrado.'
            : '⚠️ Please select a registered vehicle.');
        return false;
    }
    
    // Obtener el vehículo seleccionado
    var matriculaSeleccionada = vehiculoSelector.value;
    var vehiculoSeleccionado = null;
    for (var i = 0; i < vehiculosRegistrados.length; i++) {
        if (vehiculosRegistrados[i].placa === matriculaSeleccionada) {
            vehiculoSeleccionado = vehiculosRegistrados[i];
            break;
        }
    }
    
    // Validar hora
    var hora = document.getElementById('booking-input-time') ? document.getElementById('booking-input-time').value : null;
    if (!hora) {
        alert(idioma === 'es' 
            ? '❌ Por favor selecciona una hora.'
            : '❌ Please select a time.');
        return false;
    }
    
    // Validar fecha
    var fecha = document.getElementById('booking-input-date') ? document.getElementById('booking-input-date').value : null;
    if (!fecha) {
        alert(idioma === 'es' 
            ? '❌ Por favor selecciona una fecha.'
            : '❌ Please select a date.');
        return false;
    }
    
    // Validar cupos disponibles
    if (obtenerReservasPorFecha(fecha).length >= MAX_ORDENES_DIARIAS) {
        alert(idioma === 'es' 
            ? '❌ No hay cupos disponibles para esta fecha.'
            : '❌ No slots available for this date.');
        return false;
    }
    
    // Obtener datos del formulario
    var servicioSelect = document.getElementById('booking-select-service');
    var tipoVehiculo = document.getElementById('booking-select-vehicle') ? document.getElementById('booking-select-vehicle').value : null;
    var notas = document.getElementById('booking-textarea-notes') ? document.getElementById('booking-textarea-notes').value : '';
    
    // Validar que haya seleccionado servicio y tipo de vehículo
    if (!servicioSelect.value || !tipoVehiculo) {
        alert(idioma === 'es' 
            ? '❌ Por favor selecciona un servicio y tipo de vehículo.'
            : '❌ Please select a service and vehicle type.');
        return false;
    }
    
    // Calcular precios
    var precioBase = PRECIOS_MATRIZ[servicioSelect.value] ? PRECIOS_MATRIZ[servicioSelect.value][tipoVehiculo] : 0;
    if (precioBase === undefined) precioBase = 0;
    
    var totalExtras = 0;
    var extrasSeleccionados = [];
    var extrasInputs = document.querySelectorAll('.extra-input:checked');
    for (var j = 0; j < extrasInputs.length; j++) {
        var key = extrasInputs[j].dataset.key;
        var precio = parseInt(extrasInputs[j].dataset.precio);
        totalExtras += precio;
        var extraInfo = AGREGADOS[key];
        extrasSeleccionados.push((idioma === 'es' ? extraInfo.es : extraInfo.en) + ' (+$' + precio + ')');
    }
    
    var precioFinal = precioBase + totalExtras;
    
    // Construir objeto de reserva
    var reserva = {
        servicio: servicioSelect.value,
        tipoVehiculo: tipoVehiculo,
        fecha: fecha,
        hora: hora,
        notas: notas,
        precio: precioFinal,
        precioBase: precioBase,
        extras: extrasSeleccionados,
        totalExtras: totalExtras,
        clienteEmail: clienteActualGlobal.email,
        matricula: matriculaSeleccionada,
        vehiculoInfo: vehiculoSeleccionado,
        metodoPago: 'Efectivo'
    };
    
    console.log('📤 Enviando reserva al backend:', reserva);
    
    // 1. Guardar reserva en la base de datos
    fetch(BACKEND_URL + '/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reserva)
    })
    .then(function(res) {
        if (!res.ok) {
            return res.text().then(function(text) {
                throw new Error('HTTP ' + res.status + ': ' + text);
            });
        }
        return res.json();
    })
    .then(function(data) {
        console.log('✅ Reserva guardada en el servidor:', data);
        
        // 2. Guardar en localStorage (copia local)
        var reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        reservas.push(reserva);
        localStorage.setItem('reservas', JSON.stringify(reservas));
        
        // 3. Generar ticket
        var ticket = generarTicket(reserva, clienteActualGlobal);
        console.log('📝 Ticket generado:\n', ticket);
        
        // 4. Enviar ticket por WhatsApp al dueño
        enviarWhatsApp(ticket);
        
        // 5. Mostrar mensaje de confirmación al usuario
        alert(idioma === 'es' 
            ? '✅ Reserva confirmada. Se ha enviado un ticket al dueño del servicio por WhatsApp.\n\n📋 Detalles de la reserva:\n' + ticket
            : '✅ Booking confirmed. A ticket has been sent to the service owner via WhatsApp.\n\n📋 Booking details:\n' + ticket);
        
        // 6. Reiniciar el formulario y actualizar contadores
        var bookingForm = document.getElementById('bookingForm');
        if (bookingForm) bookingForm.reset();
        document.getElementById('precioCalculado').innerText = '$0';
        
        // Actualizar contadores de visitas (para que se refleje la nueva reserva)
        if (typeof actualizarContadores === 'function') {
            actualizarContadores();
        }
        
        // Recargar la página para actualizar todo (opcional)
        // location.reload();
    })
    .catch(function(err) {
        console.error('❌ Error en reserva:', err);
        alert(idioma === 'es'
            ? '⚠️ La reserva se guardó localmente, pero hubo un problema con el servidor. Por favor, contacta al dueño directamente.\n\nError: ' + err.message
            : '⚠️ The booking was saved locally, but there was a server problem. Please contact the owner directly.\n\nError: ' + err.message);
        
        // Guardar localmente aunque falle el servidor
        var reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        reservas.push(reserva);
        localStorage.setItem('reservas', JSON.stringify(reservas));
        
        // Generar ticket y enviar WhatsApp igualmente
        var ticket = generarTicket(reserva, clienteActualGlobal);
        enviarWhatsApp(ticket);
    });
    
    return false;
}

// =============================================
// FUNCIÓN: registrarVisita (CORREGIDA)
// =============================================
// Se encarga de registrar una visita en el backend.
// Agregados logs para depuración.
// =============================================
function registrarVisita() {
    console.log('🔄 Intentando registrar visita...');
    console.log('📡 URL:', BACKEND_URL + '/api/visita');
    
    fetch(BACKEND_URL + '/api/visita', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        mode: 'cors'
    })
    .then(function(response) {
        console.log('📊 Respuesta del servidor:', response.status);
        return response.json();
    })
    .then(function(data) {
        console.log('✅ Visita registrada:', data);
    })
    .catch(function(err) {
        console.error('❌ Error registrando visita:', err);
    });
}

// =============================================
// FUNCIÓN: actualizarContadores (CORREGIDA)
// =============================================
// Solo obtiene el total de visitas del mes.
// (Eliminado el contador de reservas)
// =============================================
function actualizarContadores() {
    console.log('🔄 Actualizando contadores...');
    
    // Obtener visitas del mes
    fetch(BACKEND_URL + '/api/visitas/mes')
        .then(function(res) {
            if (!res.ok) throw new Error('Error en la respuesta');
            return res.json();
        })
        .then(function(data) {
            var visitsCount = document.getElementById('visitsCount');
            if (visitsCount) {
                visitsCount.innerText = data.total || 0;
                console.log('✅ Visitas actualizadas:', data.total);
            }
        })
        .catch(function(err) {
            console.error('❌ Error obteniendo visitas:', err);
            var visitsCount = document.getElementById('visitsCount');
            if (visitsCount) visitsCount.innerText = '—';
        });
}

// =============================================
// FUNCIÓN: mostrarQRExterno
// =============================================
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
    console.log('🚀 Página cargada - Versión 11.9');
    console.log('📡 BACKEND_URL:', BACKEND_URL);
    
    // Inicializar tema
    inicializarTema();
    
    // Configurar idioma
    var idiomaGuardado = localStorage.getItem('idioma');
    var idiomaDetectado = detectarIdiomaNavegador();
    
    if (idiomaGuardado) {
        cambiarIdioma(idiomaGuardado);
    } else {
        cambiarIdioma(idiomaDetectado);
    }
    
    // Solo ejecutar funciones de index.html si estamos en esa página
    if (document.getElementById('extrasContainer')) {
        regenerarAgregados();
    }
    
    if (document.querySelector('#registro .form-container')) {
        mostrarFormularioRegistroCompleto();
    }
    
    // Si hay cliente registrado, mostrar selector de vehículos (solo en index.html)
    if (verificarClienteExistente() && document.getElementById('precioCalculadoContainer')) {
        mostrarSelectorVehiculosEnReserva();
    }
    
    // Configurar hora (solo en index.html)
    var horaInput = document.getElementById('booking-input-time');
    if (horaInput) {
        horaInput.min = "00:00";
        horaInput.max = "23:59";
        horaInput.step = "1800";
    }
    
    // Configurar eventos de precio (solo en index.html)
    var serviceSelect = document.getElementById('booking-select-service');
    var vehicleSelect = document.getElementById('booking-select-vehicle');
    if (serviceSelect) serviceSelect.onchange = actualizarPrecio;
    if (vehicleSelect) vehicleSelect.onchange = actualizarPrecio;
    
    mostrarQRExterno();
    
    // Configurar botones de idioma
    var btnEnglish = document.getElementById('btnEnglish');
    var btnSpanish = document.getElementById('btnSpanish');
    if (btnEnglish) btnEnglish.onclick = function() { cambiarIdioma('en'); };
    if (btnSpanish) btnSpanish.onclick = function() { cambiarIdioma('es'); };
    
    // Configurar toggle de tema
    var themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.addEventListener('change', toggleTema);
    
    // ✅ REGISTRAR VISITA AL CARGAR LA PÁGINA
    registrarVisita();
    
    // ✅ ACTUALIZAR CONTADORES AL CARGAR
    actualizarContadores();
    
    // ✅ ACTUALIZAR CONTADORES CADA 30 SEGUNDOS
    setInterval(actualizarContadores, 30000);
    
    // Escuchar cambios en localStorage (idioma, tema)
    window.addEventListener('storage', function(e) {
        if (e.key === 'idioma') actualizarIdioma();
        if (e.key === 'tema') inicializarTema();
    });
    
    console.log('✅ Configuración completada');
};