const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');

//Importar Schema
const Usuario = require('../models/usuario');
//Importar Middlewares
const mdAutenticacion = require('../middlewares/autenticacion');

// ====================================================
// Obtener Todos los usuarios
// ====================================================
app.get('/', async (req,res) => {
    try {
        let desde = req.query.desde || 0;
        desde = Number(desde);

        let usuarios = await Usuario
            .find({},'nombre email img role google')
            .skip(desde)
            .limit(5);   
        
        let conteo = await Usuario.count();

        res.status(200).json({
            ok:true,
            total:conteo,
            usuarios,
        });
    } catch (error) {
        res.status(400).json({
            ok:false,
            message:'Error',
            error
        });
    }
});

// ====================================================
// Crear un nuevo usuario
// ====================================================
app.post('/', async (req,res) => {
    try {
        let body = req.body;

        let usuario = new Usuario({
            nombre:body.nombre,
            email:body.email,
            password:bcrypt.hashSync(body.password,10),
            img:body.img,
            role:body.role
        });

        let usuarioDB = await usuario.save();
        
        res.status(201).json({
            ok:true,
            usuario:usuarioDB,
            usuariotoken:req.usuario,
        });

    } catch (error) {
        res.status(400).json({
            ok:false,
            message:'Error al crear usuario',
            error
        });
    }
});

// ====================================================
// Actualizar usuario
// ====================================================
app.put('/:id',mdAutenticacion.verficaToken,async (req,res) => {
    try {
        let _id = req.params.id;
        let body = req.body;

        let usuario = await Usuario.findByIdAndUpdate(_id,body,{new:true});

        if(!usuario){
            return res.status(404).json({
                ok:false,
                message:'Usuario no encontrado',
            })
        }

        res.status(201).json({
            ok:true,
            usuario
        });

    } catch (error) {
        res.status(400).json({
            ok:false,
            message:'Error al editar usuario',
            error
        });
    }
});

// ====================================================
// Eliminar Usuario por ID
// ====================================================
app.delete('/:id',mdAutenticacion.verficaToken, async (req,res) => {
    try {
        
        let _id = req.params.id;
        
        let usuario = await Usuario.findByIdAndRemove(_id);

        if(!usuario){
            return res.status(404).json({
                ok:false,
                message:'Usuario no encontrado',
            })
        }

        res.status(200).json({
            ok:true,
            usuario
        });

    } catch (error) {
        res.status(400).json({
            ok:false,
            message:'Error al eliminar usuario',
            error
        });
    }
});

module.exports = app;
