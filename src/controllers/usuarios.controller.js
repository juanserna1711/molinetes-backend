/*=============================================================================
  Nombre responsabilidad: Adaptar solicitudes HTTP de usuarios

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Traduce req a llamadas de usuarios.service.js y entrega respuestas JSON.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import {
    consultarUsuarios,
    insertarUsuario,
    actualizarUsuario,
    activarUsuario,
    desactivarUsuario,
    eliminarUsuario
} from '../services/usuarios.service.js';

import { handleError } from '../utils/handleError.js';

/*
  Lee codigo, nombre y estado de req.query para consultarUsuarios.
  Convierte codigo con Number si su condición es verdadera; de otro modo
  usa null. Nombre y estado se envían con su valor o null.
  Devuelve HTTP 200 con success y los usuarios en data sin filtrar sus campos.
*/
export async function consultar(req, res) {
    try {
        const { codigo, nombre, estado } = req.query;

        const usuarios = await consultarUsuarios({
            codUsuario: codigo ? Number(codigo) : null,
            nomUsuario: nombre || null,
            estaUsuario: estado || null
        });

        return res.status(200).json({
            success: true,
            data: usuarios
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al consultar los usuarios.'
        );
    }
}

/*
  Entrega req.body completo a insertarUsuario, sin transformar sus campos.
  Responde HTTP 201 con success y el mensaje de creación al terminar.
*/
export async function crear(req, res) {
    try {
        await insertarUsuario(req.body);

        return res.status(201).json({
            success: true,
            message: 'Usuario creado correctamente.'
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al crear el usuario.'
        );
    }
}

/*
  Convierte req.params.codigo a número y llama a actualizarUsuario con
  ese identificador y req.body. Responde HTTP 200 con success y el mensaje
  de actualización, sin devolver el usuario modificado.
*/
export async function actualizar(req, res) {
    try {
        const codUsuario = Number(req.params.codigo);

        await actualizarUsuario(codUsuario, req.body);

        return res.status(200).json({
            success: true,
            message: 'Usuario actualizado correctamente.'
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al actualizar el usuario.'
        );
    }
}

/*
  Convierte req.params.codigo a número y llama a activarUsuario para solicitar
  el cambio de estado. Devuelve HTTP 200 con success y el mensaje de activación.
*/
export async function activar(req, res) {
    try {
        const codUsuario = Number(req.params.codigo);

        await activarUsuario(codUsuario);

        return res.status(200).json({
            success: true,
            message: 'Usuario activado correctamente.'
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al activar el usuario.'
        );
    }
}

/*
  Convierte req.params.codigo a número y llama a desactivarUsuario para
  solicitar el cambio de estado. Responde HTTP 200 con success y el mensaje
  de desactivación; no llama al servicio de eliminación.
*/
export async function desactivar(req, res) {
    try {
        const codUsuario = Number(req.params.codigo);

        await desactivarUsuario(codUsuario);

        return res.status(200).json({
            success: true,
            message: 'Usuario desactivado correctamente.'
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al desactivar el usuario.'
        );
    }
}

/*
  Convierte req.params.codigo a número y lo entrega a eliminarUsuario.
  Al completarse responde HTTP 200 con success y el mensaje de eliminación.
*/
export async function eliminar(req, res) {
    try {
        const codUsuario = Number(req.params.codigo);

        await eliminarUsuario(codUsuario);

        return res.status(200).json({
            success: true,
            message: 'Usuario eliminado correctamente.'
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al eliminar el usuario.'
        );
    }
}