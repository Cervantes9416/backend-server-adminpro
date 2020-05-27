const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

var rolesValidos = {
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un rol permitido'
}

//Objeto de JS
const UsuarioSchema = new Schema({
    nombre:{type:String,required:[true,'El nombre es necesario']},
    email:{type:String, unique:true, required:[true,'El correo es necesario']},
    password:{type:String, required:[true,'La contraseña es necesaria']},
    img:{type:String, required:false},
    role:{type:String,required:true, default:'USER_ROLE', enum:rolesValidos},
    google:{type:Boolean,default:false}
});

UsuarioSchema.plugin(uniqueValidator, { message:'{PATH} debe de ser unico PLUSPLUS' });

module.exports = mongoose.model('Usuario',UsuarioSchema);