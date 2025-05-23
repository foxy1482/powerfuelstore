const express = require('express');
const app = express();
const port = 80;
const dotenv = require('dotenv');
const db = require('./db.js');
const {hash, compare} = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
dotenv.config();

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/registro',(req,res) => {
    res.sendFile(__dirname + '/public/register.html');
})
app.get('/login',(req,res) => {
    res.sendFile(__dirname + '/public/login.html');
})
app.get('/perfil',(req,res)=>{
    res.sendFile(__dirname + '/public/perfil.html')
})

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

app.get('/api/productos', (req,res) => {
    db.query(`
        SELECT p.id, p.nombre, p.precio, p.precioIndex, p.peso, p.marca, p.porcion, p.sabor, p.envase, p.suplemento, p.tipo, i.imagen, m.contenido
        FROM productos p
        JOIN imagenes i ON p.imagen = i.id
        JOIN informacion m ON p.info = m.id;
        `,(err,resultado)=>{
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).send('Error en servidor');
            return;
        }
        res.json(resultado);
    })
})

app.get(`/productos/:id`, (req,res)=> {
    res.sendFile(__dirname + '/public/Productos/Id/producto.html');
})

/* SISTEMA DE LOGIN */
app.use(express.json());
app.post('/api/registro', async (req,res)=>{
    const {usuario,email,password} = req.body;
    const hashedPassword = await hash(password, 12);
    const query = `INSERT INTO usuarios (nombre, email, password) VALUES (?,?,?)`;
    db.query(query, [usuario,email,hashedPassword], (err,resultado)=>{
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).send('Error en servidor');
            return;
        }
        res.status(201).send("Usuario registrado correctamente. Debes iniciar sesión.");
    })
})

app.post('/api/login', async (req,res)=>{
    const {email,password} = req.body;
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results)=>{
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(401).send('Email no encontrado');

        const usuario = results[0];
        const coincidePassword = await compare(password, usuario.password);
        if (coincidePassword) {
            const token = jwt.sign({ id: usuario.id, usuario: usuario.nombre, email: usuario.email }, SECRET, { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                maxAge: 1000 * 60 * 60 * 24 
            })
            res.cookie('usuario', usuario.nombre, {
                httpOnly: false,
                maxAge: 1000 * 60 * 60 * 24
            })
            res.cookie('email', usuario.email, {
                httpOnly: false,
                maxAge: 1000 * 60 * 60 * 24
            })
            res.send('Logueado')
        } else {
            res.status(401).send(`Contraseña incorrecta.`)
        }
    })
})
