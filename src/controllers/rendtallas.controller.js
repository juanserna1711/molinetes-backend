/*=============================================================================
  Nombre responsabilidad: Adaptar solicitudes HTTP de rendimientos por talla

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Traduce req a llamadas de rendtallas.service.js y entrega respuestas JSON.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import {
    consultarRendTallas,
    insertarRendTalla,
    actualizarRendTalla,
    eliminarRendTalla
} from '../services/rendtallas.service.js';


import { handleError } from '../utils/handleError.js';


/*
  Atiende la consulta del recurso y entrega los resultados al cliente.
*/
export async function consultar(req, res) {
    try {
        const { codigo, nombre, estado } = req.query;

        const rendTallas = await consultarRendTallas({
            codTalla: codigo ? Number(codigo) : null,
            nomTalla: nombre || null,
            estaTalla: estado || null
        });

        return res.status(200).json({
            success: true,
            data: rendTallas
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al consultar las tallas con sus rendimientos.'
        );
    }
}

/*
  Atiende el registro de los datos recibidos y comunica el resultado.
*/
export async function crear(req, res) {
    try {
        await insertarRendTalla(req.body);

        return res.status(201).json({
            success: true,
            message: 'Rendimiento creado correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al crear el Rendimiento.'
        );
    }
}


/*
  Atiende la actualización del registro indicado.
*/
export async function actualizar(req, res) {
    try {
        const codTalla = Number(req.params.codigo);

        await actualizarRendTalla(codTalla, req.body);

        return res.status(200).json({
            success: true,
            message: 'Rendimiento actualizado correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al actualizar el Rendimiento.'
        );
    }
}

/*
  Atiende la eliminación del registro indicado.
*/
export async function eliminar(req, res) {
    try {
        const codTalla = Number(req.params.codigo);

        await eliminarRendTalla(codTalla);

        return res.status(200).json({
            success: true,
            message: 'Rendimiento eliminado correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al eliminar el Rendimiento.'
        );
    }
}