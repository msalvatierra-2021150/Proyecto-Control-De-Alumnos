//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getAlumno, postAlumno, putAlumno, deleteAlumno } = require('../controllers/alumno');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');
const { borrarDatos } = require('../middlewares/validarAlumno');

const router = Router();

router.get('/mostrar',[
    validarJWT
], getAlumno);

router.post('/agregar', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    //Por Default se logean como alumnos
    //check('rol').custom(  esRoleValido ),
    validarCampos,
] ,postAlumno);

/*
router.put('/editar/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
        //Por Default se update como alumnos
        //check('rol').custom(  esRoleValido ),
    validarCampos
] ,putAlumno);
*/

//Enviar ID por URL
/*
router.put('/editar/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
        //Por Default se update como alumnos
        //check('rol').custom(  esRoleValido ),
    validarCampos
] ,putAlumno);
*/

//Enviar Ruta sin Id esperando al TOKEN traiga el ID
router.put('/editar/', [
    validarJWT,
    //check('id', 'No es un ID válido').isMongoId(),
    //check('id').custom( existeUsuarioPorId ),
        //Por Default se update como alumnos
        //check('rol').custom(  esRoleValido ),
    validarCampos
] ,putAlumno);

/*
//Eliminar usando el id de la URL
router.delete('/eliminar/:id', [
    //validarJWT,
    //esAdminRole,
    //tieneRole('ADMIN_ROLE'),
    //check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
] ,deleteAlumno);
*/

//Eliminar id obteniendo el Id por el TOKEN
router.delete('/eliminar', [
    validarJWT,
    borrarDatos,
    validarCampos
] ,deleteAlumno);


module.exports = router;


// ROUTES