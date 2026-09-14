export function handleError(error, res, defaultMessage) {
    console.error(error);

    const oracleCode = error.errorNum;

    const businessErrors = {
        20001: 400,
        20002: 400,
        20003: 400,
        20004: 404,
        20005: 409,
        20006: 400,
        20007: 400,
        20008: 404,
        20009: 404,
        20010: 400,
        20011: 400,
        20012: 409
    };

    const businessMessages = {
        20001: 'El ancho de la talla debe ser mayor que cero.',
        20002: 'El peso por metro cuadrado debe ser mayor que cero.',
        20003: 'El peso del rollo debe ser mayor que cero.',
        20004: 'La talla indicada no existe.',
        20005: 'La talla no tiene información de rendimiento asociada.',
        20006: 'El rendimiento calculado supera el máximo permitido de 9.9.',
        20007: 'Los metros por rollo calculados superan el máximo permitido de 999.9.',
        20008: 'El usuario indicado no existe.',
        20009: 'El molinete indicado no existe.',
        20010: 'El RPM del molinete no es válido, debe estar entre 1 y 999.',
        20011: 'El perímetro del molinete no es válido, debe estar entre 1 y 999.',
        20012: 'No se puede eliminar la talla porque tiene registros de rendimiento asociados.'
    };

    const statusCode = businessErrors[oracleCode] || 500;
    const message = businessMessages[oracleCode] || defaultMessage;

    return res.status(statusCode).json({
        success: false,
        message
    });
}