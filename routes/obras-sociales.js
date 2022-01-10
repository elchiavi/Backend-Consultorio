/* Rutas de obras sociales:
    /api/obrassociales
*/

const { Router} = require('express');
const { check } = require('express-validator');
const { getObrasSociales, crearObraSocial, actualizarObraSocial, activarInactivarObraSocial } = require('../controllers/obras-sociales');
const { validarCampos } = require ('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/',
        [
            validarJWT
        ], 
        getObrasSociales)

router.post('/',
        [
            validarJWT,
            check('nombre','El nombre de la Obra Social es necesario').not().isEmpty(),
            validarCampos
            
        ],
        crearObraSocial)

router.put('/:id',
        [
            validarJWT,
            check('nombre', 'El nombre es obligatorio').not().isEmpty(),
            validarCampos
        ], 
        actualizarObraSocial);

router.put('/inac/:id',
        [
            validarJWT
        ], 
        activarInactivarObraSocial)

module.exports = router;