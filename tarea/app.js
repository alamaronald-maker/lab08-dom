
// ==========================================
// MI CONTROL FINANCIERO
// SUPABASE + SESIONES + DATOS POR USUARIO
// PANEL DE ADMINISTRADOR
// ==========================================

// 1. CONEXIÓN CON SUPABASE

const SUPABASE_URL = "https://yxxvjoozsfatcpvbkdiy.supabase.co";
const SUPABASE_KEY = "sb_publishable_ShvdBbBXmiBtQS6SMFgc3A_WhmsP_19";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
    {
        auth: {
            persistSession: true,
            storage: window.sessionStorage,
            autoRefreshToken: true,
            detectSessionInUrl: false
        }
    }
);

// 2. VARIABLES

let usuarioActual = null;
let fuentes = [];
let movimientos = [];
let temporizadorInactividad = null;

const TIEMPO_INACTIVIDAD = 15 * 60 * 1000;

// 3. CLASES

class FuenteIngreso {
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    descripcion() {
        return this.nombre;
    }
}

class MovimientoFinanciero {
    constructor(id, tipo, fuenteId, descripcion, monto, fecha) {
        this.id = id;
        this.tipo = tipo;
        this.fuenteId = fuenteId;
        this.descripcionTexto = descripcion;
        this.monto = Number(monto);
        this.fecha = fecha;
    }

    descripcion() {
        const signo = this.tipo === "ingreso" ? "+" : "-";
        return signo + " S/ " + this.monto.toFixed(2) +
            " - " + this.descripcionTexto;
    }
}

// 4. ELEMENTOS HTML

const formularioAcceso = document.getElementById("formAcceso");
const botonRegistro = document.getElementById("btnRegistro");
const mensajeAcceso = document.getElementById("mensajeAcceso");
const appContenido = document.getElementById("appContenido");

const seccionAcceso =
    document.getElementById("seccionAcceso") ||
    formularioAcceso?.closest("section");

function obtenerElemento(id) {
    return document.getElementById(id);
}

// 5. MENSAJES Y PANTALLAS

function mostrarMensajeAcceso(mensaje) {
    if (mensajeAcceso) {
        mensajeAcceso.textContent = mensaje;
    }
}

function mostrarPantallaAcceso() {
    if (seccionAcceso) {
        seccionAcceso.hidden = false;
    }

    if (appContenido) {
        appContenido.hidden = true;
    }

    const panel = obtenerElemento("panelAdministrador");

    if (panel) {
        panel.hidden = true;
    }
}

async function mostrarAplicacion() {
    if (seccionAcceso) {
        seccionAcceso.hidden = true;
    }

    if (appContenido) {
        appContenido.hidden = false;
    }

    const elementoUsuario = obtenerElemento("usuarioActual");

    if (elementoUsuario && usuarioActual) {
        elementoUsuario.textContent = usuarioActual.email || "";
    }

    await cargarPanelAdministrador();
}

// 6. PANEL DE ADMINISTRADOR

async function cargarPanelAdministrador() {
    const panel = obtenerElemento("panelAdministrador");
    const total = obtenerElemento("totalUsuarios");
    const lista = obtenerElemento("listaUsuarios");
    const mensaje = obtenerElemento("mensajeAdministrador");

    if (!panel || !total || !lista || !mensaje) {
        console.warn("No se encontraron los elementos del panel administrador.");
        return;
    }

    panel.hidden = true;
    lista.innerHTML = "";
    total.textContent = "0";
    mensaje.textContent = "";

    if (!usuarioActual) return;

    try {
        mensaje.textContent = "Verificando permisos de administrador...";

        const { data, error } = await supabaseClient.functions.invoke(
            "panel-administrador",
            {
                body: {}
            }
        );

        if (error) {
            console.error("Error al consultar el panel:", error);
            mensaje.textContent = "";
            return;
        }

        // La función devuelve total y usuarios.
        // No devuelve una propiedad llamada "correcto".
        if (!data || !Array.isArray(data.usuarios)) {
            mensaje.textContent = "";
            return;
        }

        panel.hidden = false;
        total.textContent = String(data.total ?? data.usuarios.length);

        data.usuarios.forEach(usuario => {
            const elemento = document.createElement("li");
            elemento.textContent =
                usuario.email || "Sin correo registrado";

            lista.appendChild(elemento);
        });

        mensaje.textContent = "Usuarios cargados correctamente.";

    } catch (error) {
        console.error("Error en el panel administrador:", error);
        panel.hidden = true;
        mensaje.textContent = "";
    }
}

