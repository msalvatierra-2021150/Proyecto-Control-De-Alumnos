//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getCurso, postCurso, putCurso, deleteCurso } = require('../controllers/curso');
const { esRoleValido, existeCursoPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole, esRolAdmin } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar',[
    validarJWT,
    esRolAdmin
], getCurso);

router.post('/agregar', [
    validarJWT,
    esRolAdmin,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripcion debe ser al menos de 30 caracteres').isLength( { min: 30 } ),
    validarCampos,
] ,postCurso);

router.put('/editar/:id', [
    validarJWT,
    esRolAdmin,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCursoPorId ),
    validarCampos
] ,putCurso);


router.delete('/eliminar/:id', [
    validarJWT,
    esRolAdmin,
    tieneRole('MAESTRO_ROLE', 'COORDINADOR_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCursoPorId ),
    validarCampos
] ,deleteCurso);


module.exports = router;


// ROUTES