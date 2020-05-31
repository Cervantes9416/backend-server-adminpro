const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const Usuario = require('../models/usuario');

//Importar google Authentication
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(config.CLIENT_ID);


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

// ====================================================
// Authenticacion Google
// ==================================================== 
app.post('/google', async (req, res) => {
    try {
        let token = req.body.token;
        var googleUser = await verify(token);

        let usuarioDB = await Usuario.findOne({email:googleUser.email});

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    message: 'Debe de usar su authenticacion normal'
                })
            } else {
                const newtoken = jwt.sign({ usuario: usuarioDB }, config.SEED, { expiresIn: 14400 });

                res.status(200).json({
                    ok: true,
                    usuarioDB,
                    token:newtoken
                });
            }
        }

        //El usuario no existe hay que crearlo
        let usuario = new Usuario({
            nombre:googleUser.nombre,
            email:googleUser.email,
            img:googleUser.img,
            password:':)',
            google:true,
        });

        let newUser = await usuario.save();

        res.status(200).json({
            ok: true,
            usuarioDB:newUser,
        });   
    } catch (error) {
        res.status(500).json({
            ok: false,
            error,
            message:'Error intentar logear con Google'
        });
    }
});

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: config.CLIENT_ID
    });
    const payload = ticket.getPayload();
    
    return {
        nombre:payload.name,
        email:payload.email,
        img:payload.picture,
        google:true,
    }
  }


module.exports = app;
