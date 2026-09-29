/*=============================================================================
  Nombre responsabilidad: Adaptar solicitudes HTTP de cálculos TIGIMOLI

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Traduce las solicitudes de registro del cálculo TIGIMOLI a llamadas del
  servicio y entrega la respuesta correspondiente al cliente.

  Historial_modificaciones:

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha: 25/Septiembre/2026
  Descripcion:
  Se eliminan las consultas históricas de TIGIMOLI y se ajusta el registro
  para retornar el código de la Orden de Trabajo generada.
=============================================================================*/

import {
    registrarCalculoTigimoli
} from '../services/tigimoli.service.js';

import { handleError } from '../utils/handleError.js';

/*
  Atiende el registro del cálculo TIGIMOLI y comunica el código de la Orden de Trabajo generada.
*/
export async function crear(req, res) {

    try {

        const resultado = await registrarCalculoTigimoli(req.body);

        return res.status(201).json({
            success: true,
            message: 'Orden de trabajo generada correctamente.',
            codigoOrden: resultado.codigoOrden
        });

    } catch (error) {

        return handleError(
            error,
            res,
            'Error al registrar el cálculo TIGIMOLI.'
        );

    }

}