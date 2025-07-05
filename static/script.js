// script.js

function actualizarEstado() {
    fetch('/estado')
        .then(res => res.json())
        .then(data => {
            document.getElementById("rpm1").textContent = `RPM M1: ${data.rpm.M1}`;
            document.getElementById("rpm2").textContent = `RPM M2: ${data.rpm.M2}`;
            document.getElementById("rpm3").textContent = `RPM M3: ${data.rpm.M3}`;
            document.getElementById("rpm4").textContent = `RPM M4: ${data.rpm.M4}`;
            document.getElementById("voltaje").textContent = `Voltaje Batería: --`; // <-- Aún no disponible
            document.getElementById("modo").textContent = `Modo: ${data.modo}`;
            document.getElementById("movimiento").textContent = `Movimiento: --`; // <-- Se puede actualizar más adelante
            document.getElementById("accion").textContent = `Acción: ${data.activo ? "Encendido" : "Apagado"}`;
        })
        .catch(err => {
            console.error("Error al obtener el estado:", err);
            document.getElementById("estadoConexion").textContent = "🔴 Desconectado";
            document.getElementById("estadoConexion").style.color = "red";
        });
}

setInterval(actualizarEstado, 2000);  // Actualiza cada 2 segundos
