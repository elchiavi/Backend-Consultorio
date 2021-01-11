const { response } = require('express'); // importo ayudas para autocompletado

const Prestacion = require('../models/prestacion');

const getPrestaciones = async  (req, res = response) => {

    const desde = Number(req.query.desde) || 0; // si no hay parametro, uso 0
    const uid = req.uid;

    const [prestaciones, total] = await Promise.all([
        Prestacion
            .find({'usuario': uid})
            .skip(desde)
            .limit(5)
            .sort({nombre: 1})
            .populate('usuario', 'nombre'),

        Prestacion.find({'usuario': uid}).countDocuments()
    ]);
    
    res.json({
        Ok: true,
        prestaciones,
        total
    })
}

const crearPrestacion = async (req, res = response) => {

    const uid = req.uid;
    const prestacion = new Prestacion({
        usuario: uid,
        activo: true,
        ...req.body
    });
    
    try {

        const prestacionDB = await prestacion.save();
        
        res.json({
            ok: true,
            Prestacion: prestacionDB
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })    
    }
}

const actualizarPrestacion = async (req, res = response) => {

    const id  = req.params.id;
    const uid = req.uid;

    try {
        const prestacion = await Prestacion.findById(id);

        if (!prestacion){
            return res.status(404).json({
                ok: true,
                msg: 'Prestación no encontrada',
            });
        }

        const cambiarPrestacion = {
            ...req.body,
            usuario: uid // actualizo el usuario
        }

        const prestacionActualizada = await Prestacion.findByIdAndUpdate(id, cambiarPrestacion, {new: true});

        res.json({
            ok: true,
            ObraSocial: prestacionActualizada
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })        
    }

}

const activarInactivarPrestacion = async (req, res = response) => {

    const id = req.params.id;

    try {
        const prestacion = await Prestacion.findById(id);

        if (!prestacion){
            return res.status(404).json({
                ok: true,
                msg: 'Prestación no encontrada',
            });
        }

        const {activo, ...camposPrestacion} = req.body;
        if (prestacion.activo) {
            camposPrestacion.activo = false;
        } else {
            camposPrestacion.activo = true;
        }

        const prestacionlActualizada = await Prestacion.findByIdAndUpdate(id, camposPrestacion, {new: true});

        res.json({
            ok: true,
            ObraSocial: prestacionlActualizada
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        }) 
        
    }
}

module.exports = {
    getPrestaciones,
    crearPrestacion,
    actualizarPrestacion,
    activarInactivarPrestacion
}