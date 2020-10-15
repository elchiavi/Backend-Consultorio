const { response } = require('express'); // importo ayudas para autocompletado
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {

    const {email, password} = req.body;

    try {
        // validar email

        const usuarioDB = await Usuario.findOne({email});
        
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario y/o la contraseña no son validas'
            });
        }

        // validar contraseña
        const validPassword = bcryptjs.compareSync(password, usuarioDB.password); // compara hasheando la pass enviada con la de la BD

        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario y/o la contraseña no son validas'
            });

        }

        // Generar el token = JWT ya que el mail y pass son correctos

        const token = await generarJWT( usuarioDB.id, usuarioDB.nombre );

        res.status(200).json({
            ok: true,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Comunicarse con el administrador'
        })
        
    }

} 

const googleSignIn = async (req, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify( googleToken);

        // verifico si ya existe ese user en mi BD
        const usuarioDB = await Usuario.findOne({ email: email });
        let usuario;
        // si no existe
        if ( !usuarioDB ) {
            usuario = new Usuario({
                nombre : name,
                email : email,
                password : '@@@',
                img : picture,
                google : true

            });
            
        } else {
            // si existe
            usuario = usuarioDB;
            usuario.google = true;
        }

        // guardo en BD
        await usuario.save();

        // generar JWT

        const token = await generarJWT( usuario.id );

        res.json( {
            ok: true,
            token
        });
        
    } catch (error) {

        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto'
        });

    }
} 

const renewToken = async (req, res = response) => {

  	const uid = req.uid;

        // generar JWT
        const token = await generarJWT( uid );
    	const usuario = await Usuario.findById( uid );

        res.json( {
            ok: true,
            token,
	    usuario
            
        });

}



module.exports = {
    login,
    googleSignIn,
    renewToken
}