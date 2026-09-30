/*=============================================================================
  Nombre responsabilidad: Acceso Oracle para cálculos TIGIMOLI

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Ejecuta el procedimiento de registro de PKG_TIGIMOLI para almacenar
  el cálculo técnico y generar la respectiva Orden de Trabajo.

  Historial_modificaciones:

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha: 25/Septiembre/2026
  Descripcion:
  Se elimina la consulta histórica de TIGIMOLI y se ajusta el registro
  para recibir RPM, tipo de hilaza y retornar el código de la Orden
  de Trabajo generada.
=============================================================================*/

import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';

/*
  Invoca PKG_TIGIMOLI.registrarCalculoTigimoli para registrar el cálculo
  y generar su orden. Envía las listas de data sin reordenarlas ni convertir
  sus elementos y devuelve { codigoOrden } desde el parámetro OUT de Oracle.
*/
export async function registrarCalculoTigimoli(data) {

    let connection;
    let result;

    try {

        connection = await getConnection();

        result = await connection.execute(
            `
            BEGIN
                PKG_TIGIMOLI.registrarCalculoTigimoli(
                    :codigos_molinetes,
                    :codigos_tallas,
                    :cantidades_rollos,
                    :rpms_molinetes,
                    :cod_tipo_hilaza,
                    :usuario,
                    :codigo_orden
                );
            END;
            `,
            {
                /*
                  Las cuatro listas se envían como binds NUMBER IN. Los valores
                  en una misma posición describen molinete, talla, cantidad de
                  rollos y RPM de un detalle; el servicio conserva esa relación.
                */
                codigos_molinetes: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: data.codigosMolinetes
                },

                codigos_tallas: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: data.codigosTallas
                },

                cantidades_rollos: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: data.cantidadesRollos
                },

                rpms_molinetes: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: data.rpmsMolinetes
                },

                /*
                  Hilaza y usuario son entradas comunes a todos los detalles.
                */
                cod_tipo_hilaza: data.codTipoHilaza,

                usuario: data.usuario,

                /*
                  NUMBER OUT recibe el consecutivo generado por el procedimiento;
                  se devuelve como codigoOrden, sin calcularlo en JavaScript.
                */
                codigo_orden: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_OUT
                }
            }
        );

        return {
            codigoOrden: result.outBinds.codigo_orden
        };

    } finally {
        /*
          Intenta cerrar la conexión adquirida tanto al completar como al fallar.
          Sin catch local, los errores se propagan; un error del propio cierre
          también puede propagarse al llamador.
        */

        if (connection) {
            await connection.close();
        }

    }

}