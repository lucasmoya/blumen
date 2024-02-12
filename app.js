let pedidos = {};
let mesaSeleccionada = 1;

function handleKeyDown(event) {
    // Verifica si la tecla presionada es "Enter"
    if (event.key === 'Enter') {
        // Ejecuta la función de autenticación
        authenticate();
    }
}

function authenticate() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Verificar las credenciales
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username === 'admin' && password === 'blumen123') {
        // Mostrar el sistema POS y ocultar el formulario de inicio de sesión
        document.querySelector('.login-container').style.display = 'none';
        document.getElementById('pos-container').classList.remove('hidden');
    } else {
        alert('Credenciales incorrectas. Inténtelo de nuevo.');
    }
}


const nombreMesas = {
    1: 'Mesa 1',
    2: 'Mesa 2',
    3: 'Mesa 3',
    4: 'Mesa 4',
    5: 'Mesa 5',
    6: 'Mesa 6',
    7: 'Habitación 1',
    8: 'Habitación 2',
    9: 'Habitación 3',
    10: 'Habitación 4',
    11: 'Habitación 5A',
    12: 'Habitación 5B',
    13: 'Habitación 6',
    14: 'Habitación 7',
    15: 'Habitación 8',
    16: 'Habitación 9',
    17: 'Habitación 10',
    18: 'Habitación 11',
};

function mostrarSeccion(seccion) {
    
    const secciones = document.querySelectorAll('.menu-section');
    secciones.forEach(sec => sec.style.display = 'none');

    const seccionSeleccionada = document.getElementById(seccion);
    if (seccionSeleccionada) {
        seccionSeleccionada.style.display = 'block';
    }

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('tab-selected'));
    event.currentTarget.classList.add('tab-selected');
}

function seleccionarMesa(numeroMesa) {
    const mesaTabs = document.querySelectorAll('.mesa-tab');
    mesaTabs.forEach(tab => tab.classList.remove('mesa-tab-selected'));

    const selectedTab = document.querySelector(`.mesa-tab:nth-child(${numeroMesa})`);
    selectedTab.classList.add('mesa-tab-selected');

    mesaSeleccionada = numeroMesa;

    if (!pedidos[numeroMesa]) {
        pedidos[numeroMesa] = [];
    }

    // Verificar si la mesa actual tiene contenido y aplicar estilo en consecuencia
    const mesaActual = pedidos[mesaSeleccionada];
    if (mesaActual && mesaActual.length > 0) {
        selectedTab.classList.add('mesa-tab-has-content');
    } else {
        selectedTab.classList.remove('mesa-tab-has-content');
    }

    actualizarBoleta();
}

function addItem(nombre, precio) {
    const mesaActual = pedidos[mesaSeleccionada];

    const index = mesaActual.findIndex(item => item.nombre === nombre);
    if (index !== -1) {
        mesaActual[index].cantidad++;
    } else {
        mesaActual.push({ nombre, precio, cantidad: 1 });
    }

    actualizarBoleta();

    const selectedTab = document.querySelector(`.mesa-tab:nth-child(${mesaSeleccionada})`);
    selectedTab.classList.add('mesa-tab-has-content');
}

function agregarExtra() {
    const descripcionInput = document.getElementById('extraDescription');
    const montoInput = document.getElementById('extraAmount');

    const descripcion = descripcionInput.value;
    const monto = parseFloat(montoInput.value);

    if (descripcion && !isNaN(monto) && monto > 0) {
        // Agrega el item 'extra' a la boleta
        addItem(descripcion, monto);
        
        // Limpia los campos de entrada
        descripcionInput.value = '';
        montoInput.value = '';

        // Actualiza la boleta
        actualizarBoleta();
    } else {
        alert('Ingrese una descripción válida y un monto mayor a cero.');
    }
}


