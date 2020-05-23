const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const Usuario = require('../models/usuario');

// ====================================================
// Login del Usuario
// ====================================================
app.post('/',async(req,res) => {
    try {
        body = req.body;
        
        let usuarioDB = await Usuario.findOne({email:body.email});

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                message:'Credenciales incorrectas',
            });
        }

        if(!bcrypt.compareSync(body.password,usuarioDB.password)){
            return res.status(404).json({
                ok:false,
                message:'Credenciales incorrectas - password',
            });
        }

        //Crear un Token
        //PARAMETROS
        //1.- La data 2.-CLAVE 3.-TIEMPO DE EXPIRACION
        usuarioDB.password = ':)';
        const token = jwt.sign({usuario:usuarioDB},config.SEED,{expiresIn:14400});

        res.status(200).json({
            ok:true,
            usuarioDB,
            token
         });   
    } catch (error) {
        res.status(200).json({
            ok:false,
            error
         });
    }
});

module.exports = app;
