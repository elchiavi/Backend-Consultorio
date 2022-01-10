const { Schema, model } = require('mongoose');

const PacienteSchema = Schema({

    nombre: {
        type: String,
        required: true
    },

    apellido: {
        type: String,
        required: true
    },

    dni: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    fechaNac: {
        type: String,
        required: true
    },

    sexo: {
        type: String,
        required: true
    },

    direccion: {
        type: String,
        required: true
    },

    telefono: {
        type: String,
        required: true
    },

    ciudad: {
        type: String,
        required: true
    },

    obraSocial: {
        type: Schema.Types.ObjectId,
        ref: 'ObraSocial',
        required: true
    },

    numeroAfiliado: {
        type: String,
        required: true
    },

    historiaClinica: {
        type: String,
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

    activo: {
        type: Boolean,
        default: true
    }

});

PacienteSchema.method('toJSON', function() {
    const {__v, ...object } = this.toObject();
    return object;
})

module.exports = model( 'Paciente', PacienteSchema );