// 7. INICIAR SESIÓN

if (formularioAcceso) {
    formularioAcceso.addEventListener("submit", async evento => {
        evento.preventDefault();

        const correo = obtenerElemento("correo")?.value.trim();
        const contrasena = obtenerElemento("contrasena")?.value;

        if (!correo || !contrasena) {
            mostrarMensajeAcceso("Escribe tu correo y contraseña.");
            return;
        }

        mostrarMensajeAcceso("Conectando con Supabase...");

        try {
            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email: correo,
                    password: contrasena
                });

            if (error) {
                mostrarMensajeAcceso(
                    "Error al iniciar sesión: " + error.message
                );
                return;
            }

            usuarioActual = data.user;

            await cargarDatosUsuario();
            await mostrarAplicacion();

            mostrarMensajeAcceso("");
            reiniciarTemporizadorInactividad();

        } catch (error) {
            mostrarMensajeAcceso(
                "No se pudo iniciar la aplicación: " + error.message
            );
            console.error(error);
        }
    });
}

// 8. CREAR CUENTA

if (botonRegistro) {
    botonRegistro.addEventListener("click", async () => {
        const correo = obtenerElemento("correo")?.value.trim();
        const contrasena = obtenerElemento("contrasena")?.value;

        if (!correo || !contrasena) {
            mostrarMensajeAcceso("Escribe tu correo y contraseña.");
            return;
        }

        if (contrasena.length < 6) {
            mostrarMensajeAcceso(
                "La contraseña debe tener al menos 6 caracteres."
            );
            return;
        }

        mostrarMensajeAcceso("Creando cuenta...");

        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email: correo,
                password: contrasena
            });

            if (error) {
                mostrarMensajeAcceso(
                    "Error al crear cuenta: " + error.message
                );
                return;
            }

            if (data.session && data.user) {
                usuarioActual = data.user;

                await cargarDatosUsuario();
                await mostrarAplicacion();

                mostrarMensajeAcceso("");
                reiniciarTemporizadorInactividad();

            } else {
                mostrarMensajeAcceso(
                    "Cuenta creada. Revisa tu correo para confirmar el registro."
                );
            }

        } catch (error) {
            mostrarMensajeAcceso(
                "No se pudo conectar con Supabase: " + error.message
            );
            console.error(error);
        }
    });
}

// 9. CERRAR SESIÓN

async function cerrarSesion(mensaje) {
    clearTimeout(temporizadorInactividad);

    const { error } = await supabaseClient.auth.signOut();

    usuarioActual = null;
    fuentes = [];
    movimientos = [];

    mostrarPantallaAcceso();

    if (formularioAcceso) {
        formularioAcceso.reset();
    }

    if (error) {
        mostrarMensajeAcceso("La sesión terminó. Vuelve a ingresar.");
    } else {
        mostrarMensajeAcceso(mensaje);
    }
}

const botonCerrarSesion = obtenerElemento("btnCerrarSesion");

if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener("click", async () => {
        await cerrarSesion("Sesión cerrada correctamente.");
    });
}

// 10. CIERRE AUTOMÁTICO POR INACTIVIDAD

function reiniciarTemporizadorInactividad() {
    if (!usuarioActual) return;

    clearTimeout(temporizadorInactividad);

    temporizadorInactividad = setTimeout(() => {
        cerrarSesion(
            "Tu sesión se cerró por 15 minutos de inactividad."
        );
    }, TIEMPO_INACTIVIDAD);
}

[
    "click",
    "mousemove",
    "keydown",
    "scroll",
    "touchstart"
].forEach(evento => {
    document.addEventListener(evento, () => {
        if (usuarioActual) {
            reiniciarTemporizadorInactividad();
        }
    });
});

// 11. CARGAR DATOS DEL USUARIO

async function cargarDatosUsuario() {
    await cargarFuentes();
    await cargarMovimientos();

    const campoFecha = obtenerElemento("fecha");

    if (campoFecha) {
        campoFecha.value = obtenerFechaActual();
    }

    mostrarFuentes();
    mostrarMovimientos();
    actualizarResumen();
    actualizarSelectorFuente();
}

// 12. CARGAR FUENTES

async function cargarFuentes() {
    const { data, error } = await supabaseClient
        .from("fuentes_ingreso")
        .select("*")
        .order("creado_en", { ascending: true });

    if (error) {
        throw new Error("Error al cargar fuentes: " + error.message);
    }

    fuentes = (data || []).map(dato =>
        new FuenteIngreso(dato.id, dato.nombre)
    );
}

