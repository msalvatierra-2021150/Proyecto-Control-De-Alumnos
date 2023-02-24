const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const { parseJwt } = require('../helpers/decodificador-token');

//Importación del modelo
const Alumno = require('../models/usuario');

const getAlumno = async (req = request, res = response) => {
    const userRecibido = req.usuario.id;

    if (req.usuario.rol === 'MAESTRO_ROLE') {
        return res.json({
            msg: 'No esta permitido ver este perfil (Tratar de ver Perfil Maestro Siendo alumno)'
        });    
    }
    //condiciones del get que el estado sea True
    const query = { estado: true, _id: userRecibido };

    const listaUsuarios = await Promise.all([
        Alumno.countDocuments(query),
        Alumno.find(query)
    ]);

    res.json({
        msg: 'get Api - Controlador Alumno',
        listaUsuarios
    });

}

const postAlumno = async (req = request, res = response) => {
    const rol = "ALUMNO_ROLE"
    //Desestructuración
    const { nombre, correo, password } = req.body;
    const usuarioGuardadoDB = new Alumno({ nombre, correo, password, rol });

    //Encriptar password
    const salt = bcrypt.genSaltSync();
    usuarioGuardadoDB.password = bcrypt.hashSync(password, salt);

    //Guardar en BD
    await usuarioGuardadoDB.save();

    res.json({
        msg: 'Post Api - Post Alumno',
        usuarioGuardadoDB
    });

}

const putAlumno = async (req = request, res = response) => {
    if (req.usuario.rol === 'MAESTRO_ROLE') {
        return res.json({
            msg: 'No esta permitido editar este perfil (Tratar de ver Perfil Maestro Siendo alumno)'
        });    
    }

    //Ahora traigo el id del alumno a editar por el token
    const idAEditar = req.usuario._id;

    const { _id, img,  estado, google, rol, ...resto } = req.body;
    //Los parametros img, estado y google no se modifican, el resto de valores si (nombre, correo y password)

    //Si la password existe o viene en el req.body, la encripta
    if ( resto.password ) {
        //Encriptar password
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }

    //Editar al usuario por el id
    const usuarioEditado = await Alumno.findByIdAndUpdate(idAEditar, resto);

    res.json({
        msg: 'PUT editar alumno',
        usuarioEditado,
    });

}

/*
put que usa el id que se mande por parametros
const putAlumno = async (req = request, res = response) => {

    //Req.params sirve para traer parametros de las rutas
    const { id } = req.params;
    const { _id, img,  estado, google, rol, ...resto } = req.body;
    //Los parametros img, rol, estado y google no se modifican, el resto de valores si (nombre, correo y password)

    //Si la password existe o viene en el req.body, la encripta
    if ( resto.password ) {
        //Encriptar password
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }

    //Editar al usuario por el id
    const usuarioEditado = await Alumno.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'PUT editar alumno',
        usuarioEditado
    });

}
*/

const deleteAlumno = async(req = request, res = response) => {
    if (req.usuario.rol === 'MAESTRO_ROLE') {
        return res.json({
            msg: 'No esta permitido eliminar este perfil (Tratar de ver Perfil Maestro Siendo alumno)'
        });    
    }
    //Ahora traigo el id del alumno a editar por el token
    const idAEliminar = req.usuario.id;

    //Req.params sirve para traer parametros de las rutas
    //const { id } = req.params;

    //Eliminar fisicamente de la DB
    //const usuarioEliminado = await Usuario.findByIdAndDelete( id);

    //Eliminar cambiando el estado a false
     const usuarioEliminado = await Alumno.findByIdAndUpdate(idAEliminar, { estado: false });

    res.json({
        msg: 'DELETE eliminar Alumno',
        usuarioEliminado
    });
}

module.exports = {
    getAlumno,
    postAlumno,
    putAlumno,
    deleteAlumno
}


// CONTROLADOR