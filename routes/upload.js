const express    = require('express');
const app        = express();
const fileUpload = require('express-fileupload');
const fs         = require('fs');

//Importar Modelos
const Usuario  = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico   = require('../models/medico');

app.use(fileUpload());


app.put('/:tipo/:id',async(req,res) => {
    try {
        
        let tipo = req.params.tipo;
        let _id = req.params.id;

        //Tipos de colleccion
        var tiposValidos = ['usuarios','hospitales','medicos'];
        if(tiposValidos.indexOf(tipo)< 0){
            return res.status(400).json({
                ok:false,
                message:'No se encuentra ningun archivo',
            });
        }

        if(!req.files){
            return res.status(400).json({
                ok:false,
                message:'No se encuentra ningun archivo',
            });
        }
        
        //Obtener nombre del archivo
        let archivo = req.files.img;
        let nombreCortado = archivo.name.split('.');
        let extension = nombreCortado[nombreCortado.length - 1];

        //Solo estas extensiones aceptamos
        var extensionesValidas = ['png','jpg','gif','jpeg'];
        if(extensionesValidas.indexOf(extension) < 0){
            return res.status(400).json({
                ok:false,
                message:'Extension no valida',
            });
        }

        //Crear nombre de archivo personalizado
        var nombreArchivo = `${_id}-${new Date().getMilliseconds()}.${extension}`;

        //Mover el archivo del temporal a un Path
        var path = `./uploads/${tipo}/${nombreArchivo}`;

        await archivo.mv(path);

        await subirPorTipo(tipo, _id, nombreArchivo, res)

    } catch (error) {
        res.status(400).json({
            ok:true,
            message:'Error al subir el archivo'
        });   
    }
});

async function subirPorTipo(tipo, _id, nombreArchivo, res){
    if(tipo === 'usuarios'){
        let usuario = await Usuario.findById(_id);
        var pathViejo = './uploads/usuarios/' + usuario.img;

        if(fs.existsSync(pathViejo)){
            fs.unlinkSync(pathViejo);
        }

        usuario.img = nombreArchivo;
        let usuarioActualizado = await usuario.save();

        return res.status(200).json({
            ok:true,
            message:'Usuario Actualizado',
            usuario:usuarioActualizado,
        });
    }

    if(tipo === 'medicos'){
        let medico = Medico.findById(_id);
        var pathViejo = './uploads/medicos/' + medico.img;

        if(fs.existsSync(pathViejo)){
            fs.unlinkSync(pathViejo);
        }

        medico.img = nombreArchivo;
        let medicoActualizado = await medico.save();

        return res.status(200).json({
            ok:true,
            message:'Medico Actualizado',
            usuario:usuarioActualizado,
        });
    }

    if(tipo === 'hospitales'){
        let hospital = Hospital.findById(_id);
        let pathViejo = './uploads/hospitales/' + hospital.img

        if(fs.existsSync(pathViejo)){
            fs.unlinkSync(pathViejo);
        }

        return res.status(200).json({
            ok:true,
            message:'Hospital Actualizado',
            usuario:usuarioActualizado,
        });
    }
}

module.exports = app;
