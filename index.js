const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

const {dbConnection} = require('./database/config')

// crear el servidor express
const app = express();

// configurar CORS
app.use(cors()); // use es un middleware

// lectura y parseo del body. Siempre antes de las rutas
app.use(express.json());

// Base de datos
dbConnection();

// rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/obrassociales', require('./routes/obras-sociales'));
app.use('/api/pacientes', require('./routes/pacientes'));
app.use('/api/busquedas', require('./routes/busquedas') );
app.use('/api/turnos', require('./routes/turnos') );
app.use('/api/prestaciones', require('./routes/prestaciones') );

// Lo ultimo luego de desplegar

app.use(express.static(path.join(__dirname, './public')));

app.get('*', (req, res) => {

    res.sendFile( path.resolve(__dirname, './public/index.html'));

});


// levantar servidor
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
})