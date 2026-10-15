/*=============================================================================
  Nombre responsabilidad: Validar permisos de acceso por módulo

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 08/Octubre/2026

  Descripcion responsabilidad:
  Valida que el usuario autenticado tenga autorización para ejecutar una
  acción determinada sobre un módulo, de acuerdo con las reglas de permisos.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import { consultarReglas } from '../services/reglas.service.js';
import { handleError } from '../utils/handleError.js';

/*
  Recibe el código del módulo y la acción que se desea validar.
  Consulta la regla correspondiente al usuario autenticado y permite
  continuar únicamente cuando el permiso asociado se encuentra activo.
*/
export function validarPermiso(codModulo, accion) {

    return async function (req, res, next) {
        try {

            const reglas = await consultarReglas({
                codUsuario: req.user.codigo,
                codModulo
            });

            /*
              Si no existe una regla para la combinación usuario y módulo,
              el usuario no tiene autorización para acceder al recurso.
            */
            if (reglas.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'No tiene permisos para acceder a este módulo.'
                });
            }

            const regla = reglas[0];

            /*
              Relaciona la acción solicitada con la propiedad de permiso
              devuelta por reglas.service.js.
            */
            const permisos = {
                consulta: regla.consulta,
                insercion: regla.insercion,
                actualiza: regla.actualiza,
                elimina: regla.elimina,
                reporte: regla.reporte
            };

            const permiso = permisos[accion];

            /*
              Una acción no reconocida se considera una configuración inválida
              del middleware y no se permite continuar con la solicitud.
            */
            if (permiso === undefined) {
                return res.status(500).json({
                    success: false,
                    message: 'El permiso solicitado no está configurado.'
                });
            }

            /*
              Los valores A/a representan permiso activo.
              Cualquier otro valor impide ejecutar la operación.
            */
            if (String(permiso).toUpperCase() !== 'A') {
                return res.status(403).json({
                    success: false,
                    message: 'No tiene permiso para realizar esta acción.'
                });
            }

            next();

        } catch (error) {
            return handleError(
                error,
                res,
                'Error al validar los permisos del usuario.'
            );
        }
    };
}