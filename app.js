let pedidos = {}; // Un objeto para almacenar los pedidos de cada mesa
let mesaSeleccionada = 1;

function mostrarSeccion(seccion) {
    // Oculta todas las secciones
    const secciones = document.querySelectorAll('.menu-section');
    secciones.forEach(sec => sec.style.display = 'none');

    // Muestra la sección seleccionada
    const seccionSeleccionada = document.getElementById(seccion);
    if (seccionSeleccionada) {
        seccionSeleccionada.style.display = 'block';
    }

    // Actualiza las clases de estilo de las pestañas
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('tab-selected'));
    event.currentTarget.classList.add('tab-selected');
}

function seleccionarMesa(numeroMesa) {
    const mesaTabs = document.querySelectorAll('.mesa-tab');
    mesaTabs.forEach(tab => tab.classList.remove('mesa-tab-selected'));

    const selectedTab = document.querySelector(`.mesa-tab:nth-child(${numeroMesa})`);
    selectedTab.classList.add('mesa-tab-selected');

    // Actualiza la mesa seleccionada
    mesaSeleccionada = numeroMesa;

    // Si no hay pedidos para esta mesa, inicializa el objeto
    if (!pedidos[numeroMesa]) {
        pedidos[numeroMesa] = [];
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

        // Calcular subtotal, propina sugerida y total
        const subtotal = calcularTotal(mesaActual);
        const propinaSugerida = subtotal * 0.1; // 10% de propina
        const total = subtotal + propinaSugerida;

        const content = {
            content: [
                {
                    stack: [
                        { text: `Blumen Café & Mar`, style: 'header' },
                        { text: `Mesa: ${mesaSeleccionada}`, style: 'fechaHora' },
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
                    margin: [165, 0, 150, 0],
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

        // Limpiar la boleta de la mesa seleccionada
        reiniciarPedido(mesaSeleccionada);
    }
}


function reiniciarPedido(numeroMesa) {
    // Reinicia el objeto de pedidos para la mesa seleccionada
    pedidos[numeroMesa] = [];

    // Actualiza la boleta después de reiniciar el pedido
    actualizarBoleta();
}

function calcularTotal(pedidoActual) {
    return pedidoActual.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

function borrarElementos() {
    const confirmBorrar = confirm('¿Seguro que quieres borrar la boleta?');
    if (confirmBorrar) {
        reiniciarPedido(mesaSeleccionada);
    }
}


