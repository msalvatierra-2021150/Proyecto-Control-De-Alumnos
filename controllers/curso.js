const { response, request } = require('express');
const AsignacionCurso = require('../models/asignacion-curso');

//Importación del modelo
const Curso = require('../models/curso');

const getCurso = async (req = request, res = response) => {
    const userRecibido = req.usuario.id;

    //condiciones del get que el estado sea True
    const query = { estado: true, usuario: userRecibido };

    const listaCursos = await Promise.all([
        Curso.countDocuments(query),
        Curso.find(query)
    ]);

    res.json({
        msg: 'get Api - Controlador Cursos',
        listaCursos
    });

}

const postCurso = async (req = request, res = response) => {
            //Obtenmos la info del Req Body
            const { ...body} = req.body;
            const cursoDB = await Curso.findOne({nombre: body.nombre});

            //Validacion si el Curso ya existe
            if ( cursoDB ) {
                return res.status(400).json({
                    msg: `El producto ${cursoDB.nombre}, ya existe en la DB`
                });
            }
            //Creamoa un objeto con info para crear un curso
            const data = {
            //Body trae la demas info
            ...body,
            usuario: req.usuario._id
            }
    
            //Crear un objeto Curso
            const cursoGuardadoDB = new Curso(data);
    
            //Guardar en BD
            await cursoGuardadoDB.save();
    
            res.json({
                msg: 'Post Api - Post Curso',
                cursoGuardadoDB
            });
}


const putCurso = async (req = request, res = response) => {
        //Req.params sirve para traer parametros de las rutas
        const { id } = req.params;
        
        const {...resto } = req.body;
        // resto de valores del body
        
        //Traer info del curso a editar
        const cursoDB = await Curso.findOne({_id: id });

        //Verificar que el usuario editor sea el owner del curso
        if (!cursoDB.usuario.equals(req.usuario.id) ) {
            return res.json({
                msg: 'Usted no es propietario de este curso'     
            })
        }

        //Editar al curso por el id (El true es para que se actualize si osi)
        const cursoEditado = await Curso.findByIdAndUpdate(id, resto, {new: true});

        res.json({
            msg: 'PUT editar Curso',
            cursoEditado
        });

}

const deleteCurso = async(req = request, res = response) => {
        //Req.params sirve para traer parametros de las rutas
        const {id} = req.params;

        //Traer info del curso a editar /idCampoABuscar: objetoId.AtirbutoID
        const cursoDB = await Curso.findOne({_id: id});

        //Verificar que el usuario editor sea el owner del curso
            if (!cursoDB.usuario.equals(req.usuario.id) ) {
                return res.json({
                    msg: 'Usted no es propietario de este curso'     
                })
            }

        //Eliminar fisicamente de la DB
        const cursoEliminado = await Curso.findByIdAndDelete(id);
        const asignacionCurso = await AsignacionCurso.remove({curso: id});

        //Eliminar cambiando el estado a false
        //const cursoEliminado = await Curso.findByIdAndUpdate(id, { estado: false });

        res.json({
            msg: 'DELETE eliminar Curso',
            cursoEliminado,
            asignacionCurso
        });
}

module.exports = {
    getCurso,
    postCurso,
    putCurso,
    deleteCurso
}


// CONTROLADOR