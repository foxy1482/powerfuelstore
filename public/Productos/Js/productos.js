let productos = "/Productos/Js/productos.txt";
const catalogo = document.querySelector(".catalogo");


const obtenerProducto = ()=>{
    return fetch ('/api/productos')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        return data;
    });
}

const cargarArray = async ()=>{
    const array = await obtenerProducto();
    for (let i = 0; i < array.length; i++) {
        let productoContainer = document.createElement("div");
        let elemento = document.createElement("div");
        let enlace = document.createElement("a");
        let imagen = document.createElement("img");
        let titulo = document.createElement("h3");
        let precio = document.createElement("label");
        let comprar = document.createElement("button");
        productoContainer.classList.add("producto-container");
        elemento.classList.add("elemento");
        enlace.setAttribute("href",`/productos/${array[i].id}`);
        imagen.setAttribute("src",array[i].imagen);
        imagen.classList.add("elemento-imagen");
        titulo.classList.add("elemento-titulo");
        titulo.textContent = array[i].nombre ;
        precio.classList.add("elemento-precio");
        precio.textContent = array[i].precio;
        comprar.classList.add("producto-comprar2");
        comprar.textContent = "Agregar al carrito";
        productoContainer.appendChild(elemento);
        productoContainer.appendChild(comprar);
        productoContainer.setAttribute("id",`producto${array[i].id}`)
        elemento.appendChild(enlace);
        enlace.appendChild(imagen);
        elemento.appendChild(titulo);
        elemento.appendChild(precio);
        catalogo.appendChild(productoContainer);
        elemento.style.margin = "auto";
    }
    /* CARRITO DE COMPRAS */
    
}
cargarArray();

const carritoCompras = async ()=> {
    carro = document.querySelector(".carrito_compras");
    const showHTML =()=>{
        
        if(!micarro.length){
            document.querySelector(".cart_none").innerHTML=`
            <p class="cart_empty">El carrito está vacío</p>
            `
        }
        else if (micarro.length >= 1 && document.querySelector(".cart_empty")){
            document.querySelector(".cart_none").innerHTML= ''
        }
        
        carro.textContent = '';
        let cart_total = 0;
        micarro.forEach(producto => {
            const carrito = document.querySelector(".container-carrito");
            const carrito1 = document.createElement("div"); carrito1.classList.add("cart_producto");
            let cantidadHTML = document.createElement("label"); cantidadHTML.classList.add("cart_producto-cantidad");
            let nombreHTML = document.createElement("h3"); nombreHTML.classList.add("cart_producto-nombre");
            let precioHTML = document.createElement("label"); precioHTML.classList.add("cart_producto-precio");
            let deleteHTML = document.createElement("label"); deleteHTML.classList.add("cart_delete"); deleteHTML.classList.add("material-symbols-outlined"); deleteHTML.textContent = "delete";
            carrito1.appendChild(cantidadHTML); carrito1.appendChild(nombreHTML); carrito1.appendChild(precioHTML); carrito1.appendChild(deleteHTML);
            carro.appendChild(carrito1);
            
            cart_total = cart_total + parseInt(producto.cantidad * producto.precio.slice(1));
            
            cantidadHTML.textContent = producto.cantidad;
            nombreHTML.textContent = producto.producto;
            precioHTML.textContent = producto.precio;
            carrito.style.display = "flex"; carrito.classList.remove("oculto2");
        });
        valorTotal.innerText = `$${cart_total}.00`
        console.log(micarro)
        
    }
    
    const array = await obtenerProducto();
    
    let micarro = []
    const valorTotal = document.querySelector(".cart_total");
    
    let containerElemento = document.querySelector(".catalogo");
    let i = -1;
    let o = 0;
    containerElemento.addEventListener("click", e => {
        
        if(e.target.classList.contains("producto-comprar2")) {
            const producto = e.target.previousElementSibling.lastChild.previousElementSibling.textContent;
            
            let ObjectProducto = array.find(array => array.nombre == producto);
            
            const infoProducto = {
                producto: producto,
                id: ObjectProducto.id,
                cantidad: 1,
                precio: ObjectProducto.precio
            }
            const exists = micarro.some(product => product.producto == infoProducto.producto);
            if (exists) {
                const newProducts = micarro.map(e => {
                    if (e.producto == infoProducto.producto) {e.cantidad++; return e;}
                    else return e;
                })
                micarro = [...newProducts];
            } else {
                micarro = [...micarro, infoProducto];
            }
            showHTML();
            console.log("si")
            /*if (micarro.filter(ar => ar.producto == micarro[i].producto).length >= 2) {
                o++;
                micarro[i].cantidad = o;
                console.log(micarro)
                }*/
               
               
               
            }
            /* Boton de borrar en el carrito */
        })
        carro.addEventListener("click", e=>{
            if (e.target.classList.contains("cart_delete")) {
                const producto = e.target.parentElement;
                const p_title = producto.querySelector('.cart_producto-nombre').textContent;
                micarro = micarro.filter(producto => producto.producto != p_title);
                console.log(micarro);
                showHTML();
            }
        })
    }
    carritoCompras();
    
const notFound = ()=>{
    document.querySelector(".catalogo").textContent = ""
    let aviso = document.createElement("div");
    aviso.style.color = "#f44";
    aviso.textContent = "No se encontró nada."
    document.querySelector(".catalogo").appendChild(aviso);
}

