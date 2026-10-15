/*=============================================================================
  Nombre responsabilidad: Adaptar solicitudes HTTP de módulos

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 08/Octubre/2026

  Descripcion responsabilidad:
  Traduce req a llamadas de modulos.service.js y entrega respuestas JSON.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import {
    consultarModulos,
    insertarModulo,
    actualizarModulo,
    eliminarModulo,
} from '../services/modulos.service.js';

import { handleError } from '../utils/handleError.js';

/*
  Lee codigo, nombre y zona de req.query para consultarModulos.
  Convierte codigo con Number si su condición es verdadera; de otro modo
  usa null. Nombre y zona se pasan con su valor o null.
  Responde HTTP 200 con success y los módulos del servicio en data.
*/
export async function consultar(req, res) {
    try {
        const { codigo, nombre, zona } = req.query;

        const modulos = await consultarModulos({
            codModulo: codigo ? Number(codigo) : null,
            nomModulo: nombre || null,
            zonaModulo: zona || null
        });

        return res.status(200).json({
            success: true,
            data: modulos
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al consultar los módulos.'
        );
    }
}

/*
  Pasa req.body sin transformar a insertarModulo. Cuando termina el servicio,
  responde HTTP 201 con success y el mensaje de creación del módulo.
*/
export async function crear(req, res) {
    try {
        await insertarModulo(req.body);

        return res.status(201).json({
            success: true,
            message: 'Módulo creado correctamente.'
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al crear el módulo.'
        );
    }
}

/*
  Convierte req.params.codigo a número y lo envía con req.body a
  actualizarModulo. Responde HTTP 200 con success y el mensaje de actualización.
*/
export async function actualizar(req, res) {
    try {
        const codModulo = Number(req.params.codigo);

        await actualizarModulo(codModulo, req.body);

        return res.status(200).json({
            success: true,
            message: 'Módulo actualizado correctamente.'
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al actualizar el módulo.'
        );
    }
}

/*
  Convierte req.params.codigo a número y llama a eliminarModulo para solicitar
  el borrado. Responde HTTP 200 con success y el mensaje de eliminación.
*/
export async function eliminar(req, res) {
    try {
        const codModulo = Number(req.params.codigo);

        await eliminarModulo(codModulo);

        return res.status(200).json({
            success: true,
            message: 'Módulo eliminado correctamente.'
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al eliminar el módulo.'
        );
    }
}