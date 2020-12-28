const Usuario = require('../models/usuario');
var fs = require('fs');

const borrarImagen = (path) => {

    // si existe ese path, osea la imagen, la tengo que borrar para no tener las imagenes anteriores en el srv
    if (fs.existsSync(path)){
        fs.unlinkSync(path); // borrar img anterior
    };

}


const actualizarImagen = async ( tipo, id, nombreArchivo ) => {

    let pathViejo = '';

    switch (tipo) {

        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario){
                console.log('No es un usuario');
                return false;
            }

            pathViejo = `./uploads/usuarios/${usuario.img}`; // imagen anterior
            borrarImagen(pathViejo);

            // actualizo imagen y guardo en BD
            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
        
        break;
    
    }

}

module.exports = {
    actualizarImagen
}