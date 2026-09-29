/*=============================================================================
  Nombre responsabilidad: Adaptar solicitudes HTTP de tipos de hilaza

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 24/Septiembre/2026

  Descripcion responsabilidad:
  Traduce req a llamadas de tipohilaza.service.js y entrega respuestas JSON.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import {
    consultarTiposHilaza,
    insertarTipoHilaza,
    actualizarTipoHilaza,
    eliminarTipoHilaza,
} from '../services/tipohilaza.service.js';

import { handleError } from '../utils/handleError.js';


/*
  Atiende la consulta del recurso y entrega los resultados al cliente.
*/
export async function consultar(req, res) {
    try {
        const { codigo, nombre } = req.query;

        const tiposHilaza = await consultarTiposHilaza({
            codTipoHilaza: codigo ? Number(codigo) : null,
            nomTipoHilaza: nombre || null
        });

        return res.status(200).json({
            success: true,
            data: tiposHilaza
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al consultar los tipos de hilaza.'
        );
    }
}


/*
  Atiende el registro de los datos recibidos y comunica el resultado.
*/
export async function crear(req, res) {
    try {
        await insertarTipoHilaza(req.body);

        return res.status(201).json({
            success: true,
            message: 'Tipo de hilaza creado correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al crear el tipo de hilaza.'
        );
    }
}


/*
  Atiende la actualización del registro indicado.
*/
export async function actualizar(req, res) {
    try {
        const codTipoHilaza = Number(req.params.codigo);

        await actualizarTipoHilaza(
            codTipoHilaza,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: 'Tipo de hilaza actualizado correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al actualizar el tipo de hilaza.'
        );
    }
}


/*
  Atiende la eliminación del registro indicado.
*/
export async function eliminar(req, res) {
    try {
        const codTipoHilaza = Number(req.params.codigo);

        await eliminarTipoHilaza(codTipoHilaza);

        return res.status(200).json({
            success: true,
            message: 'Tipo de hilaza eliminado correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al eliminar el tipo de hilaza.'
        );
    }
}