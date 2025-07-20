// script.js - Control y monitoreo de tu robot móvil

// === FUNCIÓN PARA ACTUALIZAR ESTADO DEL ROBOT ===
function actualizarEstado() {
    fetch('/estado')
        .then(res => res.json())
        .then(data => {
            // Actualiza los textos de parámetros en el panel
            document.getElementById("rpm1").textContent = `RPM M1: ${data.rpm.M1}`;
            document.getElementById("rpm2").textContent = `RPM M2: ${data.rpm.M2}`;
            document.getElementById("rpm3").textContent = `RPM M3: ${data.rpm.M3}`;
            document.getElementById("rpm4").textContent = `RPM M4: ${data.rpm.M4}`;
            document.getElementById("voltaje").textContent = `Voltaje Batería: --`; // Pon data.voltaje si tienes ese dato
            document.getElementById("modo").textContent = `Modo: ${data.modo}`;
            // Si tu backend devuelve 'accion', muestra movimiento y acción. Si no, pon otra propiedad o déjalo en blanco.
            document.getElementById("movimiento").textContent = `Movimiento: ${data.accion || '--'}`;
            document.getElementById("accion").textContent = `Acción: ${data.accion || '--'}`;
            // Cambia color de conexión si todo va bien
            document.getElementById("estadoConexion").textContent = "🟢 Conectado";
            document.getElementById("estadoConexion").style.color = "limegreen";
        })
        .catch(err => {
            // Si hay error, muestra desconectado
            console.error("Error al obtener el estado:", err);
            document.getElementById("estadoConexion").textContent = "🔴 Desconectado";
            document.getElementById("estadoConexion").style.color = "red";
        });
}
// Actualiza cada 2 segundos automáticamente
setInterval(actualizarEstado, 2000);

// === REFERENCIAS A BOTONES DE CONTROL MANUAL ===
const btnUp = document.getElementById("btn-up");
const btnDown = document.getElementById("btn-down");
const btnLeft = document.getElementById("btn-left");
const btnRight = document.getElementById("btn-right");
const btnStop = document.getElementById("btn-stop");

// === FUNCIÓN PARA ENVIAR COMANDOS AL SERVIDOR (RASPBERRY PI) ===
function enviarComando(comando) {
    fetch('/control', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({accion: comando})
    })
    .then(response => response.json())
    .then(data => {
        console.log("Respuesta del servidor:", data);
    })
    .catch(error => console.error("Error al enviar comando:", error));
}

// === FUNCIÓN PARA RESALTAR BOTÓN ACTIVO ===
function resaltarBoton(boton) {
    // Remueve clase 'activo' de todos los botones de dirección y stop
    document.querySelectorAll('.boton-direccion, .boton-stop').forEach(b => b.classList.remove("activo"));
    // Agrega la clase 'activo' solo al botón presionado
    boton.classList.add("activo");
}

// === EVENTOS DE CLICK PARA CADA BOTÓN DE DIRECCIÓN ===
btnUp.addEventListener("click", () => {
    enviarComando("adelante");
    resaltarBoton(btnUp);
});
btnDown.addEventListener("click", () => {
    enviarComando("atras");
    resaltarBoton(btnDown);
});
btnLeft.addEventListener("click", () => {
    enviarComando("izquierda");
    resaltarBoton(btnLeft);
});
btnRight.addEventListener("click", () => {
    enviarComando("derecha");
    resaltarBoton(btnRight);
});
btnStop.addEventListener("click", () => {
    enviarComando("stop"); // Comando correcto que reconoce tu backend
    resaltarBoton(btnStop);
});

// === CONTROL DESDE EL TECLADO (FLECHAS Y ESPACIO) ===
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp": btnUp.click(); break;
        case "ArrowDown": btnDown.click(); break;
        case "ArrowLeft": btnLeft.click(); break;
        case "ArrowRight": btnRight.click(); break;
        case " ":
            e.preventDefault();
            btnStop.click();
            break;
    }
});

// === BOTÓN ENCENDIDO/APAGADO ===
const btnEncender = document.getElementById("btn-encender");
let encendido = false; // Estado inicial del robot

btnEncender.addEventListener("click", () => {
    encendido = !encendido;
    // Actualiza visualmente el botón
    btnEncender.textContent = encendido ? "🔴 Apagar" : "🔌 Encender";
    btnEncender.style.background = encendido ? "#ff4500" : "rgba(20,20,20,0.85)";
    btnEncender.style.color = encendido ? "white" : "#ffd500";
    // Envía comando correspondiente
    enviarComando(encendido ? "encender" : "apagar");
});

// === BOTÓN DE CAMBIO DE MODO (MANUAL/AUTOMÁTICO) ===
const btnModo = document.getElementById("btn-modo");
let manual = true; // Estado inicial en modo manual

btnModo.addEventListener("click", () => {
    manual = !manual;
    btnModo.textContent = manual ? "🤖 Modo: Manual" : "🟢 Modo: Automático";
    btnModo.style.background = manual ? "rgba(20,20,20,0.85)" : "#ffd500";
    btnModo.style.color = manual ? "#ffd500" : "#333";
    // Envía el comando CORRECTO que espera Flask
    enviarComando(manual ? "manual" : "automatico");
});
