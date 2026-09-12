import {
    consultarRendTallas,
    insertarRendTalla,
    actualizarRendTalla,
    eliminarRendTalla
} from '../services/rendtallas.service.js';


import { handleError } from '../utils/handleError.js';


export async function consultar(req, res) {
    try {
        const { codigo, nombre, estado } = req.query;

        const rendTallas = await consultarRendTallas({
            codRendTalla: codigo ? Number(codigo) : null,
            nomRendTalla: nombre || null,
            estaRendTalla: estado || null
        });

        return res.status(200).json({
            success: true,
            data: rendTallas
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
        await insertarRendTalla(req.body);

        return res.status(201).json({
            success: true,
            message: 'Rendimiento x Talla creado correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al crear el rendimiento x talla.'
        );
    }
}


export async function actualizar(req, res) {
    try {
        const codRendTalla = Number(req.params.codigo);

        await actualizarRendTalla(codRendTalla, req.body);

        return res.status(200).json({
            success: true,
            message: 'Rendimiento x Talla actualizado correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al actualizar el rendimiento x talla.'
        );
    }
}

export async function eliminar(req, res) {
    try {
        const codRendTalla = Number(req.params.codigo);

        await eliminarRendTalla(codRendTalla);

        return res.status(200).json({
            success: true,
            message: 'Rendimiento x Talla eliminado correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al eliminar el rendimiento x talla.'
        );
    }
}