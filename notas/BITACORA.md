# Bitácora de JavaScript interactivo

**Laboratorio 08: JavaScript Interactivo - DOM, Eventos y Objetos.**  
**Navegador usado:** Microsoft Edge

## Ejercicio 2: Seleccionar y modificar el DOM

**Actividades realizadas:**

- Seleccioné el título mediante `querySelector("#titulo")`.
- Cambié el texto del título a "Hola TECSUP".
- Modifiqué el color del título a azul.
- Destaqué el párrafo utilizando `classList.add("destacado")`.
- Creé un nuevo elemento `li` con `createElement()` y agregué JavaScript a la lista mediante `appendChild()`.

**Resultados:**

El título aparece en color azul, el párrafo tiene fondo amarillo y la lista muestra tres elementos: HTML, CSS y JavaScript. Los cambios se mantienen al recargar la página porque están escritos en `app.js`.

| Instrucción | Qué cambió en la pantalla | Se mantiene al recargar (Sí/No) |
|---|---|---|
| `textContent` desde `app.js` | Se modificó el texto del título a Hola TECSUP | Sí |
| `style.color` | El título aparece de color azul | Sí |

## Ejercicio 3: Evento click

**Actividades realizadas:**

- Seleccioné los botones Sumar 1 y Reiniciar.
- Utilicé `addEventListener("click")` para detectar los clics.
- Creé una variable llamada `clics` para almacenar el contador.
- Implementé el incremento del contador.
- Implementé el reinicio del contador a cero.
- Utilicé el objeto `evento` para mostrar información en la consola.
- Probé los eventos `click`, `dblclick` y `mouseover`, cambiando temporalmente el tipo de evento.

**Resultados:**

Al presionar Sumar 1, el contador aumenta. Al presionar Reiniciar, vuelve a cero. También comprobé que el contador responde al doble clic y al pasar el cursor sobre el botón. En la consola se muestran el objeto evento, el tipo de evento y el elemento que lo recibió.

| Tipo de evento | Qué acción lo dispara | Cuánto suma por acción |
|---|---|---|
| `click` | Un clic sobre el botón Sumar 1 | 1 |
| `dblclick` | Un doble clic sobre el botón Sumar 1 | 1 |
| `mouseover` | Pasar el cursor sobre el botón Sumar 1 | 1 por entrada del cursor |

`evento.type` muestra el nombre del evento que ocurrió, por ejemplo, `click`.

`evento.target` identifica el elemento HTML que recibió el evento, por ejemplo, el botón presionado.

Al terminar las pruebas, restauré el evento `click` en el código.

## Ejercicio 4: Eventos input y submit

**Actividades realizadas:**

- Capturé el nombre ingresado mediante un campo de texto.
- Utilicé el evento `input` para actualizar el saludo.
- Capturé el envío del formulario mediante `submit`.
- Primero probé el envío sin `preventDefault()` para observar la recarga automática de la página.
- Después utilicé `preventDefault()` para evitar que se recargue la página.
- Validé que el correo contenga el símbolo `@`.
- Mostré un mensaje de error cuando el correo no es válido y un mensaje de confirmación cuando es válido.

**Registro de resultados:**

| Prueba | Qué pasó en la pantalla | Se recargó la página (Sí/No) |
|---|---|---|
| Escribir en el campo nombre | Apareció el saludo con el nombre escrito | No |
| Enviar sin `preventDefault()` | Apareció brevemente el mensaje de envío y desapareció al recargarse la página. El campo quedó vacío | Sí |
| Enviar con `preventDefault()`, correo sin @ | Apareció "Correo no válido: falta @" en rojo | No |
| Enviar con `preventDefault()`, correo con @ | Apareció "Enviado" junto al correo ingresado | No |

## Ejercicio 5: Clases y objetos

**Actividades realizadas:**

Se trabajó con una clase llamada `Producto` para organizar la información de los productos y sus precios. La clase tiene un constructor, un método `conDescuento(pct)` para calcular descuentos y un método `descripcion()` para mostrar el nombre y el precio del producto.

**Productos mostrados en la página:**

| Producto | Precio |
|---|---:|
| Laptop | S/ 2500.00 |
| Mouse | S/ 45.00 |
| Teclado | S/ 120.00 |
| Monitor | S/ 680.00 |

**Pruebas realizadas en la consola:**

| Instrucción | Resultado |
|---|---|
| `laptop.descripcion()` | Laptop - S/ 2500.00 |
| `mouse.conDescuento(0.25)` | 33.75 |
| `teclado.conDescuento(0.10)` | 108 |

**Tabla de productos con descuento del 25 %:**

| Objeto | nombre | precio | `conDescuento(0.25)` |
|---|---|---:|---:|
| laptop | Laptop | S/ 2500.00 | S/ 1875.00 |
| mouse | Mouse | S/ 45.00 | S/ 33.75 |
| teclado | Teclado | S/ 120.00 | S/ 90.00 |

**Ventaja de utilizar clases:**

Utilizar una clase permite organizar y reutilizar el código, creando varios productos con una misma estructura. Así evitamos escribir cada producto manualmente en HTML y facilitamos el mantenimiento del proyecto.

## Conclusiones

Durante este laboratorio aprendí a manipular elementos HTML desde JavaScript, modificar textos y estilos, y crear nuevos elementos en una página web.

También aprendí a trabajar con eventos como `click`, `dblclick`, `mouseover`, `input` y `submit`, controlar el envío de formularios y validar información ingresada por el usuario.

Finalmente, comprendí la utilidad de las clases y los objetos para organizar información y reutilizar código.