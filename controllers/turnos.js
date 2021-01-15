const { response } = require('express'); // importo ayudas para autocompletado
const Turno = require('../models/turno');
const Usuario = require('../models/usuario');
const Paciente = require('../models/paciente');
const nodemailer = require("nodemailer");

const getTurnos = async (req, res = response) => {

    const uid = req.uid;
    const turnos = await Turno.find({'usuario': uid})
                                .populate('paciente',['apellido' , 'nombre'] )
                                .populate('prestacion',['nombre'] );

    res.json({
            ok: true,
            turnos
    });

}

const turnosPorPaciente = async (req, res = response) => {
    
    const uid = req.uid;
    const idPac = req.params.id;
    const turnos = await Turno.find({'usuario': uid})
                              .find({ paciente: idPac })
                              .sort({start: -1})
                              .populate('prestacion',['nombre'])

    res.json({
    ok: true,
    turnos
    });

}

const crearTurno = async (req, res = response) => {

    const turno = new Turno( req.body );

    try {
        const usuario = await Usuario.findById( req.uid);
        const paciente = await Paciente.findById( turno.paciente);
        turno.usuario = req.uid;
        turno.start = turno.start.setHours(turno.start.getHours() - 3);
        turno.end = turno.end.setHours(turno.end.getHours() - 3);
        turno.asistio = false;
        
        const turnoGuardado = await turno.save();

        // let transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //       user: usuario.email,
        //       pass: 'lobita932'
        //     },
        // });

        // let mailOptions = {
        //     from: usuario.email,
        //     to: paciente.email,
        //     subject: 'Turno Consultorio',
        //     text: `Buenas tardes, se envía mail de confirmación de turno para el día ${req.body.start}`
        // };

        // transporter.sendMail(mailOptions, function (error, info) {
        //     if (error) {
        //       console.log("ERROR!!!!!!", error);
        //     } else {
        //       console.log('Email sent: ' + info.response);
        //     }
        // });

        res.json({
            ok: true,
            turno: turnoGuardado
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const eliminarTurno = async (req, res = response) => {

    const turnoId = req.params.id;
    const uid = req.uid;

    try {

        const turno = await Turno.findById( turnoId);

        if( !turno) {
            return res.status(404).json({
                ok: false,
                msg: 'El turno no existe por ese id'
            });

        }

        await Turno.findByIdAndDelete( turnoId);
        res.json({ ok: true });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });        
    }

}

const confirmarTurno = async (req, res = response) => {

    const turnoId = req.params.id;

    try {

        const turno = await Turno.findById( turnoId );

        if ( !turno ) {
            return res.status(404).json({
                ok: false,
                msg: 'El Turno no existe por ese id'
            });
        }

        const {asistio, ...camposTurno} = req.body;
        camposTurno.asistio = true;

        const turnoConfirmado = await Turno.findByIdAndUpdate(turnoId, camposTurno, {new: true});

        res.json({
            ok: true,
            ObraSocial: turnoConfirmado
        })

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });        
    }

}

const actualizarTurno = async( req, res = response ) => {
    
    const turnoId = req.params.id;
    const uid = req.uid;

    try {

        const turno = await Turno.findById( turnoId );

        if ( !turno ) {
            return res.status(404).json({
                ok: false,
                msg: 'El Turno no existe por ese id'
            });
        }


        const nuevoTurno = {
            ...req.body,
            user: uid
        }

        start = new Date( nuevoTurno.start);
        end = new Date( nuevoTurno.end);
        
        start = start.setHours(start.getHours() - 3);
        end = end.setHours(end.getHours() - 3);

        nuevoTurno.start = start;
        nuevoTurno.end = end;

        const turnoActualizado = await Turno.findByIdAndUpdate( turnoId, nuevoTurno, { new: true } );
        res.json({
            ok: true,
            turno: turnoActualizado
            
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

module.exports = {
    crearTurno,
    getTurnos,
    actualizarTurno,
    eliminarTurno,
    confirmarTurno,
    turnosPorPaciente
}