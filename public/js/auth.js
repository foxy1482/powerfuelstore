function mostrarContraseña () {
    const password = document.getElementById("password");
    const checkbox = document.getElementById("checkbox");

    if (checkbox.checked) {
        password.type = 'text'
    }
    else {
        password.type = 'password'
    }
}

const auth_reg = document.getElementById("auth-register");
const auth_log = document.getElementById("auth-login");
const sender = document.querySelector("sender");
const sitio = window.location.origin;

const register = (usuario,email,password)=>{
    return fetch ('api/registro', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            usuario: usuario,
            email: email,
            password: password
        }),
        credentials: 'include'
    })
    .then(res => res.text())
    .then(data => console.log(data))
}


const login = (email,password)=>{
    return fetch ('api/login', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        }),
        credentials: 'include'
    })
    .then(res => res.text())
    .then(data => {console.log(data); window.location.href = "/" })
}
if (auth_reg) {
    auth_reg.addEventListener("submit",(e)=>{
    e.preventDefault();
    const formData = new FormData(e.target);
    const usuario = formData.get("usuario");
    const email = formData.get("email");
    const password = formData.get("password");
    if (!usuario || !email || !password) {
        console.log("No hay datos.")
    } else {
        register(usuario,email,password);
    }
});
}
if (auth_log) {
    auth_log.addEventListener("submit",(e)=>{
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    if (!email || !password) {
        console.log("No hay datos.")
    } else {
        login(email,password);
    }
});
}
