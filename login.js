document.addEventListener("DOMContentLoaded", function() {
    const togglePassword = document.getElementById('togglePassword');
    const passwordField = document.getElementById('password');

  
    });

document.addEventListener("DOMContentLoaded", function() {
    const togglePassword = document.getElementById('togglePassword');
    const passwordField = document.getElementById('password');

    });

    // Manejo del formulario de inicio de sesión
    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Evita que el formulario se envíe

        // Definir correo y contraseña correctos
        const validEmail = "innoventionPereira@gmail.com";
        const validPassword = "HAHFAOIYBJSH123456";

        // Obtener valores ingresados por el usuario
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Validación del correo y la contraseña
        if (email === validEmail && password === validPassword) {
            // Si el correo y la contraseña son correctos, redirige a index.html
            window.location.href = "index.html"; // Redirige a index.html
        } else {
            // Si no son correctos, muestra un mensaje de error
            alert("Correo o contraseña incorrectos.");
        }
    });
