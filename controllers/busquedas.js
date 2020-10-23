const { response } = require('express');

const Usuario = require('../models/usuario');
const Paciente = require('../models/paciente');
const ObraSocial = require('../models/obra-social');


const getTodo = async(req, res = response ) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i' );

    const [ usuarios, pacientes, obrasSociales ] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Paciente.find({ nombre: regex }),
        ObraSocial.find({ nombre: regex }),
    ]);

    res.json({
        ok: true,
        usuarios,
        pacientes,
        obrasSociales
    })

}

const getDocumentosColeccion = async(req, res = response ) => {

    const tabla    = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex    = new RegExp( busqueda, 'i' );

    let data = [];

    switch ( tabla ) {
        case 'pacientes':
            data = await Paciente.find({ nombre: regex })
                                .populate('usuario', 'nombre img')
                                .populate('obraSocial', 'nombre img');
        break;

        case 'obrasSociales':
            data = await ObraSocial.find({ nombre: regex })
                                    .populate('usuario', 'nombre img');
        break;

        case 'usuarios':
            data = await Usuario.find({ nombre: regex });
            
        break;
    
        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios/pacientes/obras sociales'
            });
    }
    
    res.json({
        ok: true,
        resultados: data
    })

}

module.exports = {
    getTodo,
    getDocumentosColeccion
}