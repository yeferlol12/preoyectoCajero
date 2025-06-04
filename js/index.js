function toggleForms() {
  document.getElementById("loginForm").classList.toggle("active");
  document.getElementById("registerForm").classList.toggle("active");
}

function generarNumeroCuenta() {
  return Math.floor(Math.random() * 900000) + 100000;
}

function numeroCuentaUnico() {
  const lista = JSON.parse(localStorage.getItem("personas")) || [];
  let nuevoNumero;

  do {
    nuevoNumero = generarNumeroCuenta();
  } while (lista.some((p) => p.numeroCuenta === nuevoNumero));
  return nuevoNumero;
}
//Eliminar las personas del local todas
//localStorage.removeItem("personas");
//alert("Todas las personas fueron eliminadas.");

document.getElementById("formRegistro").addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("user").value;
    const email = document.getElementById("email").value;
    const contraseña = document.getElementById("password").value;
    const notas = document.getElementById("nota");

    const personasGuardadas =JSON.parse(localStorage.getItem("personas")) || [];

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
      notas.innerText = "El correo electrónico no es válido.";
      return;
    }

    // Validar contraseña: mínimo 8 caracteres, al menos una mayúscula y un número
    const contraseñaValida = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(
      contraseña
    );
    if (!contraseñaValida) {
      notas.innerText =
        "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.";
      return;
    }

    if (personasGuardadas.some((p) => p.email === email)) {
      notas=this.innerHTML="Este email ya está registrado.";
      return;
    }

    const persona = {
      nombre,
      email,
      contraseña,
      numeroCuenta: numeroCuentaUnico(),
      saldo: 0,
    };

    personasGuardadas.push(persona);
    localStorage.setItem("personas", JSON.stringify(personasGuardadas));

    alert("Registro exitoso. Tu número de cuenta es: " + persona.numeroCuenta);
    this.reset(); // limpia el formulario
  });

document.getElementById("formLogin").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const personas = JSON.parse(localStorage.getItem("personas")) || [];

  // Buscar persona que coincida con el email y contraseña
  const usuarioEncontrado = personas.find(
    (p) => p.email === email && p.contraseña === password
  );

  if (usuarioEncontrado) {
    // Guardar sesión activa (opcional)
    localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));

    // Redirigir al otro HTML
    window.location.href = "visual.html"; // cambia "home.html" por la página a la que quieres ir
  } else {
    alert("Email o contraseña incorrectos.");
  }
});



