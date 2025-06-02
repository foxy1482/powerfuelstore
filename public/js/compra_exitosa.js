// CARGA DE LA LISTA DE PRODUCTOS

const tablaProductos = document.querySelector(".factura__tabla > tbody");
const carro = JSON.parse(localStorage.getItem("carro"));
const subtotalElement = document.getElementById("tablaSubtotal");
const totalElement = document.getElementById("tablaTotal");

const obtenerIdFactura = async ()=>
{
    //Obtener primero el id usuario

    const nuevoContacto = JSON.parse(localStorage.getItem("nuevoContacto"));
    const user = nuevoContacto.username;
    const email = nuevoContacto.email;
    const id_usuario = await obtenerUsuario(user, email);
    const total = parseFacturacion().facturacion.total;
    const res = await fetch(`/api/buscarIdPedido/${id_usuario}/${total}`);
    const data = await res.json();
    return data[0].id;
}

const introducirVariables = async ()=>
    {
        // Selección
    const numFacturaElement1 = document.getElementById("pedidoId")
    const numFactura = await obtenerIdFactura();
    
    // Modificación

    numFacturaElement1.textContent += numFactura;
}

const imprimirFactura = ()=>
{
    window.location.href = "/factura";
}

const volverInicio = ()=>
{
    window.location.href = "/";
}
/* EJECUCION DE FUNCIONES */

introducirVariables();