//IMPORTS
const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');

//Inicializar variables
const app = express();

//Body Parser
app.use(bodyParser.urlencoded({extend:false}));
app.use(bodyParser.json());

//Importar Rutas
var appRoutes      = require('./routes/app');
var usuariosRoutes = require('./routes/usuario');
var loginRoutes    = require('./routes/login');

//Conectar a moongose
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',{useNewUrlParser:true},(err,res)=>{
  console.log('Conectado a a la BD');
});

//Rutas
app.use('/usuario',usuariosRoutes);
app.use('/login',loginRoutes);
app.use('/',appRoutes);

//Escuchar peticiones
app.listen(3200,()=>{
  console.log('Iniciando sevidor en el puerto 3200');  
});