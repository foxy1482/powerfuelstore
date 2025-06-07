const express = require('express');
const app = express();
const port = 4000;
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
    res.sendFile(__dirname + '/public/perfil.html');
})
app.get("/checkout",(req,res)=> {
    res.sendFile(__dirname + '/public/checkout.html');
})
app.get("/catalogo",(req,res)=> {
    res.sendFile(__dirname + '/public/catalogo.html');
})
app.get("/compraexitosa",(req,res)=>
{
    res.sendFile(__dirname + '/public/compra_exitosa.html');
})
app.get("/factura",(req,res)=>
{
    res.sendFile(__dirname + "/public/factura.html");
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

app.get("/api/mas-vendidos",(req,res)=>
{
    db.query(
        `
        SELECT p.id, p.nombre, p.precio, i.imagen, SUM(d.cantidad) AS total_vendidos FROM productos p JOIN imagenes i ON p.imagen = i.id JOIN detalle_pedidos d ON p.id = d.id_producto GROUP BY p.id, p.nombre, p.precio, i.imagen ORDER BY total_vendidos DESC;
        `,(err,resultado)=>
        {
            if (err) {
                console.error('Error en la consulta:', err);
                res.status(500).send('Error en servidor');
                return;
            }
            res.json(resultado);
        }
    )
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
        res.status(201).send("Usuario registrado correctamente.");
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
            res.cookie('userId', usuario.id, { httpOnly: false, maxAge: 1000 * 60*60*24 })
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

app.delete("/api/eliminarCuenta/:id",(req,res)=>{
    const id = req.params.id;
    db.query(`
        DELETE FROM usuarios WHERE id = ?;
        `,[id],(err,resultado)=>{
            if (err) return res.status(500).send(err);
            if (resultado.affectedRows === 0) {
                return res.status(404).send("No se encontró la cuenta a eliminar.");
            }
            res.status(200).send("Cuenta eliminada correctamente")
        })
})

/* COMPRAS Y CARRITO */

app.get("/api/obtenerUsuario/:user/:email",(req,res)=>{
    const user = req.params.user;
    const email = req.params.email
    db.query(
        ` SELECT id FROM usuarios WHERE nombre = ? and email = ?;`, [user,email], (err,resultado)=>
        {
            if (err) {
                console.error('Error en la consulta:', err);
                res.status(500).send('Error en servidor');
                return;
            }
            res.json(resultado);
        }
    )
})

app.post("/api/nuevoPedido",(req,res)=>
{
    const {id_usuario, direccion, altura, piso, depto, cp, barrio, ciudad, carrito} = req.body;
    let total = 5;
    for (let i = 0; i < carrito.length; i++)
        {
            total += parseInt(carrito[i].precio.replace(/[$]/g,"")) * carrito[i].cantidad;
        }

    db.query(`
        INSERT INTO facturacion (id_usuario, direccion, altura, piso, depto, cp, barrio, ciudad) VALUES (?,?,?,?,?,?,?,?)
        `,[id_usuario, direccion, altura, piso, depto, cp, barrio, ciudad],(err,resultado)=>
        {
            if (err) {
                console.error('Error en la consulta:', err);
                res.status(500).send('Error en servidor');
            }
            const id_facturacion = resultado.insertId;

            /* MODIFICACION PEDIDOS */
            db.query(
                `INSERT INTO pedidos (id_usuario, id_facturacion, total, estado) VALUES (?,?,?,?)`
                ,[id_usuario,id_facturacion,total,"Pendiente de Pago"], (err2,resultado2)=>{
                    if (err2) {
                        console.error('Error en la consulta:', err2);
                        res.status(500).send('Error en servidor');
                    }
                    const id_pedido = resultado2.insertId;

                    /* MODIFICACION DETALLE_PEDIDOS */

                    let errores = 0;
                    let completados = 0;

                    for (let i = 0; i < carrito.length; i++)
                    {
                        const prod = carrito[i];
                        const precioNum = parseInt(prod.precio.replace(/[$]/g,""))
                        const totalItem = precioNum * prod.cantidad;

                        db.query(
                            `INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad, total) VALUES (?,?,?,?);`,
                            [id_pedido,prod.id, prod.cantidad, totalItem],(err3,resultado3)=>
                            {
                                if (err3) {
                                    console.error(`Error en producto ${prod.id}:`, err3);
                                    errores++;
                                }
                                completados++;

                                if (completados === carrito.length) {
                                    if (errores > 0) {
                                        return res.status(500).send('Error al registrar algunos productos');
                                    } else {
                                        // Guardar los datos de facturacion
                                        res.cookie("facturacion", JSON.stringify({
                                            direccion,
                                            altura,
                                            piso,
                                            depto,
                                            cp,
                                            barrio,
                                            ciudad,
                                            total
                                        }), {
                                            httpOnly: false,  
                                            secure: false,     
                                            maxAge: 1000 * 60 * 60
                                        });
                                        return res.status(201).send(`Pedido creado correctamente con ID: ${id_pedido}`);
                                    }
                                }
                            }
                        )
                    }
                }
            )
        })
    
})

app.get("/api/buscarIdPedido/:id_usuario/:total",(req,res)=>
{
    const user = req.params.id_usuario;
    const totalCompra = req.params.total;
    db.query(
        `SELECT id FROM pedidos WHERE id_usuario = ? AND total = ?`,[user,totalCompra], (err,resultado)=>
        {
            if (err) {
                console.error('Error en la consulta:', err);
                res.status(500).send('Error en servidor');
                return;
            }
            res.json(resultado);
        }
    )
})

