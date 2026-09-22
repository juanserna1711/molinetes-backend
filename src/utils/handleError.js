/*=============================================================================
  Nombre responsabilidad: Traducir errores de Oracle a respuestas HTTP

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Centraliza los mensajes de negocio usados por los controladores.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/
/*
  Convierte los errores reconocidos en mensajes para el cliente y usa un mensaje general para los demás.
*/
export function handleError(error, res, defaultMessage) {
    console.error(error);

    const oracleCode = error.errorNum;

    const businessErrors = {
        20001: {
            status: 400,
            field: 'anchoRendtall',
            message: 'El ancho de la talla debe ser mayor que cero.'
        },

        20002: {
            status: 400,
            field: 'pesoRendtall',
            message: 'El peso por metro cuadrado debe ser mayor que cero.'
        },

        20003: {
            status: 400,
            field: 'rolloRendtall',
            message: 'El peso del rollo debe ser mayor que cero.'
        },

        20004: {
            status: 404,
            field: 'codTalla',
            message: 'La talla indicada no existe.'
        },

        20005: {
            status: 409,
            field: null,
            message: 'La talla no tiene información de rendimiento asociada.'
        },

        20006: {
            status: 400,
            field: 'rendimiento',
            message: 'El rendimiento calculado supera el máximo permitido de 99.9.'
        },

        20007: {
            status: 400,
            field: 'metrosRollo',
            message: 'Los metros por rollo calculados superan el máximo permitido de 99999.9.'
        },

        20008: {
            status: 404,
            field: 'codUsuario',
            message: 'El usuario indicado no existe.'
        },

        20009: {
            status: 404,
            field: 'codMolinete',
            message: 'El molinete indicado no existe.'
        },

        20010: {
            status: 400,
            field: 'rpmMolinete',
            message: 'El RPM del molinete no es válido, debe estar entre 1 y 999.'
        },

        20011: {
            status: 400,
            field: 'periMolinete',
            message: 'El perímetro del molinete no es válido, debe estar entre 1 y 999.'
        },

        20012: {
            status: 409,
            field: null,
            message: 'La talla ya tiene información de rendimiento asociada.'
        },

        20013: {
            status: 400,
            field: 'rollos',
            message: 'La cantidad de rollos debe ser mayor que cero.'
        },
        20014: {
            status: 400,
            field: null,
            message: 'Los datos del cálculo no son consistentes.'
        },
        20015: {
            status: 400,
            field: null,
            message: 'El cálculo debe contener al menos un registro.'
        }
    };

    const businessError = businessErrors[oracleCode];

    if (!businessError) {
        return res.status(500).json({
            success: false,
            message: defaultMessage
        });
    }

    return res.status(businessError.status).json({
        success: false,
        code: oracleCode,
        field: businessError.field,
        message: businessError.message
    });
}