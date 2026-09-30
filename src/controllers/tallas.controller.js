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
  Lee codigo, nombre y estado de req.query para consultarTallas.
  Convierte codigo con Number si su condición es verdadera; de otro modo
  usa null. Nombre y estado se pasan con su valor o null.
  Responde HTTP 200 con success y las tallas del servicio en data.
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
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al consultar las tallas.'
        );
    }
}

/*
  Pasa req.body sin transformar a insertarTalla. Cuando termina el servicio,
  responde HTTP 201 con success y el mensaje de creación de la talla.
*/
export async function crear(req, res) {
    try {
        await insertarTalla(req.body);

        return res.status(201).json({
            success: true,
            message: 'Talla creada correctamente.'
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al crear la talla.'
        );
    }
}

/*
  Convierte req.params.codigo a número y lo envía con req.body a
  actualizarTalla. Responde HTTP 200 con success y el mensaje de actualización.
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
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al actualizar la talla.'
        );
    }
}

/*
  Convierte req.params.codigo a número y llama a activarTalla para solicitar
  el cambio de estado. Responde HTTP 200 con success y el mensaje de activación.
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
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al activar la talla.'
        );
    }
}

/*
  Convierte req.params.codigo a número y llama a desactivarTalla para solicitar
  el cambio de estado. Responde HTTP 200 con success y el mensaje de desactivación.
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
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al desactivar la talla.'
        );
    }
}

/*
  Convierte req.params.codigo a número y llama a eliminarTalla para solicitar
  el borrado. Responde HTTP 200 con success y el mensaje de eliminación.
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
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al eliminar la talla.'
        );
    }
}