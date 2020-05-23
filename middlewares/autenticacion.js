const jwt = require('jsonwebtoken');
const config = require('../config/config');

// ====================================================
// Verificar Token
// ====================================================
exports.verficaToken = function (req, res, next){
    var token = req.get('token');

    jwt.verify(token,config.SEED,(err,decoded) => {
        if(err){
            return res.status(400).json({
                mensaje:'Usuario no valido',
                err
            });
        }

        req.usuario = decoded;
        next();
    });
}
