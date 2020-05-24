const express = require('express');
const app = express();

//Importar Modelos
const Medico = require('../models/medico');

//Importar Middlewares
const mdAutenticacion = require('../middlewares/autenticacion');

// ====================================================
// Obtener Todos los medicos
// ====================================================
app.get('/',async(req,res)=>{
    try {

        let desde = req.query.desde || 0;
        desde = Number(desde);
        
        let medicos = await Medico
            .find({})
            .skip(desde)
            .limit(5)
            .populate('usuario','nombre email')
            .populate('hospital','nombre')
        
        let conteo = await Medico.count();

        res.status(200).json({
            ok:true,
            total:conteo,
            medicos
        })

    } catch (error) {
        res.status(500).json({
            ok:false,
            error:{
                message:'Error al obtener los Medicos'
            }
        });
    }
});

// ====================================================
// Crear nuevo medico
// ====================================================
app.post('/',mdAutenticacion.verficaToken, async(req,res)=>{
    try {
        
        let body = req.body;

        let medico = new Medico({
            nombre: body.nombre,
            img: body.img,
            usuario: req.usuario._id,
            hospital: body.hospital
        });

        let medicoDB = await medico.save();

        res.status(200).json({
            ok:true,
            medico:medicoDB,
        });

    } catch (error) {
        res.status(500).json({
            ok:false,
            error:{
                message:'Error al obtener los Medicos'
            }
        });
    }
});

// ====================================================
// Actualizar medico
// ====================================================
app.put('/:id',mdAutenticacion.verficaToken, async(req,res)=> {
    try {
        let _id  = req.params.id;
        let body = req.body;

        let medico = await Medico.findByIdAndUpdate(_id,body,{new:true});

        if(!medico){
            return res.status(200).json({
                ok:false,
                message:'No se encontro el usuario'
            });
        }

        res.status(200).json({
            ok:true,
            medico
        });

    } catch (error) {
        res.status(500).json({
            ok:false,
            error:{
                message:'Error al obtener los Medicos'
            }
        });
    }
});

// ====================================================
// Eliminar medico
// ====================================================
app.delete('/:id',mdAutenticacion.verficaToken,async(req,res)=>{
    try {
        let _id = req.params.id;

        let medico = await Medico.findByIdAndRemove(_id);

        if(!medico){
            return res.status(200).json({
                ok:false,
                message:'No se encontro el usuario'
            });
        }

        res.status(200).json({
            ok:true,
            medico
        });

    } catch (error) {
        res.status(500).json({
            ok:false,
            error:{
                message:'Error al obtener los Medicos'
            }
        });
    }
});


module.exports = app;