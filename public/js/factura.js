const obtenerUsuario = async (user,email)=>
{
    const res = await fetch(`/api/obtenerUsuario/${user}/${email}`)
    const data = await res.json();
    console.log(data);
    return data[0].id; 
}

const parseFacturacion = ()=>
{
    return document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=').map(c => c.trim());
        if (key && value) {
            if (key === "facturacion") {
            try {
                acc[key] = JSON.parse(decodeURIComponent(value));
            } catch (e) {
                acc[key] = decodeURIComponent(value);
            }
            } else {
            acc[key] = decodeURIComponent(value);
            }
        }
        return acc;
    }, {});
}

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
    const nuevoContacto = JSON.parse(localStorage.getItem("nuevoContacto"));
    const numFacturaElement2 = document.querySelector(".factura__numero");
    const usuarioElement = document.querySelector(".factura__name");
    const numFactura = await obtenerIdFactura();
    const usuario = nuevoContacto.username;
    
    // Modificación

    numFacturaElement2.textContent += numFactura;
    usuarioElement.textContent = usuario;
}

const cargaTabla = ()=>
{
    let subtotal = 0;
    // let descuentos = 0;
    let total = 0;
    /* Agregar cada uno de los elementos del carrito */
    for(let i = 0; i < carro.length; i++)
        {
        let totalProducto = 0;
        // let descuentoProducto = 0;
        const {producto, cantidad, img, precio} = carro[i];
        const li = document.createElement("tr"); li.classList.add("tabla__producto");
        const productElement = document.createElement("th");
        const cantidadElement = document.createElement("th");
        const precioElement = document.createElement("th");
        const descuentoElement= document.createElement("th");
        tablaProductos.appendChild(li);
        productElement.classList.add("tabla__producto"); productElement.classList.add("tabla__producto-nombre"); productElement.textContent = producto; li.appendChild(productElement);
        cantidadElement.classList.add("tabla__producto"); cantidadElement.classList.add("tabla__producto-cantidad"); cantidadElement.textContent = cantidad; li.appendChild(cantidadElement);
        // Extracción del signo de moneda
        const precioConvertido = parseFloat(precio.replace(/[$]/g,""));
        totalProducto = precioConvertido * cantidad
        let totalProducto2 = totalProducto;
        if (Number.isInteger(totalProducto2)) totalProducto2 = `${totalProducto2}.00`;
        precioElement.classList.add("tabla__producto"); precioElement.classList.add("carro__producto-precio"); precioElement.textContent = `$${totalProducto2}`; li.appendChild(precioElement);
        descuentoElement.classList.add("tabla__producto"); descuentoElement.classList.add("tabla__producto-descuento"); descuentoElement.textContent = "$0.00"; li.appendChild(descuentoElement);
        subtotal += totalProducto;
        // if (carro[i].descuentos) En caso de que hayan descuentos
    }
    /* Cálculo de montos, carga HTML de los mismos */
    total += subtotal + 5;
    if (Number.isInteger(subtotal)) subtotal = `${subtotal}.00`
    if (Number.isInteger(total)) total = `${total}.00`
    subtotalElement.textContent = `$${subtotal}`;
    totalElement.textContent = `$${total}`;
}

const cargaDatosEnvio = ()=>
{
    // Introduccion de los datos

    const containerEnvio = document.querySelector(".factura__envio");
    const direccionContainer = document.querySelector(".envio__direccion");
    const direccionLabel = document.createElement("label"); direccionLabel.classList.add("envio__label");    
    const alturaContainer = document.querySelector(".envio__altura");
    const alturaLabel = document.createElement("label"); alturaLabel.classList.add("envio__label");
    const pisoContainer = document.querySelector(".envio__piso");
    const pisoLabel = document.createElement("label"); pisoLabel.classList.add("envio__label");
    const departamentoContainer = document.querySelector(".envio__depto");
    const departamentoLabel = document.createElement("label"); departamentoLabel.classList.add("envio__label");
    const cpContainer = document.querySelector(".envio__cp");
    const cpLabel = document.createElement("label"); cpLabel.classList.add("envio__label");
    const barrioContainer = document.querySelector(".envio__barrio");
    const barrioLabel = document.createElement("label"); barrioLabel.classList.add("envio__label");
    const ciudadContainer = document.querySelector(".envio__ciudad");
    const ciudadLabel = document.createElement("label"); ciudadLabel.classList.add("envio__label");

    const datosFacturacion = parseFacturacion().facturacion;

    // Edicion

    direccionLabel.textContent = "Dirección: "; direccionLabel.innerHTML += `<span>${datosFacturacion.direccion}</span>`;
    alturaLabel.textContent = "Altura: "; alturaLabel.innerHTML += `<span>${datosFacturacion.altura}</span>`;
    pisoLabel.textContent = "Piso: "; pisoLabel.innerHTML += `<span>${datosFacturacion.piso}</span>`
    departamentoLabel.textContent = "Depto.: "; departamentoLabel.innerHTML += `<span>${datosFacturacion.depto}</span>`
    cpLabel.textContent = "Código Postal: "; cpLabel.innerHTML += `<span>${datosFacturacion.cp}</span>`
    barrioLabel.textContent = "Barrio: "; barrioLabel.innerHTML += `<span>${datosFacturacion.barrio}</span>`
    ciudadLabel.textContent = "Ciudad: "; ciudadLabel.innerHTML += `<span>${datosFacturacion.ciudad}</span>`

    // Guardado
    containerEnvio.appendChild(direccionContainer);
    direccionContainer.appendChild(direccionLabel);
    containerEnvio.appendChild(alturaContainer);
    alturaContainer.appendChild(alturaLabel);
    containerEnvio.appendChild(pisoContainer);
    pisoContainer.appendChild(pisoLabel);
    containerEnvio.appendChild(departamentoContainer);
    departamentoContainer.appendChild(departamentoLabel);
    containerEnvio.appendChild(cpContainer);
    cpContainer.appendChild(cpLabel);
    containerEnvio.appendChild(barrioContainer);
    barrioContainer.appendChild(barrioLabel);
    containerEnvio.appendChild(ciudadContainer);
    ciudadContainer.appendChild(ciudadLabel);
}

const descargarFactura = async ()=>
{
    const facturaElement = document.querySelector(".factura");
    const numFactura = await obtenerIdFactura();
    await html2pdf()
    .set({
        margin: 1,
        filename: `factura-n${numFactura}`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    })
    .from(facturaElement)
    .save();
    // localStorage.removeItem("nuevoContacto");
}


/* EJECUCION DE FUNCIONES */

introducirVariables();
cargaTabla();
cargaDatosEnvio();
descargarFactura();