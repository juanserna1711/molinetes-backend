/*=============================================================================
  Nombre responsabilidad: Adaptar solicitudes HTTP de órdenes de trabajo ORDEPROD

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 25/Septiembre/2026

  Descripcion responsabilidad:
  Traduce las solicitudes de consulta de órdenes de trabajo a llamadas de
  ordeprod.service.js y entrega las respuestas correspondientes al cliente.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import {
    consultarOrdeProd,
    consultarDetalleOrdeProd
} from '../services/ordeprod.service.js';

import { handleError } from '../utils/handleError.js';

/*
  Atiende la consulta del historial de órdenes de trabajo aplicando los filtros y paginación recibidos.
*/
export async function consultar(req, res) {

    try {

        const {
            orden,
            tipoHilaza,
            fechaInicio,
            fechaFin,
            pagina,
            registrosPagina
        } = req.query;

        const ordeprod = await consultarOrdeProd({
            codOrden: orden
                ? Number(orden)
                : null,

            codTipoHilaza: tipoHilaza
                ? Number(tipoHilaza)
                : null,

            fechaInicio: fechaInicio || null,

            fechaFin: fechaFin || null,

            pagina: pagina
                ? Number(pagina)
                : 1,

            registrosPagina: registrosPagina
                ? Number(registrosPagina)
                : 10
        });

        return res.status(200).json({
            success: true,
            totalRegistros: ordeprod.totalRegistros,
            data: ordeprod.datos
        });

    } catch (error) {

        return handleError(
            error,
            res,
            'Error al consultar las órdenes de trabajo.'
        );

    }

}


/*
  Atiende la consulta del detalle de una Orden de Trabajo.
*/
export async function consultarDetalle(req, res) {

    try {

        const {
            codigo
        } = req.params;

        const detalle = await consultarDetalleOrdeProd(
            Number(codigo)
        );

        return res.status(200).json({
            success: true,
            data: detalle
        });

    } catch (error) {

        return handleError(
            error,
            res,
            'Error al consultar el detalle de la Orden de Trabajo.'
        );

    }

}