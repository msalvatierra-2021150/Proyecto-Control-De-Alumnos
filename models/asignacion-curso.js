const { Schema, model } = require('mongoose');

const asignacionCursoSchema = Schema({
    curso: {
        type: Schema.Types.ObjectId,
        ref: 'Curso', 
        required: true
    }, 
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario', 
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});


module.exports = model('asignacionCurso', asignacionCursoSchema);