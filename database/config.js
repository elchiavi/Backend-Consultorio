const mongoose = require('mongoose');

const dbConnection = async() =>{

    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('BD Online');

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la BD -Ver Logs-');

    }

}

module.exports = {
    dbConnection
}