const buscar = document.getElementById("buscar");
document.querySelector(".buscador__input").addEventListener("keydown",(key)=>{
    if (key.value == "Enter") {
        hashSearch();
    }
});


buscar.addEventListener("click", ()=>{
    hashSearch()
})
const hashSearch = async ()=> {
    let input = document.querySelector(".buscador__input");
    const array = await obtenerProducto();
    let buscado = input.value.toLowerCase();
    let productosBuscados = [];
    if (buscado) {
        productosBuscados = array.filter((producto) => producto.nombre.toLowerCase().includes(buscado))
    }
    else if (!buscado) productosBuscados = array;
    if (filtros.modificado == true) {
        let productosFiltrados = [];
        if (filtros.categoria) {
            productosFiltrados = productosBuscados.filter((producto) => producto.suplemento.includes(filtros.categoria));
        }
        if (filtros.marca) {
            productosFiltrados = productosBuscados.filter((producto) => producto.marca.includes(filtros.marca));
        }
        if (filtros.preciomin && filtros.preciomax) {
            productosFiltrados = productosBuscados.filter((producto) => producto.precioIndex > filtros.preciomin && producto.precioIndex < filtros.preciomax)
        }
        if (filtros.pesomin) {

            const productosPeso = productosBuscados.map((producto) => {
                const pesoNumero = parseInt(producto.peso.replace(/\D\g/, ''));
                return {
                    ...producto,
                    peso: pesoNumero
                };
            })

            const pesomin = parseInt(filtros.pesomin.replace(/\D\g/, ''));

            productosFiltrados = productosPeso.filter((producto) => producto.peso > pesomin)
        }
        /*productosFiltrados = productosFiltrados.precio.filter((precio) => precio > filtros.preciomin);
        productosFiltrados = productosFiltrados.precio.filter((precio) => precio < filtros.preciomax);
        productosFiltrados = productosFiltrados.peso.filter((peso) => peso > filtros.pesomin);*/
        console.log(productosFiltrados);
        if (!productosFiltrados.length) notFound();
        else cargarArrayBuscado(productosFiltrados)
        return productosFiltrados;
    }
    if (!filtros.modificado && productosBuscados.length) {
        cargarArrayBuscado(productosBuscados);
    }
    console.log(buscado);
    
    history.pushState({ producto_nombre : buscado},"", `?producto_nombre=${buscado}`);
}

/* CargarArrayBuscado lo que hace es meter el array de productos en cada parte del DOM */
const cargarArrayBuscado = (arg)=>{
    const array = arg;
    console.log(array.length)
    document.querySelector(".catalogo").textContent = ""
    for (let i = 0; i < array.length; i++) {
        let productoContainer = document.createElement("div");
        let elemento = document.createElement("div");
        let enlace = document.createElement("a");
        let imagen = document.createElement("img");
        let titulo = document.createElement("h3");
        let precio = document.createElement("label");
        let comprar = document.createElement("button");
        productoContainer.classList.add("producto-container");
        elemento.classList.add("elemento");
        enlace.setAttribute("href",`/productos/${array[i].id}`);
        imagen.setAttribute("src",array[i].imagen);
        imagen.classList.add("elemento-imagen");
        titulo.classList.add("elemento-titulo");
        titulo.textContent = array[i].nombre ;
        precio.classList.add("elemento-precio");
        precio.textContent = array[i].precio;
        comprar.classList.add("producto-comprar2");
        comprar.textContent = "Agregar al carrito";
        productoContainer.appendChild(elemento);
        productoContainer.appendChild(comprar);
        productoContainer.setAttribute("id",`producto${array[i].id}`)
        elemento.appendChild(enlace);
        enlace.appendChild(imagen);
        elemento.appendChild(titulo);
        elemento.appendChild(precio);
        catalogo.appendChild(productoContainer);
        elemento.style.margin = "auto";
    }
}



/* SISTEMA DE FILTROS */




const actualizarBoton = document.getElementById("actualizarfiltros");
const filtros = {
    modificado : false,
    categoria : "",
    preciomin : 0,  
    preciomax : 0,
    marca : ``,
    pesomin : ``,
}
actualizarBoton.addEventListener("click",()=>{
    filtros.modificado = true;
    if (document.querySelector("#cat1:checked")) filtros.categoria= "Polvo";
    else if (document.querySelector("#cat2:checked")) filtros.categoria = "Pastillas";
    filtros.preciomin = parseInt(document.querySelector("#indicadorMin").textContent.replace(/[$.]/g,"").replace(/[00$]/g,""));
    filtros.preciomax = parseInt(document.querySelector("#indicadorMax").textContent.replace(/[$.]/g,"").replace(/[00$]/g,""));
    if (document.querySelector(".marca:checked")) {
        filtros.marca = document.querySelector(".marca:checked").nextElementSibling.textContent;
    }
    if (document.querySelector(".peso:checked")) filtros.pesomin = document.querySelector(".peso:checked").nextElementSibling.textContent;
    console.log(filtros)
})


/* CARRITO DE COMPRAS */

const rangoMin = document.getElementById("rangoPrecioMin");
const indicadorMin = document.getElementById("indicadorMin");
const rangoMax = document.getElementById("rangoPrecioMax");
const indicadorMax = document.getElementById("indicadorMax");
rangoMin.addEventListener("input",()=>{
    indicadorMin.textContent = `$${rangoMin.value}.00`;
})
rangoMax.addEventListener("input",()=>{
    indicadorMax.textContent = `$${rangoMax.value}.00`
})