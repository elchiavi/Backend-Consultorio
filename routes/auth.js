/* Rutas de login:
    /api/login
*/

const { Router} = require('express');
const { login, googleSignIn, renewToken } = require('../controllers/auth');
const { check } = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/',
        [
            check('email', 'El E-mail es oglitagorio').isEmail(),
            check('password', 'La contraseña es obligatoria').not().isEmpty(),
            validarCampos
        ],
        login);

router.post('/google',
        [
            check('token', 'La token de Google es obligatorio').not().isEmpty(),
            validarCampos
        ],
        googleSignIn);

router.get('/renew',
        [
            validarJWT
        ],
        renewToken);

module.exports = router;