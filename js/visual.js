//Logica al undir el boton salir
document.getElementById("salir").addEventListener("click", () => {
  window.location.href = "../index.html";
});

//logica si el usuario esta activo le muestre en pantalla su nombre de usuario, cuenta y saldo
const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

if (usuarioActivo) {
  console.log(
    "Usuario activo:",
    usuarioActivo.nombre,
    usuarioActivo.numeroCuenta
  );

  document.getElementById("saludo").innerText = "Hola, " + usuarioActivo.nombre;
  document.getElementById("numeroCuenta").innerHTML =
    usuarioActivo.numeroCuenta;
  document.getElementById("saldo").innerText = usuarioActivo.saldo;
} else {
  window.location.href = "index.html";
}

//Boton del li transferencia
document.getElementById("trans").addEventListener("click", () => {
  const depositoDiv = document.getElementById("deposito");
  const transferenciaDiv = document.getElementById("transferencia");

  // Cerrar depósito si está abierto
  if (depositoDiv.style.display === "block") {
    depositoDiv.style.display = "none";
  }

  // Alternar transferencia
  transferenciaDiv.style.display =
    transferenciaDiv.style.display === "block" ? "none" : "block";
});

//Logica de transferencia
document.getElementById("formTransferencia").addEventListener("submit", function (e) {
    e.preventDefault();

    const cuentaDestino = Number(
      document.getElementById("cuentaDestino").value
    );
    const monto = parseFloat(document.getElementById("monto").value);

    if (monto <= 0) {
      alert("Ingresa un monto válido");
      return;
    }

    const personas = JSON.parse(localStorage.getItem("personas"));
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    const origen = personas.find(
      (p) => p.numeroCuenta === usuarioActivo.numeroCuenta
    );
    const destino = personas.find((p) => p.numeroCuenta === cuentaDestino);

    if (!destino) {
      mensa.innerHTML = "¡Número de cuenta no existe!";
      return;
    }

    // Registra el movimiento AHORA que ya existe destino
    const movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
    movimientos.push({
      tipo: "Transferencia",
      fecha: new Date().toLocaleString(),
      desde: origen.numeroCuenta,
      hacia: destino.numeroCuenta,
      monto: monto,
    });

    localStorage.setItem("movimientos", JSON.stringify(movimientos));

    if (origen.saldo < monto) {
      alert("Saldo insuficiente");
      return;
    }

    // Realizar transferencia
    origen.saldo -= monto;
    destino.saldo += monto;

    // Guardar cambios en personas
    localStorage.setItem("personas", JSON.stringify(personas));

    // Actualizar usuarioActivo en localStorage
    localStorage.setItem("usuarioActivo", JSON.stringify(origen));

    // Actualizar saldo mostrado
    document.getElementById("saldo").innerText = origen.saldo;

    alert(`Transferencia de $${monto} realizada con éxito.`);

    this.reset();
  });

//Logica al undir el li de deposito

document.getElementById("depo").addEventListener("click", () => {
  const depositoDiv = document.getElementById("deposito");
  const transferenciaDiv = document.getElementById("transferencia");

  // Cerrar transferencia si está abierto
  if (transferenciaDiv.style.display === "block") {
    transferenciaDiv.style.display = "none";
  }

  // Alternar depósito
  depositoDiv.style.display = 
  depositoDiv.style.display === "block" ? "none" : "block";
});

//Logica de el formulario deposito
document.getElementById("formDeposito").addEventListener("submit", function (e) {
    e.preventDefault();

    const cuentaInput = document.getElementById("cuentaDeposito").value;
    const montoInput = document.getElementById("montoDeposito").value;
    let mensa = document.getElementById("mensaje");

    const cuentaDestino = Number(cuentaInput);
    const monto = parseFloat(montoInput);

    if (monto <= 0) {
      alert("Ingresa un monto válido");
      return;
    }

    const movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

    const personas = JSON.parse(localStorage.getItem("personas"));

    const destino = personas.find((p) => p.numeroCuenta === cuentaDestino);

    if (!destino) {
      mensa.innerHTML = "Numero de cuneta no existe!!";
      return;
    }

    movimientos.push({
      tipo: "Depósito",
      fecha: new Date().toLocaleString(),
      hacia: destino.numeroCuenta,
      monto: monto,
    });

    localStorage.setItem("movimientos", JSON.stringify(movimientos));

    destino.saldo = destino.saldo + monto;

    
    localStorage.setItem("personas", JSON.stringify(personas));

    
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (usuarioActivo && usuarioActivo.numeroCuenta === cuentaDestino) {
      usuarioActivo.saldo = destino.saldo;
      localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));

      // Opcional: actualizar el saldo en pantalla
      const saldoSpan = document.getElementById("saldo");
      if (saldoSpan) saldoSpan.innerText = usuarioActivo.saldo;
    }

    mensa.innerText = `Depósito de $${monto} exitoso.`;
    this.reset();
  });

