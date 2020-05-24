const express = require('express');
const app = express();

//Modelos
const Hospital = require('../models/hospital');
const Medico   = require('../models/medico');
const Usuario  = require('../models/usuario');

// ====================================================
// Busqueda General
// ====================================================
app.get('/todo/:busqueda',async(req,res) => {
    let busqueda = req.params.busqueda;
    let regex = new RegExp(busqueda,'i');

    let respuesta = await Promise.all([
        Hospital.find({nombre:regex}),
        Medico.find({nombre:regex}),
        Usuario.find({},'nombre email role img').or([{'nombre':regex},{'email':regex}])
    ]);

    res.status(200).json({
        ok:true,
        busqueda,
        hospitales: respuesta[0],
        medicos:respuesta[1],
        usuarios:respuesta[2],
    });
});

// ====================================================
// Busqueda por coleccion
// ====================================================
app.get('/coleccion/:tabla/:busqueda',async(req,res)=>{
    let TABLA = req.params.tabla;
    let busqueda = req.params.busqueda;
    let regex = new RegExp(busqueda,'i');

    var respuesta = [];
    switch (TABLA) {
        case "usuario":
            respuesta = await Usuario.find({},'nombre email role img').or([{'nombre':regex},{'email':regex}]);
            break;
        case "medico":
            respuesta = await Medico.find({nombre:regex});
            break;
        case "hospital":
            respuesta = await Hospital.find({nombre:regex});
            break;
        default:
            return res.status(400).json({
                ok:false,
                message: 'Los tipos de busqueda solo son: usaurio, medico, hospital',
                error:{message:'Tipo de tabla/collecion no valido'}
            })
    }

    res.status(200).json({
        ok:true,
        busqueda,
        respuesta,
    });
});

module.exports = app;
