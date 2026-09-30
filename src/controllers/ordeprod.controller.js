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
  Lee filtros y paginación de req.query y los entrega a consultarOrdeProd.
  Responde HTTP 200 con success, totalRegistros y data, tomando el total
  y el arreglo datos del resultado del servicio.
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

        /*
          Convierte orden, tipoHilaza y paginación con Number cuando la condición
          del valor recibido es verdadera. En los demás casos usa null para
          códigos, página 1 y tamaño 10. Las fechas se pasan sin convertir o null.
        */
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
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */

        return handleError(
            error,
            res,
            'Error al consultar las órdenes de trabajo.'
        );

    }

}

/*
  Lee codigo de req.params, lo convierte con Number y llama a
  consultarDetalleOrdeProd. Devuelve HTTP 200 con success y el detalle
  del servicio en data, sin transformar sus elementos.
*/
export async function consultarDetalle(req, res) {

    try {

        const { codigo } = req.params;

        const detalle = await consultarDetalleOrdeProd(Number(codigo));

        return res.status(200).json({
            success: true,
            data: detalle
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */

        return handleError(
            error,
            res,
            'Error al consultar el detalle de la Orden de Trabajo.'
        );

    }

}