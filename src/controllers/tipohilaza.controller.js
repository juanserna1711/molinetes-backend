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
  Lee codigo y nombre de req.query para consultarTiposHilaza.
  Convierte codigo con Number cuando su condición es verdadera; de otro
  modo usa null. Para nombre envía su valor o null.
  Responde HTTP 200 con success y los tipos de hilaza en data.
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
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al consultar los tipos de hilaza.'
        );
    }
}

/*
  Entrega req.body completo a insertarTipoHilaza sin transformar sus campos.
  Al completarse responde HTTP 201 con success y el mensaje de creación.
*/
export async function crear(req, res) {
    try {
        await insertarTipoHilaza(req.body);

        return res.status(201).json({
            success: true,
            message: 'Tipo de hilaza creado correctamente.'
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al crear el tipo de hilaza.'
        );
    }
}

/*
  Convierte req.params.codigo a número y lo entrega junto con req.body
  a actualizarTipoHilaza. Responde HTTP 200 con success y el mensaje
  de actualización, sin devolver el registro modificado.
*/
export async function actualizar(req, res) {
    try {
        const codTipoHilaza = Number(req.params.codigo);

        await actualizarTipoHilaza(codTipoHilaza, req.body);

        return res.status(200).json({
            success: true,
            message: 'Tipo de hilaza actualizado correctamente.'
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al actualizar el tipo de hilaza.'
        );
    }
}

/*
  Convierte req.params.codigo a número y lo pasa a eliminarTipoHilaza.
  Devuelve HTTP 200 con success y el mensaje de eliminación al completarse.
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
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al eliminar el tipo de hilaza.'
        );
    }
}