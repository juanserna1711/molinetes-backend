/*=============================================================================
  Nombre responsabilidad: Adaptar solicitudes HTTP de atributos de orden de producción

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 27/Octubre/2026

  Descripcion responsabilidad:
  Traduce req a llamadas de orpratri.service.js y entrega respuestas JSON.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import {
    consultarOrpratri,
    insertarOrpratri
} from '../services/orpratri.service.js';

import { handleError } from '../utils/handleError.js';

/*
  Lee codigo de req.params para consultarOrpratri.
  Convierte el código de la orden a número y devuelve HTTP 200 con success
  y los atributos asociados a la orden en data.
*/
export async function consultar(req, res) {
    try {
        const codOrden = Number(req.params.codigo);

        const atributos = await consultarOrpratri(codOrden);

        return res.status(200).json({
            success: true,
            data: atributos
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al consultar los atributos de la orden de producción.'
        );
    }
}

/*
  Entrega req.body completo a insertarOrpratri, sin transformar sus campos.
  Responde HTTP 201 con success y el mensaje de creación al terminar.
*/
export async function crear(req, res) {
    try {
        await insertarOrpratri(req.body);

        return res.status(201).json({
            success: true,
            message: 'Atributos de la orden registrados correctamente.'
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al registrar los atributos de la orden de producción.'
        );
    }
}