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
  Registra un nuevo cálculo TIGIMOLI y genera la respectiva Orden de Trabajo.
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

                cod_tipo_hilaza: data.codTipoHilaza,

                usuario: data.usuario,

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

        if (connection) {
            await connection.close();
        }

    }

}