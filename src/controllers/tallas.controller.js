import {
    consultarTallas,
    insertarTalla,
    actualizarTalla,
    activarTalla,
    desactivarTalla
} from '../services/tallas.service.js';

import { handleError } from '../utils/handleError.js';


export async function consultar(req, res) {
    try {
        const { codigo, nombre, estado } = req.query;

        const tallas = await consultarTallas({
            codTalla: codigo ? Number(codigo) : null,
            nomTalla: nombre || null,
            estaTalla: estado || null
        });

        return res.status(200).json({
            success: true,
            data: tallas
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al consultar las tallas.'
        );
    }
}

export async function crear(req, res) {
    try {
        await insertarTalla(req.body);

        return res.status(201).json({
            success: true,
            message: 'Talla creada correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al crear la talla.'
        );
    }
}


export async function actualizar(req, res) {
    try {
        const codTalla = Number(req.params.codigo);

        await actualizarTalla(codTalla, req.body);

        return res.status(200).json({
            success: true,
            message: 'Talla actualizada correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al actualizar la talla.'
        );
    }
}

export async function activar(req, res) {
    try {
        const codTalla = Number(req.params.codigo);

        await activarTalla(codTalla);

        return res.status(200).json({
            success: true,
            message: 'Talla activada correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al activar la talla.'
        );
    }
}


export async function desactivar(req, res) {
    try {
        const codTalla = Number(req.params.codigo);

        await desactivarTalla(codTalla);

        return res.status(200).json({
            success: true,
            message: 'Talla desactivada correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al desactivar la talla.'
        );
    }
}