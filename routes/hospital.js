const express = require('express');
const app = express();

//Importar Modulos
const Hospital = require('../models/hospital');
//Importar Middlewares
const mdAutenticacion = require('../middlewares/autenticacion');

// ====================================================
// Obtener todos los hospitales
// ====================================================
app.get('/',async (req,res) => {
    try {
        let desde = req.query.desde || 0;
        desde = Number(desde);

        let hospitales = await Hospital
            .find({})
            .skip(desde)
            .limit(5)
            .populate('usuario','nombre img email google');

        res.status(200).json({
            ok:true,
            hospitales
        });

    } catch (error) {
        res.status(500).json({
            ok:false,
            error,
        });        
    }
});

// ====================================================
// Obtener un hospital
// ====================================================
app.get('/:id',async(req,res)=>{
    try {
        
        let _id = req.params.id;
        let hospital = await Hospital
            .findById(_id)
            .populate('usuario','nombre img email google');

        if(!hospital){
            return res.status(404).json({
                ok:false,
                message:'Hospital no encontrado',
            });
        }

        res.status(200).json({
            ok:true,
            hospital
        });

    } catch (error) {
        res.status(500).json({
            ok:false,
            error,
        });        
    }
});


// ====================================================
// Crear nuevo hospital
// ====================================================
app.post('/',mdAutenticacion.verficaToken,async(req,res) => {
    try {
        let body = req.body;
        
        let hospital = new Hospital({
            nombre:body.nombre,
            img:body.img,
            usuario:req.usuario._id,
        });

        let hospitalDB = await hospital.save();
        
        res.status(200).json({
            ok:true,
            hospital:hospitalDB,
        }); 

    } catch (error) {
        res.status(500).json({
            ok:false,
            error,
        });        
    }
});

// ====================================================
// Actualzizar hospital
// ====================================================
app.put('/:id',mdAutenticacion.verficaToken,async(req,res) => {
    try {
        let _id = req.params.id;
        let body = req.body;

        let hospitalDB = await Hospital.findByIdAndUpdate(_id, body, {new:true});
        
        if(!hospitalDB){
            return res.status(404).json({
                ok:false,
                message:'Hospital no encontrado',
            });
        }

        res.status(200).json({
            ok:true,
            hospital:hospitalDB
        });
        
    } catch (error) {
        res.status(500).json({
            ok:false,
            message:'Error al actualizar el usuario',
            error,
        });        
    }
});

// ====================================================
// Eliminar hospital
// ====================================================
app.delete('/:id', mdAutenticacion.verficaToken, async(req,res) => {
    try {
        let _id = req.params.id;

        let hospital = await Hospital.findByIdAndRemove(_id);

        if(!hospital){
            return res.status(404).json({
                ok:false,
                message:'Hospital no encontrado',
            });
        }

        res.status(200).json({
            ok:true,
            hospital
        });

    } catch (error) {
        res.status(500).json({
            ok:false,
            error,
        });  
    }
});

module.exports = app;