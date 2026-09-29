/*=============================================================================
  Nombre responsabilidad: Adaptar solicitudes HTTP de promedios por tipo de hilaza

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 24/Septiembre/2026

  Descripcion responsabilidad:
  Traduce req a llamadas de tihiprom.service.js y entrega respuestas JSON.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import {
    consultarTiHiProm,
    insertarTiHiProm,
    actualizarTiHiProm,
    eliminarTiHiProm,
    aplicarTipoHilaza
} from '../services/tihiprom.service.js';


import { handleError } from '../utils/handleError.js';


/*
  Atiende la consulta del recurso y entrega los resultados al cliente.
*/
export async function consultar(req, res) {
    try {
        const { tipoHilaza, talla } = req.query;

        const tiHiProm = await consultarTiHiProm({
            codTipoHilaza: tipoHilaza
                ? Number(tipoHilaza)
                : null,
            codTalla: talla
                ? Number(talla)
                : null
        });

        return res.status(200).json({
            success: true,
            data: tiHiProm
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al consultar los promedios por tipo de hilaza.'
        );
    }
}


/*
  Atiende el registro de los datos recibidos y comunica el resultado.
*/
export async function crear(req, res) {
    try {
        await insertarTiHiProm(req.body);

        return res.status(201).json({
            success: true,
            message: 'Promedio por tipo de hilaza creado correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al crear el promedio por tipo de hilaza.'
        );
    }
}


/*
  Atiende la actualización del registro indicado.
*/
export async function actualizar(req, res) {
    try {
        const codTipoHilaza =
            Number(req.params.tipoHilaza);

        const codTalla =
            Number(req.params.talla);

        await actualizarTiHiProm(
            codTipoHilaza,
            codTalla,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: 'Promedio por tipo de hilaza actualizado correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al actualizar el promedio por tipo de hilaza.'
        );
    }
}


/*
  Atiende la eliminación del registro indicado.
*/
export async function eliminar(req, res) {
    try {
        const codTipoHilaza =
            Number(req.params.tipoHilaza);

        const codTalla =
            Number(req.params.talla);

        await eliminarTiHiProm(
            codTipoHilaza,
            codTalla
        );

        return res.status(200).json({
            success: true,
            message: 'Promedio por tipo de hilaza eliminado correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al eliminar el promedio por tipo de hilaza.'
        );
    }
}


/*
  Aplica en RENDTALL la parametrización del tipo de hilaza indicado.
*/
export async function aplicar(req, res) {
    try {
        const codTipoHilaza =
            Number(req.params.tipoHilaza);

        const { usuarioRendtall } = req.body;

        await aplicarTipoHilaza(
            codTipoHilaza,
            usuarioRendtall
        );

        return res.status(200).json({
            success: true,
            message: 'Tipo de hilaza aplicado correctamente al rendimiento por talla.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al aplicar el tipo de hilaza al rendimiento por talla.'
        );
    }
}