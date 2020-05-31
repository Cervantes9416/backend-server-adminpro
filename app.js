//IMPORTS
const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

//Inicializar variables
const app = express();

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Habilitar CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
  res.header("Access-Control-Allow-Methods","POST, GET, PUT, DELETE, OPTIONS");
  next();
});

//Importar Rutas
var appRoutes        = require('./routes/app');
var usuariosRoutes   = require('./routes/usuario');
var loginRoutes      = require('./routes/login');
var hospitalesRoutes = require('./routes/hospital');
var medicoRoutes     = require('./routes/medico');
var busquedaRoutes   = require('./routes/busqueda');
var uploadRoutes     = require('./routes/upload');
var imagenesRoutes   = require('./routes/imagenes');

//Conectar a moongose
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true },(err,res)=>{
  console.log('Conectado a a la BD');
});

//Server index config
// const serverIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads',serverIndex(__dirname + '/uploads'));

//Rutas
app.use('/usuario',usuariosRoutes);
app.use('/login',loginRoutes);
app.use('/hospital', hospitalesRoutes);
app.use('/medico',medicoRoutes);
app.use('/busqueda',busquedaRoutes);
app.use('/upload',uploadRoutes);
app.use('/img',imagenesRoutes);
app.use('/',appRoutes);

//Escuchar peticiones
app.listen(3200,()=>{
  console.log('Iniciando sevidor en el puerto 3200');  
});