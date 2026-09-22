/*=============================================================================
  Nombre responsabilidad: Adaptar solicitudes HTTP de tallas

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Traduce req a llamadas de tallas.service.js y entrega respuestas JSON.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import {
    consultarTallas,
    insertarTalla,
    actualizarTalla,
    activarTalla,
    desactivarTalla,
    eliminarTalla,
} from '../services/tallas.service.js';

import { handleError } from '../utils/handleError.js';


/*
  Atiende la consulta del recurso y entrega los resultados al cliente.
*/
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

/*
  Atiende el registro de los datos recibidos y comunica el resultado.
*/
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


/*
  Atiende la actualización del registro indicado.
*/
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

/*
  Atiende la activación del registro indicado.
*/
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


/*
  Atiende la desactivación del registro indicado.
*/
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

/*
  Atiende la eliminación del registro indicado.
*/
export async function eliminar(req, res) {
    try {
        const codTalla = Number(req.params.codigo);

        await eliminarTalla(codTalla);

        return res.status(200).json({
            success: true,
            message: 'Talla eliminada correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al eliminar la talla.'
        );
    }
}