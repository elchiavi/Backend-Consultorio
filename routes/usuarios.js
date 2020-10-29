/* Rutas de usuarios:
    /api/usuarios
*/

const { Router} = require('express');
const { getUsuarios, crearUsuario, actualizarUsuario, inactivarActivarUsuario } = require('../controllers/usuarios')
const {check} = require('express-validator')
const { validarCampos } = require ('../middlewares/validar-campos');
const { validarJWT, validarAdminRol, validarAdminRol_o_MismoUsuario } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/',
        [
            validarJWT
        ], 
        getUsuarios);

router.post('/',
        [   
            check('nombre', 'El nombre es obligatorio').not().isEmpty(),
            check('password', 'La contraseña es obligatoria').not().isEmpty(),
            check('email', 'El E-mail es oglitagorio').isEmail(),
            validarCampos // siempre ejecutar los middlewares despues de los checks.
        ], 
        crearUsuario);

router.put('/:id',
        [
            validarJWT,
            validarAdminRol_o_MismoUsuario,
            check('nombre', 'El nombre es obligatorio').not().isEmpty(),
            check('email', 'El E-mail es oglitagorio').isEmail(),
            //check('rol', 'El rol es obligatorio').not().isEmpty(),
            validarCampos
        ], 
        actualizarUsuario);

router.put('/inac/:id',
        [
            validarJWT,
            validarAdminRol
        ], 
        inactivarActivarUsuario)

module.exports = router;