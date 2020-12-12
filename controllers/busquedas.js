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
            data = await Paciente.find({ apellido: regex })
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

const getObrasSocialesActivas = async  (req, res = response) => {

    const uid = req.uid;
    
    const [obrasSociales, total] = await Promise.all([
        ObraSocial
            .find({'usuario': uid})
            .find({'activo': true})
            .sort({nombre: 1})
            .populate('usuario', 'nombre'),

            ObraSocial.countDocuments()
    ]);
    
    res.json({
        Ok: true,
        obrasSociales,
        total
    })
}

const getPacientesActivos = async(req, res = response) => {

    const desde = Number(req.query.desde) || 0;
    const uid = req.uid;

    const [pacientes, total] = await Promise.all([
        Paciente
            .find({'usuario': uid})
            .find({'activo': true})
            .sort({apellido: 1})
            .populate('obraSocial', 'nombre'),
            
        Paciente.countDocuments()
    ])

    res.json({
        Ok: true,
        pacientes,
        total,
    })
}

module.exports = {
    getTodo,
    getDocumentosColeccion,
    getObrasSocialesActivas,
    getPacientesActivos
}