// 13. CARGAR MOVIMIENTOS

async function cargarMovimientos() {
    const { data, error } = await supabaseClient
        .from("movimientos")
        .select("*")
        .order("fecha", { ascending: false });

    if (error) {
        throw new Error("Error al cargar movimientos: " + error.message);
    }

    movimientos = (data || []).map(dato =>
        new MovimientoFinanciero(
            dato.id,
            dato.tipo,
            dato.fuente_id || "",
            dato.descripcion,
            dato.monto,
            dato.fecha
        )
    );
}

// 14. MOSTRAR FUENTES

function mostrarFuentes() {
    const lista = obtenerElemento("listaFuentes");
    const selector = obtenerElemento("fuenteMovimiento");

    if (!lista || !selector) return;

    lista.innerHTML = "";

    const seleccionAnterior = selector.value;

    selector.innerHTML =
        '<option value="">Selecciona una fuente</option>';

    fuentes.forEach(fuente => {
        const elemento = document.createElement("li");
        elemento.textContent = fuente.descripcion() + " ";

        const botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";
        botonEditar.addEventListener("click", () => editarFuente(fuente.id));

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.addEventListener("click", () => eliminarFuente(fuente.id));

        elemento.appendChild(botonEditar);
        elemento.appendChild(botonEliminar);
        lista.appendChild(elemento);

        const opcion = document.createElement("option");
        opcion.value = fuente.id;
        opcion.textContent = fuente.nombre;
        selector.appendChild(opcion);
    });

    selector.value = seleccionAnterior;
}

// 15. AGREGAR FUENTE

const formularioFuente = obtenerElemento("formFuente");

if (formularioFuente) {
    formularioFuente.addEventListener("submit", async evento => {
        evento.preventDefault();

        if (!usuarioActual) {
            alert("Debes iniciar sesión.");
            return;
        }

        const campoNombre = obtenerElemento("nombreFuente");
        const nombre = campoNombre?.value.trim();

        if (!nombre) {
            alert("Escribe el nombre de la fuente.");
            return;
        }

        const { error } = await supabaseClient
            .from("fuentes_ingreso")
            .insert({ nombre });

        if (error) {
            alert("Error al guardar fuente: " + error.message);
            return;
        }

        await cargarFuentes();
        mostrarFuentes();

        campoNombre.value = "";
        campoNombre.focus();
    });
}

// 16. EDITAR FUENTE

async function editarFuente(id) {
    const fuente = fuentes.find(item => String(item.id) === String(id));

    if (!fuente) return;

    const nuevoNombre = prompt("Escribe el nuevo nombre:", fuente.nombre);

    if (nuevoNombre === null) return;

    if (!nuevoNombre.trim()) {
        alert("El nombre no puede estar vacío.");
        return;
    }

    const { error } = await supabaseClient
        .from("fuentes_ingreso")
        .update({ nombre: nuevoNombre.trim() })
        .eq("id", id);

    if (error) {
        alert("Error al modificar fuente: " + error.message);
        return;
    }

    await cargarFuentes();
    mostrarFuentes();
    mostrarMovimientos();
}

// 17. ELIMINAR FUENTE

async function eliminarFuente(id) {
    const fuente = fuentes.find(item => String(item.id) === String(id));

    if (!fuente) return;

    const tieneMovimientos = movimientos.some(
        item => String(item.fuenteId) === String(id)
    );

    let mensaje = "¿Deseas eliminar la fuente " + fuente.nombre + "?";

    if (tieneMovimientos) {
        mensaje +=
            "\n\nSus movimientos anteriores se conservarán en el historial.";
    }

    if (!confirm(mensaje)) return;

    const { error } = await supabaseClient
        .from("fuentes_ingreso")
        .delete()
        .eq("id", id);

    if (error) {
        alert("Error al eliminar fuente: " + error.message);
        return;
    }

    await cargarFuentes();
    await cargarMovimientos();

    mostrarFuentes();
    mostrarMovimientos();
    actualizarResumen();
}

// 18. REGISTRAR MOVIMIENTO

const formularioMovimiento = obtenerElemento("formMovimiento");

