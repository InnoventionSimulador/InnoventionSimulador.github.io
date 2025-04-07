class ParqueInteractivo {
    constructor(maxPersonas, maxHorarios, maxAtracciones, limiteRelleno) {
        this.maxPersonas = maxPersonas;   // Número máximo de personas por grupo
        this.maxHorarios = maxHorarios;  // Número máximo de horarios
        this.maxAtracciones = maxAtracciones; // Número de atracciones
        this.limiteRelleno = limiteRelleno;  // Límite de relleno para los horarios
        this.conteoTotalClicks = 0;      // Contador de clics
        this.horarioActual = 0;          // Cambiado a 0 para representar 8:00 AM
        this.datosSimulacion = [];      // Array para almacenar los datos de la simulación
        this.simulacionFinalizada = false; // Para congelar ingresos al empezar los ceros

    }
    
    // Función para calcular el rango de horarios en bloques de 10 minutos
    calcularHorario(horarioIndex) {
        const horaInicio = 8 * 60; // 8:00 AM en minutos
        const minutos = horaInicio + (horarioIndex * 10);
        const hora = Math.floor(minutos / 60);
        const min = minutos % 60;
        const horaFin = min + 10 >= 60 ? `${hora + 1}:00` : `${hora}:${(min + 10).toString().padStart(2, '0')}`;
        return `${hora}:${min.toString().padStart(2, '0')} - ${horaFin}`;
    }

    // Función para llenar una celda por clic (simulación en tiempo real)
    llenarCelda() {
        const tbody = document.querySelector("#tablaSimulacion tbody");
    
        // Verificar si la fila actual ya existe o necesita crearse
        let fila = tbody.querySelector(`tr[data-horario="${this.horarioActual}"]`);
        if (!fila) {
            fila = tbody.insertRow();
            fila.setAttribute("data-horario", this.horarioActual);
    
            // Insertar celda del horario con formato HH:MM - HH:MM
            const celdaHorario = fila.insertCell();
            celdaHorario.textContent = this.calcularHorario(this.horarioActual);
    
            // Crear celdas vacías para las atracciones
            for (let i = 1; i <= this.maxAtracciones; i++) {
                fila.insertCell().textContent = ""; // Inicialmente vacías
            }
        }
    
        // Obtener las celdas de la fila
        const celdas = fila.querySelectorAll("td");
    
        // Verificar si el horario actual supera los horarios normales
        if (this.horarioActual > this.maxHorarios) {
            // Marcar que empezó la simulación de ceros
this.simulacionFinalizada = true;

            // Añadir cero al inicio para simular el desplazamiento
            this.datosSimulacion.unshift(0);
            // Si el array supera el límite de atracciones, eliminar el más antiguo
            if (this.datosSimulacion.length > this.maxAtracciones) {
                this.datosSimulacion.pop();
            }
    
            // Llenar las celdas vacías con ceros SOLO cuando el horario supera el límite
            for (let i = 0; i < this.maxAtracciones; i++) {
                celdas[i + 1].textContent = this.datosSimulacion[i] || "0"; // Insertar ceros
            }
    
            // Verificar si todas las celdas ya están llenas de ceros
            const todosCeros = Array.from(celdas).slice(1).every(cell => cell.textContent === "0");
            
            if (todosCeros) {
                alert("La tabla se ha llenado completamente de ceros. No se pueden agregar más personas.");
                document.getElementById("maxPersonas").disabled = true;  // Deshabilitar input de personas
                return;  // No permitir seguir añadiendo
            }
    
        } else {
            // Validar y procesar el input del usuario
            const personasPorHorario = parseInt(document.getElementById("maxPersonas").value);
    
            if (isNaN(personasPorHorario) || personasPorHorario < 0) {
                alert("Por favor, ingrese un número válido de personas (no negativos).");
                return;
            }
            
    
            // Agregar personas al final y ajustar longitud del array
            this.datosSimulacion.push(personasPorHorario);
            if (this.datosSimulacion.length > this.maxAtracciones) {
                this.datosSimulacion.shift(); // Eliminar el más antiguo si excede
            }
    
            // Desplazar los valores en las celdas de la fila de acuerdo con la secuencia
            let index = 1;  // Comenzamos desde la primera atracción
    
            // Mover los valores hacia las celdas de la fila (de izquierda a derecha)
            for (let i = this.datosSimulacion.length - 1; i >= 0; i--) {
                while (index <= this.maxAtracciones && celdas[index].textContent !== "") {
                    index++;  // Mover a la siguiente celda si ya tiene contenido
                }
                if (index <= this.maxAtracciones) {
                    celdas[index].textContent = this.datosSimulacion[i];
                }
            }
        }
    
        // Incrementar el horario
        this.horarioActual++;
    
        // Incrementar clics y mostrar mensaje si aplica
        this.conteoTotalClicks++;
        this.mostrarMensajeFinal();
    
        // Calcular ingresos basados en el último valor de personas
        // Calcular ingresos basados en el último valor de personas
const ultimoValor = this.datosSimulacion[this.datosSimulacion.length - 1];

// Si el último valor es 0 (simulación de salida), no calcular ingresos
if (ultimoValor === 0) {
    return;
}

// Si hay personas reales, pero el costo está en 0, también actualizamos visual
if (ultimoValor > 0 && parseInt(document.getElementById("costoBoleta").value) === 0) {
    document.getElementById("valorPersona").textContent = "0";
}

// Solo aquí se calcula ingreso
calcularIngresos(ultimoValor);

    }
    
    
    // Función para generar dinámicamente las cabeceras de la tabla
    generarCabecerasAtracciones() {
        const thead = document.querySelector("#tablaSimulacion thead tr");
        thead.innerHTML = "<th>Horario</th>"; // Limpiar y agregar la primera cabecera

        for (let i = 1; i <= this.maxAtracciones; i++) {
            const th = document.createElement("th");
            th.textContent = `Atracción ${i}`;
            thead.appendChild(th);
        }
    }

    // Mostrar mensaje final con el número de clics realizados
    mostrarMensajeFinal() {
        const mensajeFinal = document.getElementById("mensajeFinal");
        mensajeFinal.textContent = `Número total de clics: ${this.conteoTotalClicks}`;
    }
}