//Logica al undir el li de movimiento y su funcionalidad

document.getElementById("movi").addEventListener("click", () => {
  const divMovimientos = document.getElementById("movimientos");
  const depositoDiv = document.getElementById("deposito");
  const transferenciaDiv = document.getElementById("transferencia");

  // Verificar el estilo computado real
  const mostrando = window.getComputedStyle(divMovimientos).display === "block";

  // Alternar visibilidad del historial
  divMovimientos.style.display = mostrando ? "none" : "block";

  // Si se va a mostrar el historial, ocultar los formularios
  if (!mostrando) {
    depositoDiv.style.display = "none";
    transferenciaDiv.style.display = "none";
  }

  const lista = document.getElementById("listaMovimientos");
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
  const movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

  
  const propios = movimientos.filter(
    (mov) => mov.desde === usuario.numeroCuenta || mov.hacia === usuario.numeroCuenta||
    mov.cuenta === usuario.numeroCuenta
  );

  lista.innerHTML = "";

  if (propios.length === 0) {
    lista.innerHTML = "<p>No hay movimientos registrados.</p>";
    return;
  }

  
  propios.forEach((mov) => {
    let descripcion = "";

    if (mov.tipo === "Transferencia") {
      descripcion = `📤 <strong>Transferencia</strong> | ${mov.fecha} | $${mov.monto}💵 pesos
        de la cuenta ${mov.desde} a la cuneta ${mov.hacia}`;
    } 
    
    else if(mov.tipo === "Depósito") {
      descripcion = `💵 <strong>Depósito</strong> | ${mov.fecha} | $${mov.monto}💵 pesos 
        de la cuenta ${mov.hacia}`;
    }

    else if(mov.tipo=== "Retiro"){
      descripcion=`📤💵 <strong>Retiro</strong> | ${mov.fecha} | $${mov.monto} 💵 pesos
      de la ecuenta ${mov.cuenta} `
    }

    lista.innerHTML += `<p>${descripcion}</p>`;
  });
});


document.getElementById("reti").addEventListener("click",()=>{
  
  const divMovimientos = document.getElementById("movimientos");
  const depositoDiv = document.getElementById("deposito");
  const transferenciaDiv = document.getElementById("transferencia");
  const retiroDiv =document.getElementById("retiro");

    if (transferenciaDiv.style.display === "block" || depositoDiv.style.display==="block" ||
      divMovimientos.style.display==="block") {
    transferenciaDiv.style.display = "none";
    depositoDiv.style.display="none";
    divMovimientos.style.display="none";
  }

  retiroDiv.style.display=
  retiroDiv.style.display === "block" ? "none" : "block";
});



document.getElementById("formRetiro").addEventListener("submit", (e)=>{
e.preventDefault();
  const retiro=document.getElementById("montoRetiro").value;
  const cuenta = JSON.parse(localStorage.getItem("usuarioActivo"));
  const texto=document.getElementById("tex");
 

  if(retiro <=0){
   alert("inserta un valor💵");
    return;
  }
  const movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
  

  movimientos.push({
    tipo: "Retiro",
    fecha:new Date().toLocaleString(),
    monto: Number(retiro),
    cuenta:cuenta.numeroCuenta
  });
  localStorage.setItem("movimientos",JSON.stringify(movimientos));

  const personas=JSON.parse(localStorage.getItem("personas"));

  const propio= personas.find(p=> p.numeroCuenta === cuenta.numeroCuenta);
  

  if( propio.saldo >= Number(retiro)){
    propio.saldo-=Number(retiro);
    localStorage.setItem("personas",JSON.stringify(personas));
    localStorage.setItem("usuarioActivo",JSON.stringify(propio));
    texto.innerHTML="Retiro exitoso de: $" + retiro;

      const nuevoSaldo = document.getElementById("saldo");
      if (nuevoSaldo) nuevoSaldo.innerText =propio.saldo;
  }
  else{
    texto.innerHTML="Saldo insuficiente";
  }

document.getElementById("formRetiro").reset();
});
