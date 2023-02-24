//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getAsignacionCurso, postAsignacionCurso, putAsignacionCurso, deleteAsignacionCurso } = require('../controllers/asignacion-curso');
const { cursosPorUsuario, yaSeAsignoAlCurso } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esRolAdmin } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar',[
    validarJWT,
], getAsignacionCurso);

router.post('/agregar', [
    validarJWT,
    yaSeAsignoAlCurso,
    cursosPorUsuario,
    check('curso', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
] ,postAsignacionCurso);

//Enviar Ruta sin Id esperando al TOKEN traiga el ID
router.put('/editar/:id', [
    validarJWT,
    esRolAdmin,
    check('curso', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
] ,putAsignacionCurso);

//Eliminar id obteniendo el Id por el TOKEN
router.delete('/eliminar/:id', [
    validarJWT,
    validarCampos
] ,deleteAsignacionCurso);

module.exports = router;


// ROUTES