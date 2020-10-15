const { response } = require('express');
const {validationResult} = require('express-validator');

const validarCampos = (req, res = response, next) => {

    const errores = validationResult(req); // genera un arreglo de errores que se generaron con los check.
    
    if ( !errores.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }

    next();

}

module.exports = {
    validarCampos
}