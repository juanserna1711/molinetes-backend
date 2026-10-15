import jwt from 'jsonwebtoken';

import { buscarUsuarioPorNombre } from '../services/auth.service.js';
import { handleError } from '../utils/handleError.js';


export async function iniciarSesion(req, res) {

    try {

        const { usuario, password } = req.body;

        if (!usuario || !password) {
            return res.status(400).json({
                success: false,
                message: 'Debe ingresar usuario y contraseña.'
            });
        }

        const usuarioEncontrado = await buscarUsuarioPorNombre(
            usuario.trim()
        );

        if (!usuarioEncontrado) {
            return res.status(401).json({
                success: false,
                message: 'Usuario o contraseña incorrectos.'
            });
        }

        if (usuarioEncontrado.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Usuario o contraseña incorrectos.'
            });
        }

        if (usuarioEncontrado.estado !== 'A') {
            return res.status(403).json({
                success: false,
                message: 'El usuario se encuentra inactivo.'
            });
        }

        const token = jwt.sign(
            {
                codigo: usuarioEncontrado.codigo,
                nombre: usuarioEncontrado.nombre
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '8h'
            }
        );

        res.cookie(
            'moliplus_token',
            token,
            {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 8 * 60 * 60 * 1000,
                path: '/'
            }
        );

        return res.status(200).json({
            success: true,
            usuario: {
                codigo: usuarioEncontrado.codigo,
                nombre: usuarioEncontrado.nombre
            }
        });

    } catch (error) {

        return handleError(
            error,
            res,
            'No fue posible iniciar sesión.'
        );

    }

}

export function obtenerSesion(req, res) {

    return res.status(200).json({
        success: true,
        usuario: {
            codigo: req.user.codigo,
            nombre: req.user.nombre
        }
    });

}

export function cerrarSesion(req, res) {

    res.clearCookie('moliplus_token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/'
    });

    return res.status(200).json({
        success: true,
        message: 'Sesión cerrada correctamente.'
    });

}