const { response } = require('express'); // importo ayudas para autocompletado

const ObraSocial = require('../models/obra-social');

const getObrasSociales = async  (req, res = response) => {

    const desde = Number(req.query.desde) || 0; // si no hay parametro, uso 0
    const uid = req.uid;

    const [obrasSociales, total] = await Promise.all([
        ObraSocial
            .find({'usuario': uid})
            .skip(desde)
            .limit(5)
            .sort({nombre: 1})
            .populate('usuario', 'nombre'),

        ObraSocial.find({'usuario': uid}).countDocuments()
    ]);
    
    res.json({
        Ok: true,
        obrasSociales,
        total
    })
}

const crearObraSocial = async (req, res = response) => {

    const uid = req.uid;
    const obraSocial = new ObraSocial({
        usuario: uid,
        activo: true,
        ...req.body
    });
    
    try {

        const obraSocialDB = await obraSocial.save();
        
        res.json({
            ok: true,
            ObraSocial: obraSocialDB
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })    
    }
}

const actualizarObraSocial = async (req, res = response) => {

    const id  = req.params.id;
    const uid = req.uid;

    try {
        const obraSocial = await ObraSocial.findById(id);

        if (!obraSocial){
            return res.status(404).json({
                ok: true,
                msg: 'Obra Social no encontrada',
            });
        }

        const cambiarObraSocial = {
            ...req.body,
            usuario: uid // actualizo el usuario
        }

        const obraSocialActualizada = await ObraSocial.findByIdAndUpdate(id, cambiarObraSocial, {new: true});

        res.json({
            ok: true,
            ObraSocial: obraSocialActualizada
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })        
    }

}

const activarInactivarObraSocial = async (req, res = response) => {

    const id = req.params.id;

    try {
        const obraSocial = await ObraSocial.findById(id);

        if (!obraSocial){
            return res.status(404).json({
                ok: true,
                msg: 'Obra Social no encontrada',
            });
        }

        const {activo, ...camposObraSocial} = req.body;
        if (obraSocial.activo) {
            camposObraSocial.activo = false;
        } else {
            camposObraSocial.activo = true;
        }

        const obraSocialActualizada = await ObraSocial.findByIdAndUpdate(id, camposObraSocial, {new: true});

        res.json({
            ok: true,
            ObraSocial: obraSocialActualizada
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
    getObrasSociales,
    crearObraSocial,
    actualizarObraSocial,
    activarInactivarObraSocial
}