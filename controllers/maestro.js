const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importación del modelo
const Maestro = require('../models/usuario');
const { parseJwt } = require('../helpers/decodificador-token');


const getMaestro = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true , rol: "MAESTRO_ROLE"};

    const listaMaestros = await Promise.all([
        Maestro.countDocuments(query),
        Maestro.find(query)
    ]);

    res.json({
        msg: 'get Api - Controlador Maestro',
        listaMaestros
    });

}

const getMaestroById = async (req = request, res = response) => {
    rol['uid']= parseJwt(req.headers['x-token']);
    

    //condiciones del get
    const query = {_id: rol,  estado: true , rol: "ADMIN_ROLE"};

    const listaMaestros = await Promise.all([
        Maestro.countDocuments(query),
        Maestro.find(query)
    ]);

    res.json({
        msg: 'get Api - Controlador Maestro',
        listaMaestros
    });

}

const postMaestro = async (req = request, res = response) => {
    const rol = 'MAESTRO_ROLE'
    //Desestructuración
    const { nombre, correo, password} = req.body;
    const usuarioGuardadoDB = new Maestro({ nombre, correo, password, rol });

    //Encriptar password
    const salt = bcrypt.genSaltSync();
    usuarioGuardadoDB.password = bcrypt.hashSync(password, salt);

    //Guardar en BD
    await usuarioGuardadoDB.save();

    res.json({
        msg: 'Post Api - Post Maestro',
        usuarioGuardadoDB
    });

}


const putMaestro = async (req = request, res = response) => {

    //Req.params sirve para traer parametros de las rutas
    const  id  = req.usuario.id;
    const { _id, img,  /* rol,*/  estado, google, rol, ...resto } = req.body;
    //Los parametros img, rol, estado y google no se modifican, el resto de valores si (nombre, correo y password)

    //Si la password existe o viene en el req.body, la encripta
    if ( resto.password ) {
        //Encriptar password
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }

    //Editar al usuario por el id
    const usuarioEditado = await Maestro.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'PUT editar Maestro',
        usuarioEditado
    });

}

const deleteMaestro = async(req = request, res = response) => {
    //Req.params sirve para traer parametros de las rutas
    const  id  = req.usuario.id;

    //Eliminar fisicamente de la DB
    //const usuarioEliminado = await Usuario.findByIdAndDelete( id);

    //Eliminar cambiando el estado a false
     const usuarioEliminado = await Maestro.findByIdAndUpdate(id, { estado: false });

    res.json({
        msg: 'DELETE eliminar maestro',
        usuarioEliminado
    });
}

module.exports = {
    getMaestro,
    postMaestro,
    putMaestro,
    deleteMaestro
}


// CONTROLADOR