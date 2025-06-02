const catalogo = document.querySelector(".catalogo");
const carro = document.querySelector(".carrito_compras");

cargarArray(obtenerProducto(),catalogo,"2");

/* CARRITO DE COMPRAS */

carritoCompras(carro);

const buscar = document.getElementById("buscar");
document.querySelector(".buscador__input").addEventListener("keydown",(key)=>{
    if (key.value == "Enter") {
        hashSearch(catalogo);
    }
});


buscar.addEventListener("click", ()=>{
    hashSearch(catalogo)
})

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
