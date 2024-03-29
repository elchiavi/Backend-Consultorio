// siempre en singular el nombre del modelo
const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    },
    activo: {
        type: Boolean,
        default: true
    }
}); 

// modificar visualmente un objeto, en este caso los atributos _id por uid y tambien quito __v y pass
UsuarioSchema.method('toJSON', function() {
    const {__v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model( 'Usuario', UsuarioSchema );