function actualizarBoleta() {
    const listaPedido = document.getElementById('pedido-list');
    listaPedido.innerHTML = '';

    const mesaActual = pedidos[mesaSeleccionada];
    if (mesaActual) {
        mesaActual.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.cantidad} - ${item.nombre} - $${item.precio * item.cantidad}`;
            listaPedido.appendChild(li);
        });

        const totalElement = document.getElementById('total');
        totalElement.textContent = calcularTotal(mesaActual);
    }
}

async function generarRecibo() {
    const mesaActual = pedidos[mesaSeleccionada];
    if (mesaActual && mesaActual.length > 0) {
        const ahora = new Date();
        const fechaHora = `${ahora.toLocaleDateString('es-ES')} ${ahora.getHours()}:${ahora.getMinutes()}:${ahora.getSeconds()}`;

        const subtotal = calcularTotal(mesaActual);
        const propinaSugerida = subtotal * 0.1; // 10% de propina
        const total = subtotal + propinaSugerida;

        const content = {
            content: [
                {
                    stack: [
                        { text: `Blumen Café & Mar`, style: 'header' },
                        { text: `${nombreMesas[mesaSeleccionada]}`, style: 'fechaHora' },
                        { text: `${fechaHora}`, style: 'fechaHora' },
                        {
                            table: {
                                widths: ['auto', '*', 'auto'],
                                body: mesaActual.map(item => [item.cantidad, item.nombre, `$${(item.precio * item.cantidad).toLocaleString('es-CL')}`]),
                            },
                            layout: {
                                defaultBorder: false,
                                paddingLeft: function () { return 10; },
                                paddingRight: function () { return 10; },
                                paddingTop: function () { return 5; },
                                paddingBottom: function () { return 5; },
                            },
                            style: 'tableStyle',
                        },
                        { text: '\n' },
                        {
                            columns: [
                                { text: 'Subtotal:', style: 'totalLabel' },
                                { text: `$${subtotal.toLocaleString('es-CL')}`, style: 'totalValue', alignment: 'right' }
                            ],
                            margin: [10, 0, 10, 0],
                        },
                        {
                            columns: [
                                { text: 'Propina Sugerida (10%):', style: 'totalLabel' },
                                { text: `$${propinaSugerida.toLocaleString('es-CL')}`, style: 'totalValue', alignment: 'right' }
                            ],
                            margin: [10, 0, 10, 0],
                        },
                        { text: '\n' },
                        {
                            columns: [
                                { text: 'Total:', style: 'totalLabel' },
                                { text: `$${total.toLocaleString('es-CL')}`, style: 'totalValue', alignment: 'right' }
                            ],
                            margin: [10, 0, 10, 0],
                        }
                    ],
                    margin: [170, 0, 150, 0],
                },
            ],
            styles: {
                header: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                mesa: {
                    fontSize: 10,
                    margin: [0, 0, 0, 10]
                },
                fechaHora: {
                    fontSize: 8,
                    margin: [0, 0, 0, 10]
                },
                totalLabel: {
                    fontSize: 8,
                    bold: true,
                },
                totalValue: {
                    fontSize: 8,
                    bold: true,
                },
                tableStyle: {
                    fontSize: 8,
                    margin: [0, 10, 0, 10],
                },
            }
        };

        const options = {
            pageSize: 'A4',
            pageMargins: [0, 198.43, 0, 198.43],
        };

        pdfMake.createPdf(content, options).download(`recibo_mesa_${mesaSeleccionada}.pdf`);

        reiniciarPedido(mesaSeleccionada);
    }
    const selectedTab = document.querySelector(`.mesa-tab:nth-child(${mesaSeleccionada})`);
    selectedTab.classList.remove('mesa-tab-has-content');
}


function reiniciarPedido(numeroMesa) {
    pedidos[numeroMesa] = [];
    actualizarBoleta();
}

function calcularTotal(pedidoActual) {
    return pedidoActual.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

function borrarElementos() {
    const confirmBorrar = confirm('¿Seguro que quieres borrar la boleta?');
    if (confirmBorrar) {
        reiniciarPedido(mesaSeleccionada);

        // Desmarcar la pestaña de la mesa después de borrar la boleta
        const selectedTab = document.querySelector(`.mesa-tab:nth-child(${mesaSeleccionada})`);
        selectedTab.classList.remove('mesa-tab-has-content');
    }
}


