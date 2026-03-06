// ========== SISTEMA DE IDIOMAS ==========
const textosEn = {
    'header-title': 'Detailing Team',
    'header-slogan': 'Excellence in Shine - Automotive Protection',
    'header-owner': 'Owner: Israel Ramirez Abreu',
    'header-phone': '+1 (713) 928-0466',
    'header-email': 'contactdetailingteam@gmail.com',
    'nav-services': 'Services',
    'nav-catalog': 'Catalog',
    'nav-register': 'Register',
    'nav-bookings': 'Bookings',
    'nav-contact': 'Contact',
    'services-title': 'Professional Services',
    'services-description': 'Competitive prices in Houston, TX',
    'schedule-title': 'Opening Hours',
    'schedule-text': '<strong>Monday to Sunday:</strong> 7:00 AM - 5:30 PM',
    'service1-name': 'Exterior Wash',
    'service1-desc': 'Exterior wash, wheels and windows',
    'service1-btn': 'Book Now',
    'service2-name': 'Complete Wash',
    'service2-desc': 'Interior + Exterior + Deep Vacuum',
    'service2-btn': 'Book Now',
    'service3-name': 'Engine Cleaning',
    'service3-desc': 'Degreasing and component protection',
    'service3-btn': 'Book Now',
    'service4-name': 'Polishing & Waxing',
    'service4-desc': 'Paint polishing and long-lasting wax',
    'service4-btn': 'Book Now',
    'service5-name': 'Ceramic Protection',
    'service5-desc': 'Professional ceramic coating (6 months)',
    'service5-btn': 'Book Now',
    'service6-name': 'Premium Package',
    'service6-desc': 'Complete wash + Polishing + Ceramic',
    'service6-btn': 'Book Now',
    'products-title': 'Product Catalog',
    'products-description': 'Motor oils, coolants and more for your vehicle',
    'product1-name': '5W-30 Oil',
    'product1-desc': 'Gallon (3.78L) - Mobil 1',
    'product1-btn': 'Add',
    'product2-name': 'Coolant',
    'product2-desc': '50/50 Concentrate - Gallon',
    'product2-btn': 'Add',
    'product3-name': 'Brake Fluid DOT 4',
    'product3-desc': '12 oz - Prestone',
    'product3-btn': 'Add',
    'product4-name': 'Windshield Washer',
    'product4-desc': 'Gallon - Ready to use',
    'product4-btn': 'Add',
    'register-title': 'Customer Registration',
    'register-description': 'Save your vehicle data for faster service',
    'register-name-label': 'Full Name *',
    'register-email-label': 'Email *',
    'register-phone-label': 'Phone Number *',
    'register-car-label': 'Make and Model *',
    'register-year-label': 'Year',
    'register-plate-label': 'License Plate (optional)',
    'register-btn': 'Register',
    'booking-title': 'Book Your Appointment',
    'booking-description': 'Choose service, date and time',
    'booking-service-label': 'Service *',
    'booking-select-option': 'Select a service',
    'booking-date-label': 'Date *',
    'booking-time-label': 'Time *',
    'booking-notes-label': 'Additional notes',
    'booking-btn': 'Request Appointment',
    'contact-title': 'Visit or Contact Us',
    'contact-address': '13330 West Road, Houston, TX 77041',
    'contact-phone-email': '+1 (713) 928-0466 | contactdetailingteam@gmail.com',
    'social-title': 'Follow us on social media',
    'payment-title': 'Accepted payment methods',
    'map-text': 'Map of Houston, TX (coming soon)',
    'time-help': 'Hours: 7:00 AM - 5:30 PM',
    'footer-about-title': 'Detailing Team',
    'footer-about-text': 'Excellence in shine and automotive protection in Houston, Texas.',
    'footer-about-country': 'Professional and guaranteed service.',
    'footer-quick-title': 'Quick Links',
    'footer-quick-services': 'Services',
    'footer-quick-products': 'Products',
    'footer-quick-register': 'Register',
    'footer-quick-bookings': 'Bookings',
    'footer-legal-title': 'Legal',
    'footer-legal-privacy': 'Privacy Policy',
    'footer-legal-terms': 'Terms of Service',
    'footer-legal-cookies': 'Cookie Settings',
    'footer-domain-title': 'Future Domain',
    'footer-domain': 'www.detailingteamtx.com',
    'footer-secure': 'Secure with HTTPS',
    'copyright-text': '© 2024 Detailing Team. All rights reserved.',
    'copyright-security': 'By using this site, you accept our privacy and security practices.'
};

