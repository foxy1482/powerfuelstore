const lista_productos = document.querySelector(".carro__productos > ul");
const carro = JSON.parse(localStorage.getItem("carro"));
const subtotalElement = document.querySelector(".carro__subtotal > span");
const descuentosElement = document.querySelector(".carro__descuentos > span");
const totalElement = document.querySelector(".carro__total > span");

/* CARGA DE LOS PRODUCTOS */

const cargaProductos = ()=>
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
            const li = document.createElement("li")
            const imgElement = document.createElement("img");
            const productElement = document.createElement("h3");
            const cantidadElement = document.createElement("h4");
            const precioElement = document.createElement("h4");
            lista_productos.appendChild(li);
            imgElement.classList.add("carro__producto-img"); imgElement.src = img; li.appendChild(imgElement);
            productElement.classList.add("carro__producto-nombre"); productElement.textContent = producto; li.appendChild(productElement);
            cantidadElement.classList.add("carro__producto-cantidad"); cantidadElement.textContent = `x ${cantidad}`; li.appendChild(cantidadElement);
            // Extracción del signo de moneda
            const precioConvertido = parseFloat(precio.replace(/[$]/g,""));
            totalProducto = precioConvertido * cantidad
            let totalProducto2 = totalProducto;
            if (Number.isInteger(totalProducto2)) totalProducto2 = `${totalProducto2}.00`
                
            precioElement.classList.add("carro__producto-precio"); precioElement.textContent = `$${totalProducto2}`; li.appendChild(precioElement);
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


const autoCompleteUser = ()=>
{
    const inputUsuario = document.getElementById("inputUsername");
    const inputEmail = document.getElementById("inputEmail");
    if (cookiesArray){
    const {usuario,email} = cookiesArray;
    inputUsuario.value = usuario;
    inputEmail.value = email;
    }
    else
    {
        inputUsuario.value = "";
        inputEmail.value = "";
    }
}

const finalizarCompra = ()=>
{
    window.location.href = '/compraexitosa';
}

/* Listeners */



/* EJECUCIÓN DE FUNCIONES */

cargaProductos();
autoCompleteUser();