const { response, request } = require('express');

//Importación del modelo
const AsignacionCurso = require('../models/asignacion-curso');
const Curso = require('../models/curso');

const getAsignacionCurso = async (req = request, res = response) => {
    const userRecibido = req.usuario.id;

    //condiciones del get que el estado sea True
    const query = { estado: true, usuario: userRecibido };

    const listaCursos = await Promise.all([
        AsignacionCurso.countDocuments(query),
        AsignacionCurso.find(query)
    ]);

    res.json({
        msg: 'get Api - Controlador Cursos',
        listaCursos
    });

}

const postAsignacionCurso = async (req = request, res = response) => {
            //Obtenmos la info del Req Body
            const { ...body} = req.body;

            const cursoAsignadoDB = await AsignacionCurso.findOne({ _id: body.curso});
            
            //Validacion si el Curso ya existe
            if ( cursoAsignadoDB ) {
                return res.status(400).json({
                    msg: `La asignacion ${cursoAsignadoDB.id}, ya existe en la DB`
                });
            }
            //Creamoa un objeto con info para crear un curso
            const data = {
            //Body trae la demas info
            ...body,
            usuario: req.usuario._id
            }
    
            //Crear un objeto Curso
            const AsignacionCursoGuardadoDB = new AsignacionCurso(data);
    
            //Guardar en BD
            await AsignacionCursoGuardadoDB.save();
    
            res.json({
                msg: 'Post Api - Post Asignacion Curso',
                cursoGuardadoDB: AsignacionCursoGuardadoDB
            });
}


const putAsignacionCurso = async (req = request, res = response) => {
        //Req.params sirve para traer parametros de las rutas
        const { id } = req.params;
        
        const {...resto } = req.body;
        // resto de valores del body

        //Traer info del curso a editar
        const CursoDB = await Curso.findOne({id: resto.curso.id});

        //Verificar que el usuario editor sea el owner del curso
        if (!CursoDB.usuario.equals(req.usuario._id) ) {
            return res.json({
                msg: 'Usted no es propietario de este curso'     
            })
        }

        //Editar al curso por el id (El true es para que se actualize si osi)
        const cursoEditado = await AsignacionCurso.findByIdAndUpdate(id, resto, {new: true});

        res.json({
            msg: 'PUT editar Curso',
            cursoEditado
        });

}

const deleteAsignacionCurso = async(req = request, res = response) => {
        //Encontrar a los alumnos asignados al curso

        

        //Req.params sirve para traer parametros de las rutas
        const {id} = req.params;

        const cursoAsignadoDB = await AsignacionCurso.findOne({ _id: id});

        //Traer info del curso a editar /idCampoABuscar: objetoId.AtirbutoID
        const CursoDB = await Curso.findOne({_id: cursoAsignadoDB.curso});

        //Verificar que el usuario editor sea el owner del curso
        if (!CursoDB.usuario.equals(req.usuario._id) ) {
            return res.json({
                msg: 'Usted no es propietario de este curso'     
            })
        }

        //Eliminar fisicamente de la DB
        //const usuarioEliminado = await Usuario.findByIdAndDelete( id);

        //Eliminar cambiando el estado a false
        const cursoEliminado = await AsignacionCurso.findByIdAndUpdate(id, { estado: false });

        res.json({
            msg: 'DELETE eliminar Curso',
            cursoEliminado
        });
}

module.exports = {
    getAsignacionCurso,
    postAsignacionCurso,
    putAsignacionCurso,
    deleteAsignacionCurso
}


// CONTROLADOR