const textosEs = {
    'header-title': 'Detailing Team',
    'header-slogan': 'Excelencia en Brillo - Protección Automotriz',
    'header-owner': 'Propietario: Israel Ramirez Abreu',
    'header-phone': '+1 (713) 928-0466',
    'header-email': 'contactdetailingteam@gmail.com',
    'nav-services': 'Servicios',
    'nav-catalog': 'Catálogo',
    'nav-register': 'Registro',
    'nav-bookings': 'Reservas',
    'nav-contact': 'Contacto',
    'services-title': 'Servicios Profesionales',
    'services-description': 'Precios competitivos en Houston, TX',
    'schedule-title': 'Horario de atención',
    'schedule-text': '<strong>Lunes a Domingo:</strong> 7:00 AM - 5:30 PM',
    'service1-name': 'Lavado Exterior',
    'service1-desc': 'Lavado de carrocería, llantas y cristales',
    'service1-btn': 'Reservar',
    'service2-name': 'Lavado Completo',
    'service2-desc': 'Interior + Exterior + Aspirado profundo',
    'service2-btn': 'Reservar',
    'service3-name': 'Limpieza de Motor',
    'service3-desc': 'Desengrasado y protección de componentes',
    'service3-btn': 'Reservar',
    'service4-name': 'Pulido y Encerado',
    'service4-desc': 'Pulido de pintura y cera de alta duración',
    'service4-btn': 'Reservar',
    'service5-name': 'Protección Cerámica',
    'service5-desc': 'Capa cerámica profesional (6 meses)',
    'service5-btn': 'Reservar',
    'service6-name': 'Paquete Premium',
    'service6-desc': 'Lavado completo + Pulido + Cerámica',
    'service6-btn': 'Reservar',
    'products-title': 'Catálogo de Productos',
    'products-description': 'Aceites, refrigerantes y más para tu vehículo',
    'product1-name': 'Aceite 5W-30',
    'product1-desc': 'Galón (3.78L) - Mobil 1',
    'product1-btn': 'Añadir',
    'product2-name': 'Refrigerante',
    'product2-desc': 'Concentrado 50/50 - Galón',
    'product2-btn': 'Añadir',
    'product3-name': 'Líquido Frenos DOT 4',
    'product3-desc': '12 oz - Prestone',
    'product3-btn': 'Añadir',
    'product4-name': 'Limpiaparabrisas',
    'product4-desc': 'Galón - Listo para usar',
    'product4-btn': 'Añadir',
    'register-title': 'Registro de Clientes',
    'register-description': 'Guarda los datos de tu vehículo para un servicio más rápido',
    'register-name-label': 'Nombre y Apellidos *',
    'register-email-label': 'Email *',
    'register-phone-label': 'Teléfono *',
    'register-car-label': 'Marca y Modelo *',
    'register-year-label': 'Año',
    'register-plate-label': 'Placa (opcional)',
    'register-btn': 'Registrarme',
    'booking-title': 'Reserva tu Turno',
    'booking-description': 'Elige servicio, fecha y hora',
    'booking-service-label': 'Servicio *',
    'booking-select-option': 'Selecciona un servicio',
    'booking-date-label': 'Fecha *',
    'booking-time-label': 'Hora *',
    'booking-notes-label': 'Notas adicionales',
    'booking-btn': 'Solicitar Turno',
    'contact-title': 'Visítanos o Contáctanos',
    'contact-address': '13330 West Road, Houston, TX 77041',
    'contact-phone-email': '+1 (713) 928-0466 | contactdetailingteam@gmail.com',
    'social-title': 'Síguenos en redes',
    'payment-title': 'Métodos de pago aceptados',
    'map-text': 'Mapa de Houston, TX (próximamente)',
    'time-help': 'Horario: 7:00 AM - 5:30 PM',
    'footer-about-title': 'Detailing Team',
    'footer-about-text': 'Excelencia en brillo y protección automotriz en Houston, Texas.',
    'footer-about-country': 'Servicio profesional y garantizado.',
    'footer-quick-title': 'Enlaces rápidos',
    'footer-quick-services': 'Servicios',
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
    'copyright-security': 'Al usar este sitio, aceptas nuestras prácticas de privacidad y seguridad.'
};

// ========== FUNCIONES DE IDIOMA ==========
function cambiarIdioma(idioma) {
    const textos = idioma === 'en' ? textosEn : textosEs;

    for (let id in textos) {
        const elemento = document.getElementById(id);
        if (elemento) {
            if (id === 'schedule-text' || id.includes('desc') || id.includes('description')) {
                elemento.innerHTML = textos[id];
            } else if (elemento.querySelector('i')) {
                const icon = elemento.querySelector('i');
                if (icon) {
                    elemento.innerHTML = icon.outerHTML + ' ' + textos[id];
                } else {
                    elemento.innerText = textos[id];
                }
            } else {
                elemento.innerText = textos[id];
            }
        }
    }

    document.getElementById('btnEnglish').classList.toggle('active', idioma === 'en');
    document.getElementById('btnSpanish').classList.toggle('active', idioma === 'es');
    document.documentElement.lang = idioma === 'en' ? 'en' : 'es';
    localStorage.setItem('idioma', idioma);

    actualizarDisponibilidad();
}

