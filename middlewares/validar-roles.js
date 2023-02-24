const { request, response } = require('express');
const { parseJwt } = require('../helpers/decodificador-token');

//Operador rest u operador spread 
const tieneRole = ( ...roles ) => {

    return (req = request, res= response, next) => {

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            })
        }

        if (!roles.includes( req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${ roles }`
            })

        }

        next();

    }

}

const validarRolPorToken = (token) => {
    rolPorToken = parseJwt (token);

    if (!rolPorToken.includes('MAESTRO_ROLE', 'COORDINADOR_ROLE')) {
        return false;
    } else {
        return true;
    }
}

const esRolAdmin = (req = request, res= response, next) => {
    if (req.usuario.rol == 'MAESTRO_ROLE') {
        next();
    } else {
        res.json({
            msg: 'Se necesita un Rol de Maestro para esta accion',
        });
    }
}

module.exports = {
    tieneRole,
    validarRolPorToken,
    esRolAdmin
}