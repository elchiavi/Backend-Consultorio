const { response } = require('express'); // importo ayudas para autocompletado
const { generarJWT } = require('../helpers/jwt');
const Paciente  = require('../models/paciente');

const crearPaciente = async(req, res = response) => {

    const { dni } = req.body

    try {
        
        const existeMail = await Paciente.findOne({dni});
        if (existeMail) {
            return res.status(400).json({
                ok: false,
                msg: 'El Paciente ya está registrado'
            });
        }

        const uid = req.uid;
        const paciente = new Paciente({
            usuario: uid,
            activo: true,
            historiaClinica: '',
            ...req.body
        });

        const pacienteDB = await paciente.save();

        res.json({
            Ok: true,
            pacienteDB 
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar log'
        })
    }

}

const getPacientes = async(req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const [pacientes, total] = await Promise.all([
        Paciente
            .find()
            .populate('obraSocial', 'nombre')
            .skip(desde)
            .limit(5),
        Paciente.countDocuments()
    ])

    res.json({
        Ok: true,
        pacientes,
        total,
    })
}

const actualizarPaciente = async(req, res = response) => {

    const id = req.params.id;

    try {
        const pacienteDB = await Paciente.findById(id);
        if(!pacienteDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un paciente con ese Id'
            });
        }

        const { dni, ...camposPaciente } = req.body;

        if (pacienteDB.dni !==  dni) {
            // valido que el dni no exista en caso de que lo estén modificando
            const existeDni = await Paciente.findOne({dni});
            if (existeDni) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Ya existe un paciente con ese DNI'
                });
            }
        }

        // agrego de nuevo el dni y actualizo
        camposPaciente.dni = dni;
        const pacienteActualizado = await Paciente.findByIdAndUpdate(id, camposPaciente, {new: true});

        res.json({
            ok: true,
            usuario: pacienteActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar log',
        })        
    }

}

const activarInactivarPaciente = async(req, res = response) => {

    const id = req.params.id;

    try {
        const pacienteDB = await Paciente.findById(id);
        if(!pacienteDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un paciente con ese Id'
            });
        }

        const {activo, ...camposPaciente} = req.body;
        if (pacienteDB.activo){ // está activo, hay que inactivar
            camposPaciente.activo = false;
        } else {
            camposPaciente.activo = true;
        }

        const paciente = await Paciente.findByIdAndUpdate(id, camposPaciente, {new:true} );
        res.json({
            ok: true,
            paciente
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar log',
        })        
    }

}

module.exports = {
    crearPaciente,
    getPacientes,
    actualizarPaciente,
    activarInactivarPaciente

}