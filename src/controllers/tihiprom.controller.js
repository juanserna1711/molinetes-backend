/*=============================================================================
  Nombre responsabilidad: Adaptar solicitudes HTTP de promedios por tipo de hilaza

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 24/Septiembre/2026

  Descripcion responsabilidad:
  Traduce req a llamadas de tihiprom.service.js y entrega respuestas JSON.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import {
    consultarTiHiProm,
    insertarTiHiProm,
    actualizarTiHiProm,
    eliminarTiHiProm,
    aplicarTipoHilaza
} from '../services/tihiprom.service.js';

import { handleError } from '../utils/handleError.js';

/*
  Lee tipoHilaza y talla de req.query y los adapta a codTipoHilaza y
  codTalla para consultarTiHiProm. Cada valor se convierte con Number si
  su condición es verdadera; de otro modo se envía null.
  Devuelve HTTP 200 con success y el resultado del servicio en data.
*/
export async function consultar(req, res) {
    try {
        const { tipoHilaza, talla } = req.query;

        const tiHiProm = await consultarTiHiProm({
            codTipoHilaza: tipoHilaza
                ? Number(tipoHilaza)
                : null,
            codTalla: talla
                ? Number(talla)
                : null
        });

        return res.status(200).json({
            success: true,
            data: tiHiProm
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al consultar los promedios por tipo de hilaza.'
        );
    }
}

/*
  Pasa req.body completo a insertarTiHiProm, sin convertir sus campos aquí.
  Responde HTTP 201 con success y el mensaje de creación al terminar.
*/
export async function crear(req, res) {
    try {
        await insertarTiHiProm(req.body);

        return res.status(201).json({
            success: true,
            message: 'Promedio por tipo de hilaza creado correctamente.'
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al crear el promedio por tipo de hilaza.'
        );
    }
}

/*
  Convierte tipoHilaza y talla de req.params a números para identificar
  la combinación. Los entrega a actualizarTiHiProm junto con req.body.
  Devuelve HTTP 200 con success y el mensaje de actualización.
*/
export async function actualizar(req, res) {
    try {
        const codTipoHilaza = Number(req.params.tipoHilaza);

        const codTalla = Number(req.params.talla);

        await actualizarTiHiProm(codTipoHilaza, codTalla, req.body);

        return res.status(200).json({
            success: true,
            message: 'Promedio por tipo de hilaza actualizado correctamente.'
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al actualizar el promedio por tipo de hilaza.'
        );
    }
}

/*
  Convierte tipoHilaza y talla de req.params a números y los pasa, en ese
  orden, a eliminarTiHiProm. Devuelve HTTP 200 con success y el mensaje
  de eliminación de la información asociada a esa combinación.
*/
export async function eliminar(req, res) {
    try {
        const codTipoHilaza = Number(req.params.tipoHilaza);

        const codTalla = Number(req.params.talla);

        await eliminarTiHiProm(codTipoHilaza, codTalla);

        return res.status(200).json({
            success: true,
            message: 'Promedio por tipo de hilaza eliminado correctamente.'
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al eliminar el promedio por tipo de hilaza.'
        );
    }
}

/*
  Convierte req.params.tipoHilaza a número y extrae usuarioRendtall de
  req.body sin convertirlo. Llama a aplicarTipoHilaza con ambos valores
  y responde HTTP 200 con success y el mensaje de aplicación a RENDTALL.
*/
export async function aplicar(req, res) {
    try {
        const codTipoHilaza = Number(req.params.tipoHilaza);

        const { usuarioRendtall } = req.body;

        await aplicarTipoHilaza(codTipoHilaza, usuarioRendtall);

        return res.status(200).json({
            success: true,
            message: 'Tipo de hilaza aplicado correctamente al rendimiento por talla.'
        });

    } catch (error) {
        /*
          Delega el error, res y el mensaje de esta operación a handleError;
          ese manejador determina la respuesta de error que recibe el cliente.
        */
        return handleError(
            error,
            res,
            'Error al aplicar el tipo de hilaza al rendimiento por talla.'
        );
    }
}