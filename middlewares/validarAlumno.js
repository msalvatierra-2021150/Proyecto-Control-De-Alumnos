const AsignacionCurso = require('../models/asignacion-curso');
const Curso = require('../models/asignacion-curso');


const borrarDatos = async(req = request, res = response, next)=>{
    const _idAlumnos = req.usuario.id;

    const query = {usuario: _idAlumnos};
    
    const existeUsuario = await AsignacionCurso.find(query);

    if(existeUsuario){
            const asignacionesEliminadas = await AsignacionCurso.deleteMany(query);
        next(); 
    }else{ 
        next();
    }
}

module.exports = {
    borrarDatos
}
