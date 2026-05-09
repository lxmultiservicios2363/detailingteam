// =============================================
// DETAILING TEAM - SCRIPT PRINCIPAL
// =============================================
// VERSIÓN: 10.3 (COMPATIBLE CON MODELO CLIENTE ORIGINAL)
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
// TEXTOS EN INGLÉS (RESUMIDOS PARA ESPACIO)
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
    'services-description': '🌟 The shine your car deserves, the protection it needs.',
    'schedule-title': '🕒 Business Hours',
    'schedule-text': '<strong>Monday to Sunday:</strong> 7:00 AM - 5:30 PM',
    'service1-name': 'Express Detail',
    'service2-name': 'Silver Package',
    'service3-name': 'Gold Package',
    'service4-name': 'Diamond Package',
    'service5-name': 'Ceramic 1 Year',
    'service6-name': 'Ceramic 3 Years (Mid Level)',
    'service7-name': 'Ceramic 5 Years (Premium)',
    'gallery-title': '📸 Results That Speak for Themselves 📸',
    'filter-all': 'All',
    'filter-express': 'Express Detail',
    'filter-silver': 'Silver',
    'filter-gold': 'Gold',
    'filter-diamond': 'Diamond',
    'filter-ceramic1': 'Ceramic 1Y',
    'filter-ceramic3': 'Ceramic 3Y',
    'filter-ceramic5': 'Ceramic 5Y',
    'register-title': '📝 Customer Registration 📝',
    'register-description': 'Save your vehicle data for faster service.',
    'register-label-name': 'Full Name *',
    'register-label-email': 'Email *',
    'register-label-phone': 'Phone *',
    'register-label-address': 'Address *',
    'register-label-model': 'Make and Model *',
    'register-label-year': 'Year',
    'register-label-plate': 'License Plate (optional)',
    'register-btn': 'Register Me',
    'booking-title': '📅 Book Your Appointment 📅',
    'booking-description': 'Choose service, date and time.',
    'booking-label-service': 'Service *',
    'booking-label-vehicle': 'Vehicle Type *',
    'booking-label-date': 'Date *',
    'booking-label-time': 'Time *',
    'booking-label-notes': 'Additional Notes',
    'booking-label-price': 'Final price:',
    'booking-btn': 'Continue to payment',
    'contact-title': '📱 Contact Us - Mobile Service 📱',
    'contact-mobile-service': 'Home service in Houston, TX',
    'social-title': 'Follow us on social media',
    'payment-title': '💳 Accepted payment methods 💳'
};

// =============================================
// TEXTOS EN ESPAÑOL (RESUMIDOS PARA ESPACIO)
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
    'services-description': '🌟 El brillo que tu auto merece, la protección que necesita.',
    'schedule-title': '🕒 Horario de atención',
    'schedule-text': '<strong>Lunes a Domingo:</strong> 7:00 AM - 5:30 PM',
    'service1-name': 'Express Detail',
    'service2-name': 'Silver Package',
    'service3-name': 'Gold Package',
    'service4-name': 'Diamond Package',
    'service5-name': 'Ceramic 1 Year',
    'service6-name': 'Ceramic 3 Years (Mid Level)',
    'service7-name': 'Ceramic 5 Years (Premium)',
    'gallery-title': '📸 Resultados que Hablan Solos 📸',
    'filter-all': 'Todos',
    'filter-express': 'Express Detail',
    'filter-silver': 'Silver',
    'filter-gold': 'Gold',
    'filter-diamond': 'Diamond',
    'filter-ceramic1': 'Ceramic 1Y',
    'filter-ceramic3': 'Ceramic 3Y',
    'filter-ceramic5': 'Ceramic 5Y',
    'register-title': '📝 Registro de Clientes 📝',
    'register-description': 'Guarda los datos de tu vehículo.',
    'register-label-name': 'Nombre y Apellidos *',
    'register-label-email': 'Email *',
    'register-label-phone': 'Teléfono *',
    'register-label-address': 'Dirección *',
    'register-label-model': 'Marca y Modelo *',
    'register-label-year': 'Año',
    'register-label-plate': 'Placa (opcional)',
    'register-btn': 'Registrarme',
    'booking-title': '📅 Reserva tu Turno 📅',
    'booking-description': 'Elige servicio, fecha y hora.',
    'booking-label-service': 'Servicio *',
    'booking-label-vehicle': 'Tipo de vehículo *',
    'booking-label-date': 'Fecha *',
    'booking-label-time': 'Hora *',
    'booking-label-notes': 'Notas adicionales',
    'booking-label-price': 'Precio final:',
    'booking-btn': 'Continuar al pago',
    'contact-title': '📱 Contáctanos - Servicio Móvil 📱',
    'contact-mobile-service': 'Servicio a domicilio en Houston, TX',
    'social-title': 'Síguenos en redes',
    'payment-title': '💳 Métodos de pago aceptados 💳'
};

// =============================================
// FUNCIÓN: actualizarIdioma
// =============================================
function actualizarIdioma() {
    var idioma = localStorage.getItem('idioma') || 'es';
    var textos = idioma === 'en' ? textosIndexEn : textosIndexEs;
    
    for (var id in textos) {
        var elemento = document.getElementById(id);
        if (elemento) {
            if (id === 'schedule-text') {
                elemento.innerHTML = textos[id];
            } else if (elemento.tagName === 'INPUT' || elemento.tagName === 'TEXTAREA') {
                elemento.placeholder = textos[id];
            } else {
                elemento.innerText = textos[id];
            }
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
            <div class="vehiculo-group" style="border: 1px solid var(--border-color, #ddd); border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem;">
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
// FUNCIÓN: guardarRegistroCompleto (VERSIÓN COMPATIBLE CON MODELO ORIGINAL)
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
    
    // Enviar en el formato que el modelo ORIGINAL espera (sin direccion, sin array)
    var clienteData = {
        nombre: nombre,
        email: email,
        telefono: telefono,
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
        // Guardar toda la información en localStorage (incluyendo la dirección y múltiples vehículos)
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
    var servicioOption = servicioSelect.options[servicioSelect.selectedIndex];
    var precioFinal = calcularPrecioFinal(servicioOption, tipoVehiculo);
    
    var reserva = {
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

function calcularPrecioFinal(servicioOption, tipoVehiculo) {
    var precioBase = servicioOption.getAttribute('data-price-sedan');
    var precio = parseInt(precioBase.split('-')[0]);
    if (tipoVehiculo === 'suv' || tipoVehiculo === 'pickup') precio += 40;
    else if (tipoVehiculo === 'van') precio += 60;
    else if (tipoVehiculo === 'truck') precio += 80;
    if (precioBase.indexOf('-') !== -1) {
        var precioMaxOriginal = parseInt(precioBase.split('-')[1]);
        var precioMax = precioMaxOriginal + (precio - parseInt(precioBase.split('-')[0]));
        return precio + '-' + precioMax;
    }
    return precio.toString();
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
    
    window.addEventListener('storage', function(e) {
        if (e.key === 'idioma') actualizarIdioma();
    });
    
    console.log('✅ Configuración completada');
};