if (formularioMovimiento) {
    formularioMovimiento.addEventListener("submit", async evento => {
        evento.preventDefault();

        if (!usuarioActual) {
            alert("Debes iniciar sesión para registrar movimientos.");
            return;
        }

        const tipo = obtenerElemento("tipo")?.value;
        const fuenteId = obtenerElemento("fuenteMovimiento")?.value;
        const descripcion = obtenerElemento("descripcion")?.value.trim();
        const monto = Number(obtenerElemento("monto")?.value);
        const fecha = obtenerElemento("fecha")?.value;

        if (tipo === "ingreso" && !fuenteId) {
            alert("Selecciona una fuente de ingreso.");
            return;
        }

        if (!descripcion) {
            alert("Escribe una descripción.");
            return;
        }

        if (!Number.isFinite(monto) || monto <= 0) {
            alert("Ingresa un monto mayor que cero.");
            return;
        }

        if (!fecha) {
            alert("Selecciona una fecha.");
            return;
        }

        const { error } = await supabaseClient
            .from("movimientos")
            .insert({
                tipo,
                fuente_id: tipo === "ingreso" ? fuenteId : null,
                descripcion,
                monto,
                fecha
            });

        if (error) {
            alert("Error al guardar movimiento: " + error.message);
            console.error(error);
            return;
        }

        await cargarMovimientos();

        mostrarMovimientos();
        actualizarResumen();

        formularioMovimiento.reset();

        const campoFecha = obtenerElemento("fecha");

        if (campoFecha) {
            campoFecha.value = obtenerFechaActual();
        }

        actualizarSelectorFuente();

        alert("Movimiento guardado correctamente.");
    });
}

// 19. MOSTRAR HISTORIAL

function mostrarMovimientos() {
    const lista = obtenerElemento("listaMovimientos");

    if (!lista) return;

    lista.innerHTML = "";

    movimientos.forEach(movimiento => {
        const elemento = document.createElement("li");

        const fuente = fuentes.find(
            item => String(item.id) === String(movimiento.fuenteId)
        );

        const nombreFuente = movimiento.tipo === "ingreso"
            ? (fuente ? fuente.nombre : "Fuente eliminada")
            : "Gasto";

        const tipoTexto = movimiento.tipo === "ingreso"
            ? "Ingreso"
            : "Gasto";

        const detalle = document.createElement("span");

        detalle.textContent =
            tipoTexto + " | " +
            nombreFuente + " | " +
            movimiento.descripcion() + " | " +
            movimiento.fecha + " ";

        elemento.appendChild(detalle);

        const botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";
        botonEditar.addEventListener(
            "click",
            () => editarMovimiento(movimiento.id)
        );

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.addEventListener(
            "click",
            () => eliminarMovimiento(movimiento.id)
        );

        elemento.appendChild(botonEditar);
        elemento.appendChild(botonEliminar);
        lista.appendChild(elemento);
    });
}

// 20. EDITAR MOVIMIENTO

async function editarMovimiento(id) {
    const movimiento = movimientos.find(
        item => String(item.id) === String(id)
    );

    if (!movimiento) return;

    const nuevoTipo = prompt(
        "Tipo de movimiento:\n1. Ingreso\n2. Gasto",
        movimiento.tipo === "ingreso" ? "1" : "2"
    );

    if (nuevoTipo === null) return;

    if (nuevoTipo !== "1" && nuevoTipo !== "2") {
        alert("Selecciona 1 para ingreso o 2 para gasto.");
        return;
    }

    const tipo = nuevoTipo === "1" ? "ingreso" : "gasto";
    let fuenteId = null;

    if (tipo === "ingreso") {
        if (fuentes.length === 0) {
            alert("Primero debes registrar una fuente de ingreso.");
            return;
        }

        let opciones = "Selecciona una fuente:\n";

        fuentes.forEach((fuente, indice) => {
            opciones += (indice + 1) + ". " + fuente.nombre + "\n";
        });

        const anterior = fuentes.findIndex(
            item => String(item.id) === String(movimiento.fuenteId)
        );

        const numero = prompt(
            opciones,
            anterior >= 0 ? String(anterior + 1) : "1"
        );

        if (numero === null) return;

        const indice = Number(numero) - 1;

        if (
            !Number.isInteger(indice) ||
            indice < 0 ||
            indice >= fuentes.length
        ) {
            alert("La fuente seleccionada no es válida.");
            return;
        }

        fuenteId = fuentes[indice].id;
    }

    const nuevaDescripcion = prompt(
        "Nueva descripción:",
        movimiento.descripcionTexto
    );

    if (nuevaDescripcion === null) return;

    if (!nuevaDescripcion.trim()) {
        alert("La descripción no puede estar vacía.");
        return;
    }

    const nuevoMonto = prompt("Nuevo monto:", String(movimiento.monto));

    if (nuevoMonto === null) return;

    const monto = Number(nuevoMonto);

    if (!Number.isFinite(monto) || monto <= 0) {
        alert("El monto debe ser mayor que cero.");
        return;
    }

    const nuevaFecha = prompt(
        "Nueva fecha (AAAA-MM-DD):",
        movimiento.fecha
    );

    if (nuevaFecha === null) return;

    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(nuevaFecha) ||
        Number.isNaN(Date.parse(nuevaFecha + "T00:00:00"))
    ) {
        alert("La fecha no tiene un formato válido.");
        return;
    }

    const { error } = await supabaseClient
        .from("movimientos")
        .update({
            tipo,
            fuente_id: fuenteId,
            descripcion: nuevaDescripcion.trim(),
            monto,
            fecha: nuevaFecha
        })
        .eq("id", id);

    if (error) {
        alert("Error al modificar movimiento: " + error.message);
        return;
    }

    await cargarMovimientos();
    mostrarMovimientos();
    actualizarResumen();
}

