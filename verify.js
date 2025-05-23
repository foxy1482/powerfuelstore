const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;


function verificarToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).send('Token requerido');

    jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Token inválido');
    req.usuario = decoded;
    next();
    });
}

app.get('/api/perfil', verificarToken, (req, res) => {
    res.send(`Hola ${req.usuario.usuario}`);
});

module.exports = verificarToken();