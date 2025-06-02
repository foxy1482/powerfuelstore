/* FUNCIONAMIENTO DEL NAV */

const navToggler = document.querySelector(".navbar-toggler");
const collapse = document.getElementById("navbarNav");
const oculto = document.querySelector(".oculto");
const carruselMasVendidos = document.querySelector(".most-selled > ul");

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

/* Carga de productos en la página de inicio */

cargarArray(obtenerProductosMasVendidos(),carruselMasVendidos,"");

/* INICIAR SESION */

const cookiesArray = document.cookie.split(';')
.reduce((acc,cookie) => {
    let [name, value] = cookie.trim().split('=');
    acc[name] = isNaN(value) ? value : Number(value);
    return acc;
},{});
if (cookiesArray) cookiesArray.email = cookiesArray.email.replace(/%40/g, '@');
if (cookiesArray) cookiesArray.usuario = cookiesArray.usuario.replace(/%20/g, ' ');

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

const cerrarSesion = ()=>{
    if (cookiesArray.usuario != ""){
        for (const cookie of document.cookie.split(";")) {
            const nombre = cookie.split("=")[0].trim();
            document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
        window.location.href = "/";
    }
    else alert("No fue posible cerrar la sesión, porque no había ninguna abierta.")

}
const eliminarCuenta = ()=>{
    const id = cookiesArray.userId;
    fetch(`api/eliminarCuenta/${id}`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.text())
    .then(data => console.log(data));
    cerrarSesion();

}

if (cookiesArray) {
    const button_profile = document.querySelector(".navbar-profile > a");
    button_profile.href = `${window.location.origin}/perfil`
    document.querySelector(".navbar-user").remove();
    const usuario = document.createElement("label");
    usuario.innerHTML = cookiesArray.usuario;
    usuario.classList.add("navbar-username")
    button_profile.appendChild(usuario)

    /* PÁGINA DE PERFIL */
    if (window.location.pathname.includes("perfil")) {
        const username = document.querySelector(".datos__username");
        const email = document.querySelector(".datos__email");
        username.innerHTML = cookiesArray.usuario;
        email.innerHTML = cookiesArray.email;


        const logoutButton = document.querySelector(".opciones__salir > button");
        logoutButton.addEventListener("click",()=>{
            cerrarSesion();
        })
        const deleteButton = document.querySelector(".opciones__borrar > button");
        deleteButton.addEventListener("click",()=>{
            eliminarCuenta();
        })
    }
}


/* FUNCIONAMIENTO DEL CARRITO */
const carro__form = document.querySelector(".carro__datos > form")
const carro__confirmar = document.querySelector(".carro__confirm");

const paginaDatosEnvio = ()=>
{
    carro__form.removeChild(document.querySelector(".form__label"));
    carro__form.removeChild(document.querySelector(".form__textarea"));
    carro__form.removeChild(document.querySelector(".form__label"));
    carro__form.removeChild(document.querySelector(".form__textarea"));
    carro__form.removeChild(document.querySelector(".disclaimer"));
    carro__form.removeChild(document.querySelector(".carro__confirm"));
    const direccionLabel = document.createElement("label"); direccionLabel.textContent = "Dirección"; direccionLabel.classList.add("form__label");
    const alturaLabel = document.createElement("label"); alturaLabel.textContent = "Altura"; alturaLabel.classList.add("form__label");
    const pisoLabel = document.createElement("label"); pisoLabel.textContent = "Piso"; pisoLabel.classList.add("form__label");
    const deptoLabel = document.createElement("label"); deptoLabel.textContent = "Departamento"; deptoLabel.classList.add("form__label");
    const cpLabel = document.createElement("label"); cpLabel.textContent = "Código Postal"; cpLabel.classList.add("form__label");
    const barrioLabel = document.createElement("label"); barrioLabel.textContent = "Barrio"; barrioLabel.classList.add("form__label");
    const ciudadLabel = document.createElement("label"); ciudadLabel.textContent = "Ciudad"; ciudadLabel.classList.add("form__label");
    
    const direccion = document.createElement("input"); direccion.type = "text"; direccion.name = "direccion"; direccion.required = true; direccion.classList.add("form__textarea")
    const altura = document.createElement("input"); altura.type = "number"; altura.name = "altura"; altura.required = true; altura.classList.add("form__textarea");
    const piso = document.createElement("input"); piso.type = "number"; piso.name = "piso"; piso.classList.add("form__textarea");
    const depto = document.createElement("input"); depto.type = "number"; depto.name = "depto"; depto.classList.add("form__textarea");
    const cp = document.createElement("input"); cp.type = "number"; cp.name = "codigo-postal"; cp.required = true; cp.classList.add("form__textarea");
    const barrio = document.createElement("input"); barrio.type = "text"; barrio.name = "barrio"; barrio.required = true; barrio.classList.add("form__textarea");
    const ciudad = document.createElement("select"); ciudad.name = "ciudad"; ciudad.required = true; ciudad.classList.add("form__select");
    /* CIUDADES */
    const ciudades = ["CABA","Avellaneda","Berazategui","Berisso","Brandsen","Campana","Cañuelas","Ensenada","Escobar","Esteban Echeverría","Exaltación","Ezeiza","Florencioo Varela","Gral Las Heras","Gral Rodríguez","Gral San Martín","Hurlingham","Ituzaingó","José C Paz","La Matanza","La Plata","Lanús","Lomas de Zamora","Luján","Malvinas Argentinas","Marcos Paz","Merlo","Moreno","Morón","Quilmes","Pilar","Presidente Perón","San Fernando","San Isidro","San Miguel","San Vicente","Tigre","Tres de Febrero","Vicente López","Zárate"]
    for (let i = 0; i <= 40; i++)
    {
        const ciudadElement = document.createElement("option");
        ciudadElement.id = `ciudad-${i}`;
        ciudadElement.value = ciudades[i];
        ciudadElement.textContent = ciudades[i];
        ciudad.appendChild(ciudadElement);
    }

    const pedido = document.createElement("input"); pedido.type = "submit"; pedido.value = "Realizar pedido"; pedido.classList.add("realizar-pedido");

    carro__form.appendChild(direccionLabel);
    carro__form.appendChild(direccion);
    carro__form.appendChild(alturaLabel);
    carro__form.appendChild(altura);
    carro__form.appendChild(pisoLabel);
    carro__form.appendChild(piso);
    carro__form.appendChild(deptoLabel);
    carro__form.appendChild(depto);
    carro__form.appendChild(cpLabel);
    carro__form.appendChild(cp);
    carro__form.appendChild(barrioLabel);
    carro__form.appendChild(barrio);
    carro__form.appendChild(ciudadLabel);
    carro__form.appendChild(ciudad);
    carro__form.appendChild(pedido)
}

const realizar_pedido = document.querySelector(".realizar-pedido");

const obtenerUsuario = async (user,email)=>
{
    const res = await fetch(`/api/obtenerUsuario/${user}/${email}`)
    const data = await res.json();
    console.log(data);
    return data[0].id; 
}

const realizarPedidoFunc = (id_usuario,direccion,altura,piso,depto,cp,barrio,ciudad)=>
    {
        const carrito = localStorage.getItem("carro");
        fetch("/api/nuevoPedido",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_usuario: id_usuario,
                    direccion: direccion,
                    altura: altura,
                    piso: piso,
                    depto: depto,
                    cp: cp,
                    barrio: barrio,
                    ciudad: ciudad,
                    carrito: JSON.parse(carrito)
                }),
                credentials: 'include'
            }
        )
        .then(res=> res)
        .then(data => {
            console.log(data);
            finalizarCompra(); //En checkout.js
        })
        .catch(err => console.log("Error en el fetch: " + err));
    }


