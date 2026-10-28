/*=============================================================================
  Nombre responsabilidad: Acceso Oracle para atributos de orden de producción

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 27/Octubre/2026

  Descripcion responsabilidad:
  Ejecuta los procedimientos de PKG_ORPRATRI desde los controladores del recurso.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';

/*
  Invoca PKG_ORPRATRI.consultaOrpratri con el código de la orden de producción.
  Devuelve los atributos asociados a la orden con código, lotes y/o hojas de
  ruta y máquinas registrados.
*/
export async function consultarOrpratri(codOrden) {

    let connection;
    let result;

    try {
        connection = await getConnection();

        result = await connection.execute(
            `
            BEGIN
                PKG_ORPRATRI.consultaOrpratri(
                    :cod_orden,
                    :cursor
                );
            END;
            `,
            {
                cod_orden: codOrden,

                cursor: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.CURSOR
                }
            }
        );

        /*
          El bind OUT de tipo CURSOR entrega el result set abierto por Oracle.
          Se leen sus filas y se cierra antes de construir la respuesta.
        */
        const resultSet = result.outBinds.cursor;

        const rows = await resultSet.getRows();

        await resultSet.close();

        /*
          El cursor se mapea por posición: código de orden [0], lotes y/o hojas
          de ruta [1] y máquinas [2].
        */
        return rows.map(row => ({
            codigoOrden: row[0],
            lote: row[1],
            maquina: row[2]
        }));

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

/*
  Invoca PKG_ORPRATRI.insertarOrpratri con el código de la orden, los lotes
  y/o hojas de ruta y las máquinas recibidas en data como binds de entrada.
*/
export async function insertarOrpratri(data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_ORPRATRI.insertarOrpratri(
                    :cod_orden,
                    :lote,
                    :maquina
                );
            END;
            `,
            {
                cod_orden: data.codOrden,
                lote: data.lote,
                maquina: data.maquina
            }
        );

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