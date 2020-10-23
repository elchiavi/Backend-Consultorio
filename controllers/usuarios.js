const { response } = require('express'); // importo ayudas para autocompletado
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0; // si no hay parametro, uso 0

    const [usuarios, total] = await Promise.all([
            Usuario
                .find()
                .skip(desde)
                .limit(5)
                .sort({nombre: 1}),

            Usuario.countDocuments()
    ]); 

    res.json({
        Ok: true,
        usuarios,
        total,
        //uid: req.uid // esto es lo que configuramos para que envié el middleware validar-jwt
    })
}

const crearUsuario = async (req, res) => { // async porque el save revuelve una promise


    const {email, password} = req.body // extraigo los campos

    // verificamos si el usr existe
    try {
        
        const existeEmail =  await Usuario.findOne({email});
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }
        // si no existe lo creamos...
        const usuario = new Usuario(req.body);

        // encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);

        // genero JWT
        const token = await generarJWT( usuario.id, usuario.nombre );

        // guardo en la BD
        await usuario.save(); 
    
        res.json({
            Ok: true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar log'
        })
        
    }
}

const actualizarUsuario = async (req, res= response) =>{

    const uid = req.params.id; // obtengo el id de la request
    

    try {
        const usuarioDB = await Usuario.findById(uid);
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese Id'
            });
        }        
        // Actualización
        // Desestructuro y quito los campos que no quiero actualizar (pass, activo y google). email para usarlo abajo
        const { password, google, activo, email, ...camposUsuario} = req.body;

        if (usuarioDB.email !== email) {
            // si viene por acá tengo que validar que el mail que quiere poner no exista en la bd
            const existeEmail = await Usuario.findOne({ email });
            if ( existeEmail ) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese E-Mail'
                });
            }
        }
        camposUsuario.email = email; // se lo agrego nuevamente ya que hay actualizarlo  
        // actualizo usuario del 1er param con los datos del 2do param
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, camposUsuario, {new:true} ); // new=true es para que devuelva el usuario actualizado

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        })
    }
}

const inactivarActivarUsuario = async (req, res= response) =>{

    const uid = req.params.id; // obtengo el id de la request

    try {
        const usuarioDB = await Usuario.findById(uid);
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese Id'
            });
        }
        const {activo, ...camposUsuario} = req.body;
        if (usuarioDB.activo){ // está activo, hay que inactivar
            camposUsuario.activo = false;
        } else {
            camposUsuario.activo = true;
        }

        const usuario = await Usuario.findByIdAndUpdate(uid, camposUsuario, {new:true} ); // new=true es para que devuelva el usuario actualizado
        res.json({
            ok: true,
            usuario
        })               

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        })
    }
}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    inactivarActivarUsuario
}