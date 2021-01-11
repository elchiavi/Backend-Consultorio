const { Schema, model } = require('mongoose');

const TurnoSchema = Schema({

    title: {
        type: String,
        required: true
    },

    prestacion: {
        type: Schema.Types.ObjectId,
        ref: 'Prestacion',
        required: true
    },

    start: {
        type: Date,
        required: true
    },

    end: {
        type: Date,
        required: true
    },

    asistio: {
        type: Boolean,
        required: true
    },

    paciente: {
        type: Schema.Types.ObjectId,
        ref: 'Paciente',
        required: true
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

})

TurnoSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})

module.exports = model( 'turno', TurnoSchema );