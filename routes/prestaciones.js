/* Rutas de prestaciones:
    /api/prestaciones
*/

const { Router} = require('express');
const { check } = require('express-validator');
const { getPrestaciones, crearPrestacion, actualizarPrestacion, activarInactivarPrestacion } = require('../controllers/prestaciones');
const { validarCampos } = require ('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/',
        [
            validarJWT
        ], 
        getPrestaciones)

router.post('/',
        [
            validarJWT,
            check('nombre','El nombre de la Prestación es necesario').not().isEmpty(),
            validarCampos
            
        ],
        crearPrestacion)

router.put('/:id',
        [
            validarJWT,
            check('nombre', 'El nombre es obligatorio').not().isEmpty(),
            validarCampos
        ], 
        actualizarPrestacion);

router.put('/inac/:id',
        [
            validarJWT
        ], 
        activarInactivarPrestacion)

module.exports = router;