if (carro__form)
{
    const formPrimerPaso = (e)=>
    {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username");
        const email = formData.get("email");
        if (!username || !email) {
            console.log("No hay datos.")
            return;
        } else {
            localStorage.setItem("nuevoContacto",JSON.stringify({username: username, email: email}));
            /* SECCION DATOS */
            paginaDatosEnvio();
            carro__form.classList.add("form-nextstep");
            carro__form.removeEventListener("submit",formPrimerPaso);

            if (carro__form.classList.contains("form-nextstep"))
            {
                carro__form.addEventListener("submit", async (e)=>
                    {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const direccion = formData.get("direccion");
                        const altura = formData.get("altura");
                        let piso = formData.get("piso");
                        let depto = formData.get("depto");
                        const cp = formData.get("codigo-postal");
                        const barrio = formData.get("barrio");
                        const ciudad = formData.get("ciudad");
                        if (!piso && !depto)
                        {
                            piso = 0;
                            depto = 0;
                        }
                        else if (!piso && depto)
                        {
                            piso = 0;
                        }
                        else if (piso && !depto)
                        {
                            depto = 0;
                        }
                        if (!direccion && !altura && !cp) console.log("No hay datos.")
                        else
                        {
                            try {
                                const nuevoContacto = JSON.parse(localStorage.getItem("nuevoContacto"));
                                const user = nuevoContacto.username;
                                const email = nuevoContacto.email;
                                const id_usuario = await obtenerUsuario(user, email);
                                realizarPedidoFunc(id_usuario, direccion, altura, piso, depto, cp, barrio, ciudad);
                            } catch (error) {
                                console.log("Error en submit: " + error);
                            }
                        }
                    }
            )
            }
        }
    }
    carro__form.addEventListener("submit",formPrimerPaso);

    
}

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