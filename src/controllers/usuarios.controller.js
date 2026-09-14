import {
    consultarUsuarios,
    insertarUsuario,
    actualizarUsuario,
    activarUsuario,
    desactivarUsuario,
    eliminarUsuario
} from '../services/usuarios.service.js';

import { handleError } from '../utils/handleError.js';


export async function consultar(req, res) {
    try {
        const { codigo, nombre, estado } = req.query;

        const usuarios = await consultarUsuarios({
            codUsuario: codigo ? Number(codigo) : null,
            nomUsuario: nombre || null,
            estaUsuario: estado || null
        });

        return res.status(200).json({
            success: true,
            data: usuarios
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al consultar los usuarios.'
        );
    }
}

export async function crear(req, res) {
    try {
        await insertarUsuario(req.body);

        return res.status(201).json({
            success: true,
            message: 'Usuario creado correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al crear el usuario.'
        );
    }
}


export async function actualizar(req, res) {
    try {
        const codUsuario = Number(req.params.codigo);

        await actualizarUsuario(codUsuario, req.body);

        return res.status(200).json({
            success: true,
            message: 'Usuario actualizado correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al actualizar el usuario.'
        );
    }
}

export async function activar(req, res) {
    try {
        const codUsuario = Number(req.params.codigo);

        await activarUsuario(codUsuario);

        return res.status(200).json({
            success: true,
            message: 'Usuario activado correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al activar el usuario.'
        );
    }
}


export async function desactivar(req, res) {
    try {
        const codUsuario = Number(req.params.codigo);

        await desactivarUsuario(codUsuario);

        return res.status(200).json({
            success: true,
            message: 'Usuario desactivado correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al desactivar el usuario.'
        );
    }
}

export async function eliminar(req, res) {
    try {
        const codUsuario = Number(req.params.codigo);

        await eliminarUsuario(codUsuario);

        return res.status(200).json({
            success: true,
            message: 'Usuario eliminado correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al eliminar el usuario.'
        );
    }
}