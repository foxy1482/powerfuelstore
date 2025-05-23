/* FUNCIONAMIENTO DEL NAV */

const navToggler = document.querySelector(".navbar-toggler");
const collapse = document.getElementById("navbarNav");
const oculto = document.querySelector(".oculto");

const navSearch = document.querySelector(".navbar-search");
const cuadroBusqueda = document.querySelector(".cuadro-busqueda");
navToggler.addEventListener("click",()=>{ 
    if (collapse.classList.contains("oculto")) {
        collapse.classList.remove("oculto");
    } else {
        collapse.classList.add("oculto");
    }
})

navSearch.addEventListener("click",()=>{
    if (cuadroBusqueda.style.display == "flex") cuadroBusqueda.style.display = "none";
    else cuadroBusqueda.style.display = "flex";
})
/* INICIAR SESION */
const cookiesArray = document.cookie.split(';')
.map(cookie => {
    const [name, value] = cookie.split('=');
    return { name, value };
});
if (cookiesArray[0].name != "") {
    const button_profile = document.querySelector(".navbar-profile > a");
    button_profile.href = `${window.location.origin}/perfil`
    document.querySelector(".navbar-user").remove();
    const usuario = document.createElement("label");
    usuario.innerHTML = cookiesArray[0].value;
    usuario.classList.add("navbar-username")
    button_profile.appendChild(usuario)

    /* PÁGINA DE PERFIL */
    if (window.location.pathname.includes("perfil")) {
        const username = document.querySelector(".datos__username");
        const email = document.querySelector(".datos__email");
        username.innerHTML = cookiesArray[0].value;
        email.innerHTML = cookiesArray[1].value.replace(/%40/g, '@');


        const logoutButton = document.querySelector(".opciones__salir > button")
        logoutButton.addEventListener("click",()=>{

            for (const cookie of document.cookie.split(";")) {
                const nombre = cookie.split("=")[0].trim();
                document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            }

            window.location.href = "/";
        })
        //Hacer el deleteButton 
    }
}


/* FUNCIONAMIENTO DEL CATALOGO */



/* CREACION DE PRODUCTOS */
// Este abre el carro
document.querySelector(".navbar-cart").addEventListener("click",()=>{
    if (document.querySelector(".container-carrito").classList.contains("oculto2")) document.querySelector(".container-carrito").classList.remove("oculto2");
    else document.querySelector(".container-carrito").classList.add("oculto2");
})

/* FOOTER YEAR */

const tiempoHTML = document.getElementById("footer-year");
const fecha = new Date();
tiempoHTML.textContent = fecha.getYear()+1900;