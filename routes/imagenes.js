const express = require('express');
const app     = express();
const path    = require('path');
const fs      = require('fs');

app.get('/:tipo/:img',async(req,res) => {
    try {
        let tipo = req.params.tipo;
        let img = req.params.img;

        let pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

        if(fs.existsSync(pathImagen)){
            res.sendFile(pathImagen);
        }else{
            var pathNoImage = path.resolve(__dirname,'../assets/no-img.jpg')
            res.sendFile(pathImagen);
        }
   
    } catch (error) {
        res.status(500).json({
            ok:false,
            error,
        }); 
    }
});

module.exports = app;
