const { response } = require('express');

const Usuario = require('../models/usuario');
const Paciente = require('../models/paciente');
const ObraSocial = require('../models/obra-social');
const Prestacion = require('../models/prestacion')


const getTodo = async(req, res = response ) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i' );
    const uid = req.uid;

    const [ pacientes, obrasSociales, prestaciones ] = await Promise.all([
        Paciente.find({ apellido: regex })
                .find({'usuario': uid}),
        ObraSocial.find({ nombre: regex })
                  .find({'usuario': uid}),
        Prestacion.find({ nombre: regex })
                  .find({'usuario': uid})
        
    ]);

    res.json({
        ok: true,
        pacientes,
        obrasSociales,
        prestaciones
    })

}

const getDocumentosColeccion = async(req, res = response ) => {

    const tabla    = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex    = new RegExp( busqueda, 'i' );
    const uid = req.uid;

    let data = [];

    switch ( tabla ) {
        case 'pacientes':
            data = await Paciente.find({ apellido: regex })
                                 .find({'usuario': uid})
                                 //.find({'activo': true})
                                 .populate('usuario', 'nombre img')
                                 .populate('obraSocial', 'nombre img');
        break;

        case 'obrasSociales':
            data = await ObraSocial.find({ nombre: regex })
                                   .find({'usuario': uid})
                                   //.find({'activo': true})
                                   .populate('usuario', 'nombre img');
        break;

        case 'prestaciones':
            data = await Prestacion.find({ nombre: regex })
                                   .find({'usuario': uid})
                                   //.find({'activo': true})
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

const getPrestacionesActivas = async  (req, res = response) => {

    const uid = req.uid;
    
    const [prestaciones, total] = await Promise.all([
        Prestacion
            .find({'usuario': uid})
            .find({'activo': true})
            .sort({nombre: 1})
            .populate('usuario', 'nombre'),

            Prestacion.countDocuments()
    ]);
    
    res.json({
        Ok: true,
        prestaciones,
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
    getPacientesActivos,
    getPrestacionesActivas
}