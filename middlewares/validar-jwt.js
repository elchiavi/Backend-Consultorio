const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {


    // leer el token, viene en req.header

    const token = req.header('x-token');
    //console.log(token);


    //validaciones

    if (! token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        //console.log(uid);
        req.uid = uid; // agrego uid en la request para poder disponerla fuera del middleware

    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'El token no es valido'
        });
        
    }

    next();

}

module.exports = {
    validarJWT
}