function detectarIdiomaNavegador() {
    const lang = navigator.language || navigator.userLanguage;
    if (lang.startsWith('es')) {
        return 'es';
    } else if (lang.startsWith('en')) {
        return 'en';
    }
    return 'es';
}

// ========== FUNCIONES DE TEMA ==========
function cambiarTema(modo) {
    const body = document.body;
    const lightBtn = document.getElementById('themeLight');
    const darkBtn = document.getElementById('themeDark');
    const systemBtn = document.getElementById('themeSystem');

    body.classList.remove('dark-mode');

    if (modo === 'dark') {
        body.classList.add('dark-mode');
    } else if (modo === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemDark) {
            body.classList.add('dark-mode');
        }
    }

    lightBtn.classList.remove('active');
    darkBtn.classList.remove('active');
    systemBtn.classList.remove('active');

    if (modo === 'light') {
        lightBtn.classList.add('active');
    } else if (modo === 'dark') {
        darkBtn.classList.add('active');
    } else {
        systemBtn.classList.add('active');
    }

    localStorage.setItem('tema', modo);
}

function aplicarTemaGuardado() {
    const temaGuardado = localStorage.getItem('tema');
    if (temaGuardado) {
        cambiarTema(temaGuardado);
    } else {
        cambiarTema('system');
    }
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const temaActual = localStorage.getItem('tema');
    if (temaActual === 'system') {
        if (e.matches) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
});

// ========== GESTIÓN DE RESERVAS Y TICKETS ==========
const MAX_ORDENES_DIARIAS = 30;
const HORARIO_INICIO = "07:00";
const HORARIO_FIN = "17:30";
const TELEFONO_PROPIETARIO = "17139280466";

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
    const espanolActivo = document.getElementById('btnSpanish').classList.contains('active');

    if (disponibles <= 0) {
        msgDiv.innerHTML = espanolActivo ?
            '❌ No hay cupos disponibles para esta fecha. Por favor elige otro día.' :
            '❌ No slots available for this date. Please choose another day.';
        msgDiv.className = 'availability-message error';
    } else {
        msgDiv.innerHTML = espanolActivo ?
            `✅ Cupos disponibles: ${disponibles} de ${MAX_ORDENES_DIARIAS} para esta fecha` :
            `✅ Available slots: ${disponibles} out of ${MAX_ORDENES_DIARIAS} for this date`;
        msgDiv.className = 'availability-message success';
    }
}

function validarHora(hora) {
    return hora >= HORARIO_INICIO && hora <= HORARIO_FIN;
}

function generarTicket(reserva, cliente) {
    const espanolActivo = document.getElementById('btnSpanish').classList.contains('active');
    const salto = '%0A';

    let mensaje = espanolActivo ?
        '🔔 *NUEVA RESERVA RECIBIDA* 🔔' + salto +
        '==========================' + salto +
        '*DATOS DEL CLIENTE*' + salto +
        `Nombre: ${cliente.nombre}` + salto +
        `Email: ${cliente.email}` + salto +
        `Teléfono: ${cliente.telefono}` + salto +
        `Vehículo: ${cliente.modelo} ${cliente.anio || ''}` + salto +
        `Placa: ${cliente.placa || 'No registrada'}` + salto +
        '==========================' + salto +
        '*DETALLE DE LA RESERVA*' + salto +
        `Servicio: ${reserva.servicio}` + salto +
        `Fecha: ${reserva.fecha}` + salto +
        `Hora: ${reserva.hora}` + salto +
        `Notas: ${reserva.notas || 'Sin notas'}` + salto +
        '==========================' + salto +
        `Total: ${reserva.precio}` + salto +
        'Por favor confirmar disponibilidad.' :

        '🔔 *NEW BOOKING RECEIVED* 🔔' + salto +
        '==========================' + salto +
        '*CUSTOMER DATA*' + salto +
        `Name: ${cliente.nombre}` + salto +
        `Email: ${cliente.email}` + salto +
        `Phone: ${cliente.telefono}` + salto +
        `Vehicle: ${cliente.modelo} ${cliente.anio || ''}` + salto +
        `License Plate: ${cliente.placa || 'Not registered'}` + salto +
        '==========================' + salto +
        '*BOOKING DETAILS*' + salto +
        `Service: ${reserva.servicio}` + salto +
        `Date: ${reserva.fecha}` + salto +
        `Time: ${reserva.hora}` + salto +
        `Notes: ${reserva.notas || 'No notes'}` + salto +
        '==========================' + salto +
        `Total: ${reserva.precio}` + salto +
        'Please confirm availability.';

    return mensaje;
}

