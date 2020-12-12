/* Rutas de pacientes:
    /api/turnos
*/
const { Router} = require('express');
const { check } = require('express-validator');
const { crearTurno, getTurnos, eliminarTurno, actualizarTurno } = require('../controllers/turnos');
const { validarCampos } = require ('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { isDate } = require('../helpers/isDate');

const router = Router();

router.get('/',
        [
            validarJWT
        ], 
        getTurnos)

router.post('/',
    [
        validarJWT,
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha y hora de inicio del turno es obligatoria').custom( isDate),
        check('end', 'La fecha y hora de finalización del turno es obligatoria').custom( isDate ),
        check('paciente','El paciente debe de ser válido').isMongoId(),
        validarCampos
        
    ],
    crearTurno
)

router.put('/:id', 
    [   
        validarJWT,
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha y hora de inicio del turno es obligatoria').custom( isDate),
        check('end', 'La fecha y hora de finalización del turno es obligatoria').custom( isDate ),
        validarCampos
    ],
    actualizarTurno 
);

router.delete('/:id', validarJWT , eliminarTurno )

module.exports = router;