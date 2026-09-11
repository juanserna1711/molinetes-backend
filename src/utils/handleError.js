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

    const statusCode = businessErrors[oracleCode] || 500;

    return res.status(statusCode).json({
        success: false,
        message: error.message || defaultMessage
    });
}