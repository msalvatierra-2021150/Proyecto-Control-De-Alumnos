//Importaciones de nodejs
const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');

class Server {

    constructor() {
        //Configuración inicial
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth : '/api/auth',
            alumnos : '/api/alumno',
            cursos : '/api/cursos',
            maestros : '/api/maestro',
            asignacionCursos: '/api/asignacion-cursos'
        }

        //Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        //Rutas de mi app
        this.routes();

    }

    //Función de conexión
    async conectarDB() {
        await dbConection();
    }

    //Un middleware es una función que se ejecuta antes de las rutas
    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del Body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));

    }


    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.alumnos, require('../routes/alumno'));
        this.app.use(this.paths.cursos, require('../routes/curso'));
        this.app.use(this.paths.maestros, require('../routes/maestro'));
        this.app.use(this.paths.asignacionCursos, require('../routes/asignacion-curso'));
    }


    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto ', this.port);
        })
    }


}


//Importamos la clase Server
module.exports = Server;