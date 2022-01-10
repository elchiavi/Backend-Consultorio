/* Rutas de pacientes:
    /api/pacientes
*/

const { Router} = require('express');
const { check } = require('express-validator');
const { crearPaciente, getPacientes, actualizarPaciente, activarInactivarPaciente, getPacientePorId } = require('../controllers/pacientes');
const {validarCampos} = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/',
        [
            validarJWT
        ], 
        getPacientes)

router.post('/',
        [   
            validarJWT,
            check('nombre', 'El nombre es obligatorio').not().isEmpty(),
            check('apellido', 'El apellido es obligatorio').not().isEmpty(),
            check('dni', 'El DNI es obligatorio').not().isEmpty(),
            check('fechaNac', 'La fecha de nacimiento es necesaria').not().isEmpty(),
            check('sexo', 'El sexo es obligatorio').not().isEmpty(),
            check('email', 'El E-mail es oglitagorio').isEmail(),
            check('direccion', 'La dirección es necesaria').not().isEmpty(),
            check('telefono', 'El teléfono es obligatorio').not().isEmpty(),
            check('ciudad', 'La ciudad es necesaria').not().isEmpty(),
            check('obraSocial','El id de la obra social debe de ser válido').isMongoId(),
            check('numeroAfiliado', 'El número de afiliado es necesario').not().isEmpty(),
            validarCampos
        ], 
        crearPaciente);

router.put('/:id',
        [
            validarJWT,
            check('dni', 'El DNI es obligatorio').not().isEmpty(),
            validarCampos
        ], 
        actualizarPaciente);

router.put('/inac/:id',
        [
            validarJWT
        ], 
        activarInactivarPaciente);

router.get('/:id',
        [
            validarJWT,
        ],
        getPacientePorId
)

module.exports = router;