// 21. ELIMINAR MOVIMIENTO

async function eliminarMovimiento(id) {
    const movimiento = movimientos.find(
        item => String(item.id) === String(id)
    );

    if (!movimiento) return;

    const confirmar = confirm(
        "¿Deseas eliminar este movimiento?\n\n" +
        movimiento.descripcion()
    );

    if (!confirmar) return;

    const { error } = await supabaseClient
        .from("movimientos")
        .delete()
        .eq("id", id);

    if (error) {
        alert("Error al eliminar movimiento: " + error.message);
        return;
    }

    await cargarMovimientos();
    mostrarMovimientos();
    actualizarResumen();
}

// 22. FECHA ACTUAL

function obtenerFechaActual() {
    const hoy = new Date();

    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    return anio + "-" + mes + "-" + dia;
}

// 23. RESUMEN DIARIO Y MENSUAL

function actualizarResumen() {
    const hoy = obtenerFechaActual();
    const mesActual = hoy.slice(0, 7);

    let ingresosDia = 0;
    let gastosDia = 0;
    let ingresosMes = 0;
    let gastosMes = 0;

    movimientos.forEach(movimiento => {
        const monto = Number(movimiento.monto);

        if (movimiento.fecha === hoy) {
            if (movimiento.tipo === "ingreso") {
                ingresosDia += monto;
            } else {
                gastosDia += monto;
            }
        }

        if (movimiento.fecha.slice(0, 7) === mesActual) {
            if (movimiento.tipo === "ingreso") {
                ingresosMes += monto;
            } else {
                gastosMes += monto;
            }
        }
    });

    const elementosResumen = {
        ingresosDia,
        gastosDia,
        saldoDia: ingresosDia - gastosDia,
        ingresosMes,
        gastosMes,
        saldoMes: ingresosMes - gastosMes
    };

    Object.entries(elementosResumen).forEach(([id, valor]) => {
        const elemento = obtenerElemento(id);

        if (elemento) {
            elemento.textContent = "S/ " + valor.toFixed(2);
        }
    });
}

// 24. SELECTOR DE FUENTES

function actualizarSelectorFuente() {
    const tipoElemento = obtenerElemento("tipo");
    const selector = obtenerElemento("fuenteMovimiento");

    if (!tipoElemento || !selector) return;

    selector.disabled = tipoElemento.value === "gasto";
}

const selectorTipo = obtenerElemento("tipo");

if (selectorTipo) {
    selectorTipo.addEventListener(
        "change",
        actualizarSelectorFuente
    );
}

// 25. RECUPERAR SESIÓN AL RECARGAR

async function iniciarAplicacion() {
    mostrarPantallaAcceso();

    try {
        const { data, error } = await supabaseClient.auth.getSession();

        if (error) {
            mostrarMensajeAcceso(
                "No se pudo recuperar la sesión: " + error.message
            );
            return;
        }

        if (data.session) {
            usuarioActual = data.session.user;

            await cargarDatosUsuario();
            await mostrarAplicacion();

            reiniciarTemporizadorInactividad();
        }

    } catch (error) {
        mostrarMensajeAcceso(
            "No se pudo iniciar la aplicación: " + error.message
        );
        console.error(error);
    }
}

// 26. INICIAR APLICACIÓN

iniciarAplicacion();

console.log("Mi Control Financiero conectado con Supabase.");
