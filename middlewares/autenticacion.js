const jwt = require('jsonwebtoken');
const config = require('../config/config');

// ====================================================
// Verificar Token
// ====================================================
exports.verficaToken = function (req, res, next){
    var token = req.get('token');
    //var token = req.query.token;

    jwt.verify(token,config.SEED,(err,decoded) => {
        if(err){
            return res.status(400).json({
                mensaje:'Usuario no valido',
                err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
}

exports.verificaAdmin = function(req,res,next){
    let USER_ROLE = req.usuario.role;
    let id = req.params.id;

    if(USER_ROLE === 'ADMIN_ROLE' || usuario._id === id){
        next();
        return;
    }

    res.status(400).json({
        mensaje:'Es necesario un usuario administrador, ni es el mismo usuario',
        err
    });
}

exports.verificamMismoUsuario = function(req,res,next){

}
