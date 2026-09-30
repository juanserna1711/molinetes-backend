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
  Lee codigo, nombre y estado de req.query para consultarRendTallas.
  Nombre se envía con su valor o null.
  Devuelve HTTP 200 con success y el resultado del servicio en data.
*/
export async function consultar(req, res) {
    try {
        const { nombre} = req.query;

        const rendTallas = await consultarRendTallas({
            nomTalla: nombre || null
        });

        return res.status(200).json({
            success: true,
            data: rendTallas
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al consultar las tallas con sus rendimientos.'
        );
    }
}

/*
  Pasa req.body completo a insertarRendTalla para registrar el rendimiento.
  Sin transformar sus campos aquí, responde HTTP 201 con success y el
  mensaje de creación cuando termina el servicio.
*/
export async function crear(req, res) {
    try {
        await insertarRendTalla(req.body);

        return res.status(201).json({
            success: true,
            message: 'Rendimiento creado correctamente.'
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al crear el Rendimiento.'
        );
    }
}

/*
  Convierte req.params.codigo a número para identificar la talla y llama
  a actualizarRendTalla con ese código y req.body. Devuelve HTTP 200 con
  success y el mensaje de actualización, sin devolver medidas calculadas.
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
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al actualizar el Rendimiento.'
        );
    }
}

/*
  Convierte req.params.codigo a número y solicita a eliminarRendTalla
  la eliminación del rendimiento asociado. Responde HTTP 200 con success
  y el mensaje de eliminación cuando el servicio se completa.
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
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al eliminar el Rendimiento.'
        );
    }
}