function enviarWhatsApp(mensaje) {
    const url = `https://wa.me/${TELEFONO_PROPIETARIO}?text=${mensaje}`;
    window.open(url, '_blank', 'noopener,noreferrer');
}

function procesarReserva(event) {
    event.preventDefault();

    const hora = document.getElementById('hora').value;
    if (!validarHora(hora)) {
        const espanolActivo = document.getElementById('btnSpanish').classList.contains('active');
        alert(espanolActivo ?
            '❌ Horario no válido. Atendemos de 7:00 AM a 5:30 PM.' :
            '❌ Invalid time. We are open from 7:00 AM to 5:30 PM.');
        return false;
    }

    const fecha = document.getElementById('fecha').value;
    const reservasDia = obtenerReservasPorFecha(fecha);
    if (reservasDia.length >= MAX_ORDENES_DIARIAS) {
        const espanolActivo = document.getElementById('btnSpanish').classList.contains('active');
        alert(espanolActivo ?
            '❌ Lo sentimos, no hay cupos disponibles para esta fecha.' :
            '❌ Sorry, no slots available for this date.');
        return false;
    }

    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    if (clientes.length === 0) {
        const espanolActivo = document.getElementById('btnSpanish').classList.contains('active');
        alert(espanolActivo ?
            '⚠️ Debes registrarte antes de hacer una reserva.' :
            '⚠️ You must register before making a booking.');
        window.location.href = '#registro';
        return false;
    }
    const clienteActual = clientes[clientes.length - 1];

    const servicioSelect = document.getElementById('servicio');
    const servicioTexto = servicioSelect.options[servicioSelect.selectedIndex].text;
    const precioMatch = servicioTexto.match(/\$(\d+)/);
    const precio = precioMatch ? '$' + precioMatch[1] : 'N/A';

    const reserva = {
        servicio: servicioSelect.value,
        fecha: fecha,
        hora: hora,
        notas: document.getElementById('notas').value,
        precio: precio,
        fechaSolicitud: new Date().toLocaleString(),
        clienteEmail: clienteActual.email
    };

    let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    reservas.push(reserva);
    localStorage.setItem('reservas', JSON.stringify(reservas));

    const ticket = generarTicket(reserva, clienteActual);
    enviarWhatsApp(encodeURIComponent(ticket));

    const espanolActivo = document.getElementById('btnSpanish').classList.contains('active');
    alert(espanolActivo ?
        '✅ ¡Reserva confirmada! Se ha enviado un ticket al propietario vía WhatsApp.' :
        '✅ Booking confirmed! A ticket has been sent to the owner via WhatsApp.');

    document.getElementById('bookingForm').reset();
    actualizarDisponibilidad();
    return false;
}

// ========== REGISTRO DE CLIENTES ==========
function guardarRegistro(event) {
    event.preventDefault();

    const registro = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        modelo: document.getElementById('modelo').value,
        anio: document.getElementById('anio').value,
        placa: document.getElementById('placa').value,
        fecha: new Date().toLocaleString()
    };

    let registros = JSON.parse(localStorage.getItem('clientes')) || [];
    registros.push(registro);
    localStorage.setItem('clientes', JSON.stringify(registros));

    const espanolActivo = document.getElementById('btnSpanish').classList.contains('active');
    alert(espanolActivo ?
        '✅ ¡Registro guardado con éxito! (Datos almacenados localmente)' :
        '✅ Registration saved successfully! (Data stored locally)');

    document.getElementById('registerForm').reset();
}

// ========== INICIALIZACIÓN ==========
window.onload = function() {
    const idiomaGuardado = localStorage.getItem('idioma');
    if (idiomaGuardado) {
        cambiarIdioma(idiomaGuardado);
    } else {
        const idiomaDetectado = detectarIdiomaNavegador();
        cambiarIdioma(idiomaDetectado);
    }

    aplicarTemaGuardado();

    const horaInput = document.getElementById('hora');
    if (horaInput) {
        horaInput.min = HORARIO_INICIO;
        horaInput.max = HORARIO_FIN;
        horaInput.step = "1800";
    }

    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        fechaInput.addEventListener('change', actualizarDisponibilidad);
    }
};