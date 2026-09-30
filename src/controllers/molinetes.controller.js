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
  Lee codigo y nombre de req.query y llama a consultarMolinetes.
  Convierte codigo con Number cuando es verdadero en la condición; en caso
  contrario envía null. Para nombre usa su valor o null.
  Responde HTTP 200 con { success: true, data: molinetes }.
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
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al consultar los molinetes.'
        );
    }
}

/*
  Entrega req.body completo a insertarMolinete, sin transformarlo aquí.
  Al completarse el servicio responde HTTP 201 con success y el mensaje
  de creación; no devuelve el registro creado.
*/
export async function crear(req, res) {
    try {
        await insertarMolinete(req.body);

        return res.status(201).json({
            success: true,
            message: 'Molinete creado correctamente.'
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al crear el molinete.'
        );
    }
}

/*
  Convierte req.params.codigo a número para identificar el molinete y
  llama a actualizarMolinete con ese código y req.body sin transformar.
  Responde HTTP 200 con success y el mensaje de actualización.
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
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al actualizar el molinete.'
        );
    }
}

/*
  Convierte req.params.codigo a número y lo pasa a eliminarMolinete.
  Tras completar el servicio responde HTTP 200 con success y el mensaje
  de eliminación; esta operación no utiliza req.body.
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
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al eliminar el molinete.'
        );
    }
}