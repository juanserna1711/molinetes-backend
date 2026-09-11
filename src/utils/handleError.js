export function handleError(error, res, defaultMessage) {
    console.error(error);

    const oracleCode = error.errorNum;

    const businessErrors = {
        20001: 400,
        20002: 400,
        20003: 400,
        20004: 404,
        20005: 404,
        20006: 409,
        20007: 400,
        20008: 400
    };

    const businessMessages = {
        20001: 'El ancho de la talla debe ser mayor que cero.',
        20002: 'El peso por metro cuadrado debe ser mayor que cero.',
        20003: 'El peso del rollo debe ser mayor que cero.',
        20004: 'La talla indicada no existe.',
        20005: 'La talla indicada no existe.',
        20006: 'La talla no tiene información de rendimiento asociada.',
        20007: 'El rendimiento calculado supera el máximo permitido de 9.9.',
        20008: 'Los metros por rollo calculados superan el máximo permitido de 999.9.'
    };

    const statusCode = businessErrors[oracleCode] || 500;
    const message = businessMessages[oracleCode] || defaultMessage;

    return res.status(statusCode).json({
        success: false,
        message
    });
}