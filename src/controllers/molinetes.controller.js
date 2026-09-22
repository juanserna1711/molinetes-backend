/*=============================================================================
  Nombre responsabilidad: Adaptar solicitudes HTTP de molinetes

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Traduce req a llamadas de molinetes.service.js y entrega respuestas JSON.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import {
    consultarMolinetes,
    insertarMolinete,
    actualizarMolinete,
    eliminarMolinete
} from '../services/molinetes.service.js';

import { handleError } from '../utils/handleError.js';


/*
  Atiende la consulta del recurso y entrega los resultados al cliente.
*/
export async function consultar(req, res) {
    try {
        const { codigo, nombre } = req.query;

        const molinetes = await consultarMolinetes({
            codMolinete: codigo ? Number(codigo) : null,
            nomMolinete: nombre || null
        });

        return res.status(200).json({
            success: true,
            data: molinetes
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al consultar los molinetes.'
        );
    }
}

/*
  Atiende el registro de los datos recibidos y comunica el resultado.
*/
export async function crear(req, res) {
    try {
        await insertarMolinete(req.body);

        return res.status(201).json({
            success: true,
            message: 'Molinete creado correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al crear el molinete.'
        );
    }
}


/*
  Atiende la actualización del registro indicado.
*/
export async function actualizar(req, res) {
    try {
        const codMolinete = Number(req.params.codigo);

        await actualizarMolinete(codMolinete, req.body);

        return res.status(200).json({
            success: true,
            message: 'Molinete actualizado correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al actualizar el molinete.'
        );
    }
}

/*
  Atiende la eliminación del registro indicado.
*/
export async function eliminar(req, res) {
    try {
        const codMolinete = Number(req.params.codigo);

        await eliminarMolinete(codMolinete);

        return res.status(200).json({
            success: true,
            message: 'Molinete eliminado correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al eliminar el molinete.'
        );
    }
}