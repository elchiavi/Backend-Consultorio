const { response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

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

const validarAdminRol = async (req, res, next) => {

    const uid = req.uid;

    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            })
        }
        
        if (usuarioDB.rol !== 'ADMIN_ROLE') {
            return res.status(403).json({
                ok: false,
                msg: 'Usuario no tiene permisos para realizar la acción'
            })
        }
        next();
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        }) 
    };

}

const validarAdminRol_o_MismoUsuario = async (req, res, next) => {

    const uid = req.uid;
    const idModif = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            })
        }
        
        if (usuarioDB.rol === 'ADMIN_ROLE' || uid === idModif) {
            next();

        } else {
            return res.status(403).json({
                ok: false,
                msg: 'Usuario no tiene permisos para realizar la acción'
            })          
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        }) 
    };

}

module.exports = {
    validarJWT,
    validarAdminRol,
    validarAdminRol_o_MismoUsuario
}