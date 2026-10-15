import jwt from 'jsonwebtoken';

export function autenticarUsuario(req, res, next) {

    const token = req.cookies?.moliplus_token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Debe iniciar sesión para continuar.'
        });
    }

    try {

        const usuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = {
            codigo: usuario.codigo,
            nombre: usuario.nombre
        };

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: 'La sesión no es válida o ha expirado.'
        });

    }

}