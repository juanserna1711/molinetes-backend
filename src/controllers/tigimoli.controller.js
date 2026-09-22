/*=============================================================================
  Nombre responsabilidad: Adaptar solicitudes HTTP de cálculos TIGIMOLI

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Traduce req a llamadas de tigimoli.service.js y entrega respuestas JSON.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import {
    consultarTigimoli,
    consultarDetalleTigimoli,
    registrarCalculoTigimoli,
} from '../services/tigimoli.service.js';

import { handleError } from '../utils/handleError.js';


/*
  Atiende la consulta del recurso y entrega los resultados al cliente.
*/
export async function consultar(req, res) {

    try {

        const {
            codigo,
            nombre,
            fecha,
            pagina,
            registrosPagina
        } = req.query;

        const tigimoli = await consultarTigimoli({
            codMoli: codigo ? Number(codigo) : null,
            nomMoli: nombre || null,
            fechaGeneracion: fecha || null,
            pagina: pagina ? Number(pagina) : 1,
            registrosPagina: registrosPagina
                ? Number(registrosPagina)
                : 10
        });

        return res.status(200).json({
            success: true,
            totalRegistros: tigimoli.totalRegistros,
            data: tigimoli.datos
        });

    } catch (error) {

        return handleError(
            error,
            res,
            'Error al consultar el historial TIGIMOLI.'
        );

    }
}


/*
  Atiende la consulta del detalle de un cálculo TIGIMOLI.
*/
export async function consultarDetalle(req, res) {

    try {

        const {
            codigo,
            fecha
        } = req.query;

        const detalle = await consultarDetalleTigimoli({
            codMoli: Number(codigo),
            fechaGeneracion: fecha
        });

        return res.status(200).json({
            success: true,
            data: detalle
        });

    } catch (error) {

        return handleError(
            error,
            res,
            'Error al consultar el detalle TIGIMOLI.'
        );

    }
}


/*
  Atiende el registro de los datos recibidos y comunica el resultado.
*/
export async function crear(req, res) {

    try {

        await registrarCalculoTigimoli(req.body);

        return res.status(201).json({
            success: true,
            message: 'Cálculo TIGIMOLI registrado correctamente.'
        });

    } catch (error) {

        return handleError(
            error,
            res,
            'Error al registrar el cálculo TIGIMOLI.'
        );

    }

}