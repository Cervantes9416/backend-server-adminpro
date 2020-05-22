//Los required
const express = require('express');

//Inicializar variables
const app = express();


//Rutas
app.get('/',(req,res) => {
    res.status(200).json({
        ok:true,
        message:'Hola Mundo'
    });
})

//Escuchar peticiones
app.listen(3200,()=>{
  console.log('Iniciando sevidor en el puerto 3200');  
});