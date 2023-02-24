const Role = require('../models/role');
const Usuario = require('../models/usuario');
const Curso = require('../models/curso');
const { request, response } = require('express');
const AsignacionCurso = require('../models/asignacion-curso');

//Este archivo maneja validaciones personalizadas

const esRoleValido = async( rol = '') => {

    const existeRol = await Role.findOne( { rol } );

    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la DB`);
    }

}


const emailExiste = async( correo = '' ) => {

    //Verificamos si el correo ya existe en la DB
    const existeEmail = await Usuario.findOne( { correo } );

    //Si existe (es true) lanzamos excepción
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo } ya existe y esta registrado en la DB`);
    }

}


const existeUsuarioPorId = async(id) => {

    //Verificar si el ID existe
    const existeUser = await Usuario.findById(id);

    if ( !existeUser ) {
        throw new Error(`El id ${ id } no existe en la DB`);
    }

}

const existeCursoPorId = async(id) => {

    //Verificar si el ID existe
    const existeCurso = await Curso.findById(id);

    if ( !existeCurso ) {
        throw new Error(`El id ${ id } no existe en la DB`);
    }

}

const cursosPorUsuario = async(req = request, res= response, next) => {
    const idUsuario = req.usuario.id;
    const limite = 3;


    //Verificar si el ID existe
    const cantidadDeAsignadas  = await 
        AsignacionCurso.countDocuments({usuario : idUsuario});

    if ( cantidadDeAsignadas == limite ) {
        return res.json ({
            msg: `El usuario con id ${ idUsuario } excede en cursos asignados`
        });
        
        throw new Error(`El usuario con id ${ idUsuario } excede en cursos asignados`);
    }
    next();

}

const yaSeAsignoAlCurso = async(req = request, res= response, next) => {
    const idUsuario = req.usuario.id;
    const { curso }= req.body;

    const query = { estado: true,
        usuario : idUsuario,
         curso: curso };


    //Verificar si el ID existe
    const existeAsignacion = await AsignacionCurso.findOne(query);


    if ( existeAsignacion === null) {
        next();
    } else {
        return res.json ({
            msg: `El usuario ${ idUsuario} ${ req.usuario.nombre} ya se asigno en este curso ${curso}`
        });
    }


}

module.exports = {
    esRoleValido,
    emailExiste,
    existeCursoPorId, 
    existeUsuarioPorId,
    cursosPorUsuario,
    yaSeAsignoAlCurso
}