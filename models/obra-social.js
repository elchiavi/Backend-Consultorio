const { Schema, model } = require('mongoose');

const ObraSocialSchema = Schema({
    nombre: {
        type: String,
        required: true
    },

    activo: {
        type: Boolean,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
})

ObraSocialSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})

module.exports = model( 'ObraSocial', ObraSocialSchema );