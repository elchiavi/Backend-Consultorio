/*
  ruta: api/busquedas/
*/
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt')

const { getTodo, getDocumentosColeccion, getObrasSocialesActivas, getPacientesActivos, getPrestacionesActivas } = require('../controllers/busquedas');


const router = Router();


router.get('/:busqueda', validarJWT , getTodo );

router.get('/obrasSociales/activas', validarJWT , getObrasSocialesActivas );

router.get('/prestaciones/activas', validarJWT , getPrestacionesActivas );

router.get('/pacientes/activos', validarJWT , getPacientesActivos );

router.get('/coleccion/:tabla/:busqueda', validarJWT , getDocumentosColeccion );

module.exports = router;