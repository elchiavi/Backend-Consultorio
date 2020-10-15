const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');
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

        case 'medicos':
            const medico = await Medico.findById(id);
            if (!medico){
                console.log('No es un médico');
                return false;
            }

            pathViejo = `./uploads/medicos/${medico.img}`; // imagen anterior
            borrarImagen(pathViejo);

            // actualizo imagen y guardo en BD
            medico.img = nombreArchivo;
            await medico.save();
            return true;
        
        break;
        
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
    
        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if (!hospital){
                console.log('No es un hospital');
                return false;
            }

            pathViejo = `./uploads/hospitales/${hospital.img}`; // imagen anterior
            borrarImagen(pathViejo);

            // actualizo imagen y guardo en BD
            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
        
        break;
    }

}

module.exports = {
    actualizarImagen
}