// Crear la instancia una sola vez fuera del evento
let parque = new ParqueInteractivo(6, 5, 3, 3); // Valores predeterminados

// Variable global para ingresos acumulados
let totalPersonasAcumuladas = 0; // Personas acumuladas en total

document.getElementById("costoBoleta").addEventListener("input", function () {
    const nuevoCosto = parseInt(this.value) || 0; // Obtener el valor del input
    document.getElementById("valorPersona").textContent = nuevoCosto.toLocaleString(); // Actualizar la celda de la tabla
});

// Variable global para almacenar ingresos por grupo
let ingresosPorGrupo = []; 


function calcularIngresos(personasPorHorario) {
    if (personasPorHorario <= 0 || parque.simulacionFinalizada) return; // ❌ Ignorar ceros o si ya terminó

    const costoBoleta = parseInt(document.getElementById("costoBoleta").value) || 0;

    ingresosPorGrupo.push({ personas: personasPorHorario, costo: costoBoleta });

    let ingresoTotal = ingresosPorGrupo.reduce((total, grupo) => {
        return total + (grupo.personas * grupo.costo);
    }, 0);

    totalPersonasAcumuladas += personasPorHorario;
    document.getElementById("totalPersonas").textContent = totalPersonasAcumuladas;
    document.getElementById("ingresoTotal").textContent = ingresoTotal.toLocaleString();
}



// Función para limpiar la tabla y reiniciar valores
function limpiarTabla() {
    parque.simulacionFinalizada = false;

    // Limpiar el cuerpo de la tabla
    const tbody = document.querySelector("#tablaSimulacion tbody");
    tbody.innerHTML = ""; // Vaciar las filas de la tabla
    ingresosPorGrupo = []; // Reiniciar el array de ingresos por grupo

    // Reiniciar las variables
    parque.conteoTotalClicks = 0;
    parque.horarioActual = 1;
    parque.datosSimulacion = []; // Limpiar los datos de la simulación

    // Reiniciar los ingresos acumulados
    totalPersonasAcumuladas = 0;

    // Limpiar los mensajes
    document.getElementById("mensajeFinal").textContent = "";
    document.getElementById("totalPersonas").textContent = "-";
    document.getElementById("ingresoTotal").textContent = "-";
}

// Asignar evento al botón de simular
document.getElementById("llenarBtn").addEventListener("click", function () {
    // Actualizar los valores de la instancia
    parque.maxPersonas = parseInt(document.getElementById("maxPersonas").value);
    parque.maxHorarios = parseInt(document.getElementById("maxHorarios").value);
    parque.maxAtracciones = parseInt(document.getElementById("maxAtracciones").value);
    parque.limiteRelleno = parseInt(document.getElementById("limiteRelleno").value);

    // Verificar que el input de maxPersonas es válido
    const personasPorHorario = parseInt(document.getElementById("maxPersonas").value);
    if (personasPorHorario === 0) {
        document.getElementById("costoBoleta").value = 0;
        document.getElementById("valorPersona").textContent = "0";
    }
    
    if (isNaN(personasPorHorario) || personasPorHorario < 0) {
        alert("Por favor, ingrese un número válido de personas (no negativos).");
        return;
    }
    

    // Llenar la tabla de simulación
    parque.generarCabecerasAtracciones();
    parque.llenarCelda();
});

// Asignar evento al botón de limpiar
document.getElementById("limpiarBtn").addEventListener("click", function () {
    limpiarTabla();  // Limpiar la tabla y reiniciar los valores
    const thead = document.querySelector("#tablaSimulacion thead tr");
thead.innerHTML = "<th>Horario</th>";

});
document.getElementById("compararBtn").addEventListener("click", () => {
    const ingresoTotal = document.getElementById("ingresoTotal").textContent.replace(/\./g, "").replace(/,/g, "");
    const totalPersonas = document.getElementById("totalPersonas").textContent;
    const valorPersona = document.getElementById("valorPersona").textContent.replace(/\./g, "").replace(/,/g, "");
  
    // Guarda los valores
    sessionStorage.setItem("ingresoTotal", ingresoTotal);
    sessionStorage.setItem("totalPersonas", totalPersonas);
    sessionStorage.setItem("valorPersona", valorPersona);
  
    // Ahora sí redirige
    window.location.href = "comparar.html";
  });
  
