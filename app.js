
// Laboratorio 08: DOM, eventos y objetos
console.log("app.js cargado");

// ==================================
// EJERCICIO 2: DOM
// ==================================

// Cambiar el título y su color
const titulo = document.querySelector("#titulo");
titulo.textContent = "Hola TECSUP";
titulo.style.color = "blue";

// Destacar el párrafo
const mensaje = document.querySelector(".mensaje");
mensaje.classList.add("destacado");

// Agregar JavaScript a la lista
const lista = document.querySelector("#lista");
const nuevo = document.createElement("li");
nuevo.textContent = "JavaScript";
lista.appendChild(nuevo);


// ==================================
// EJERCICIO 3: EVENTOS
// ==================================

// Seleccionar los elementos
const btnSumar = document.querySelector("#btnSumar");
const btnReiniciar = document.querySelector("#btnReiniciar");
const contador = document.querySelector("#contador");

// Variable para almacenar los clics
let clics = 0;

// EVENTO DEFINITIVO: CLICK
const tipoEventoPrueba = "click";

// Evento para sumar
btnSumar.addEventListener(tipoEventoPrueba, function (evento) {
    clics++;
    contador.textContent = clics;

    console.log("Objeto evento:", evento);
    console.log("Tipo de evento:", evento.type);
    console.log("Elemento presionado:", evento.target);
});

// Evento para reiniciar
btnReiniciar.addEventListener("click", function (evento) {
    clics = 0;
    contador.textContent = clics;

    console.log("Contador reiniciado");
    console.log("Objeto evento:", evento);
});


// ==================================
// EJERCICIO 4: INPUT Y SUBMIT
// ==================================

// Seleccionar los elementos
const nombre = document.querySelector("#nombre");
const saludo = document.querySelector("#saludo");
const formulario = document.querySelector("#formulario");
const correo = document.querySelector("#correo");
const resultado = document.querySelector("#resultado");

// Evento input: mostrar el nombre escrito
nombre.addEventListener("input", function () {
    saludo.textContent = "Hola, " + nombre.value;
});

// Evento submit: validar el correo
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const correoIngresado = correo.value.trim();

    if (!correoIngresado.includes("@")) {
        resultado.textContent = "Correo no válido: falta @";
        resultado.classList.add("error");
    } else {
        resultado.textContent = "Enviado: " + correoIngresado;
        resultado.classList.remove("error");
    }

    console.log("Formulario enviado");
});


// ==================================
// EJERCICIO 5: CLASES Y OBJETOS
// ==================================

// Definir la clase Producto
class Producto {
    constructor(nombre, precio) {
        this.nombre = nombre;
        this.precio = precio;
    }

    // Calcular precio con descuento
    conDescuento(pct) {
        return this.precio * (1 - pct);
    }

    // Mostrar descripción del producto
    descripcion() {
        return this.nombre + " - S/ " + this.precio.toFixed(2);
    }
}

// Crear objetos
const laptop = new Producto("Laptop", 2500);
const mouse = new Producto("Mouse", 45);
const teclado = new Producto("Teclado", 120);

// Crear cuarto objeto
const monitor = new Producto("Monitor", 680);

// Guardar productos en un arreglo
const productos = [laptop, mouse, teclado, monitor];

// Mostrar productos en la página
const listaProductos = document.querySelector("#productos");

productos.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = p.descripcion();
    listaProductos.appendChild(li);
});

// Mensaje de confirmación
console.log("Productos cargados correctamente");
