# LABORATORIO 08 – SISTEMA DE GESTIÓN FINANCIERA

## 1. Descripción del proyecto

El proyecto consiste en desarrollar una aplicación web para gestionar las finanzas personales. Permite registrar fuentes de ingresos, agregar ingresos y gastos, consultar movimientos y visualizar resúmenes financieros.

La aplicación utiliza HTML, CSS y JavaScript. También integra Supabase para la autenticación de usuarios y el almacenamiento de información.

**Enlace de la aplicación publicada:**

https://alamaronald-maker.github.io/lab08-dom/tarea/

## 2. Diseño de clases en JavaScript

Para organizar la información se implementaron dos clases propias:

### Clase FuenteIngreso

Representa una fuente de ingreso del usuario.

- **Constructor:** recibe el identificador y el nombre de la fuente.
- **Atributos:**
  - `id`: identificador de la fuente.
  - `nombre`: nombre de la fuente de ingreso.
- **Método:** `descripcion()`, devuelve el nombre de la fuente para mostrarlo en la página.

### Clase MovimientoFinanciero

Representa un movimiento financiero, que puede ser un ingreso o un gasto.

- **Constructor:** recibe el identificador, tipo, fuente, descripción, monto y fecha.
- **Atributos:**
  - `id`: identificador del movimiento.
  - `tipo`: indica si es ingreso o gasto.
  - `fuenteId`: identifica la fuente relacionada.
  - `descripcionTexto`: detalle del movimiento.
  - `monto`: cantidad de dinero.
  - `fecha`: fecha del movimiento.
- **Método:** `descripcion()`, genera un texto con el signo correspondiente, el monto y la descripción del movimiento.

Estas clases permiten organizar los datos y mostrar la información de cada objeto en la interfaz.

## 3. Manejo de eventos

Se utilizaron diferentes eventos de JavaScript para permitir la interacción con el usuario:

- `submit`: permite procesar los formularios para registrar información.
- `click`: permite ejecutar acciones mediante botones, como editar o eliminar registros.
- `change`: permite detectar cambios en los controles de selección.
- Eventos de actividad del documento: permiten controlar la inactividad del usuario para cerrar la sesión después de 15 minutos.

## 4. Manipulación del DOM

Se utilizó JavaScript para modificar dinámicamente el contenido de la página.

Se empleó `document.createElement()` para crear elementos HTML, como:

- Elementos `li` para mostrar registros.
- Elementos `button` para ejecutar acciones.
- Elementos `option` para las opciones de selección.
- Elementos `span` para mostrar información.

También se utilizaron métodos como `appendChild()` para incorporar los elementos creados a la página.

De esta manera, el usuario puede visualizar, editar y eliminar fuentes de ingresos y movimientos financieros sin tener que modificar directamente el HTML.

## 5. Pruebas realizadas

| N.º | Prueba | Resultado esperado | Resultado obtenido |
|---|---|---|---|
| 1 | Registrar una fuente de ingreso. | La fuente aparece en la lista. | Correcto. |
| 2 | Registrar un ingreso. | Se actualiza el resumen financiero. | Correcto. |
| 3 | Registrar un gasto. | Se actualizan los gastos y el saldo. | Correcto. |
| 4 | Iniciar sesión con otro usuario. | Se muestran únicamente sus propios registros. | Correcto. |
| 5 | Consultar el panel de administración. | Se muestra el total de usuarios registrados. | Correcto. |

## 6. Seguridad y almacenamiento

Se utilizó Supabase para la autenticación y el almacenamiento de datos.

Se configuraron políticas de seguridad a nivel de fila (RLS) para que cada usuario pueda acceder únicamente a sus propios registros financieros.

Además, se implementó un control de inactividad que cierra la sesión después de 15 minutos sin actividad.

## 7. Conclusiones

- Se aplicaron conceptos de programación orientada a objetos mediante la creación de clases, constructores, atributos y métodos.
- Se utilizaron eventos de JavaScript para responder a las acciones del usuario.
- Se aplicó manipulación del DOM para crear y actualizar elementos dinámicamente.
- Se implementaron operaciones para registrar, editar y eliminar información.
- Se integró Supabase para gestionar usuarios y almacenar información de manera segura.
- Se publicó la aplicación web mediante GitHub Pages.

El desarrollo de este laboratorio permitió reforzar los conocimientos de JavaScript, manipulación del DOM y desarrollo de aplicaciones web interactivas.