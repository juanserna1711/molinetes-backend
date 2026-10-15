/*=============================================================================
  Nombre responsabilidad: Adaptar solicitudes HTTP de reglas

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 08/Octubre/2026

  Descripcion responsabilidad:
  Traduce req a llamadas de reglas.service.js y entrega respuestas JSON.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import {
    consultarReglas,
    insertarRegla,
    actualizarRegla,
    eliminarRegla,
} from '../services/reglas.service.js';

import { handleError } from '../utils/handleError.js';

/*
  Manda el código del usuario autenticado desde req.user.codigo
  para consultar sus reglas.
  Responde HTTP 200 con success y las reglas del usuario en data.
*/
export async function consultarMisPermisos(req, res) {

    try {

        const reglas = await consultarReglas({
            codUsuario: req.user.codigo
        });

        return res.status(200).json({
            success: true,
            data: reglas
        });

    } catch (error) {

        return handleError(
            error,
            res,
            'Error al consultar los permisos del usuario.'
        );
    }
}

/*
  Lee codigo, usuario y modulo de req.query para consultarReglas.
  Convierte los filtros numéricos con Number si su condición es verdadera;
  de otro modo usa null. Responde HTTP 200 con success y las reglas en data.
*/
export async function consultar(req, res) {
    try {
        const { codigo, usuario, modulo } = req.query;

        const reglas = await consultarReglas({
            codRegla: codigo ? Number(codigo) : null,
            codUsuario: usuario ? Number(usuario) : null,
            codModulo: modulo ? Number(modulo) : null
        });

        return res.status(200).json({
            success: true,
            data: reglas
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al consultar las reglas.'
        );
    }
}

/*
  Pasa req.body sin transformar a insertarRegla. Cuando termina el servicio,
  responde HTTP 201 con success y el mensaje de creación de la regla.
*/
export async function crear(req, res) {
    try {
        await insertarRegla(req.body);

        return res.status(201).json({
            success: true,
            message: 'Regla creada correctamente.'
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al crear la regla.'
        );
    }
}

/*
  Convierte req.params.codigo a número y lo envía con req.body a
  actualizarRegla. Responde HTTP 200 con success y el mensaje de actualización.
*/
export async function actualizar(req, res) {
    try {
        const codRegla = Number(req.params.codigo);

        await actualizarRegla(codRegla, req.body);

        return res.status(200).json({
            success: true,
            message: 'Regla actualizada correctamente.'
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al actualizar la regla.'
        );
    }
}

/*
  Convierte req.params.codigo a número y llama a eliminarRegla para solicitar
  el borrado. Responde HTTP 200 con success y el mensaje de eliminación.
*/
export async function eliminar(req, res) {
    try {
        const codRegla = Number(req.params.codigo);

        await eliminarRegla(codRegla);

        return res.status(200).json({
            success: true,
            message: 'Regla eliminada correctamente.'
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al eliminar la regla.'
        );
    }
}