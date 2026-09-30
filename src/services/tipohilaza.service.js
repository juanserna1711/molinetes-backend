/*=============================================================================
  Nombre responsabilidad: Acceso Oracle para tipos de hilaza

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 24/Septiembre/2026

  Descripcion responsabilidad:
  Ejecuta los procedimientos de PKG_TIPOHILA desde los controladores del recurso.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';

/*
  Invoca PKG_TIPOHILA.consultaTipoHilaza con código y nombre opcionales.
  Los filtros ausentes se envían como null; devuelve objetos de hilaza
  construidos a partir del cursor OUT.
*/
export async function consultarTiposHilaza({
    codTipoHilaza = null,
    nomTipoHilaza = null
} = {}) {

    let connection;
    let result;

    try {
        connection = await getConnection();

        result = await connection.execute(
            `
            BEGIN
                PKG_TIPOHILA.consultaTipoHilaza(
                    :cod_tipo_hilaza,
                    :nom_tipo_hilaza,
                    :cursor
                );
            END;
            `,
            {
                cod_tipo_hilaza: codTipoHilaza,
                nom_tipo_hilaza: nomTipoHilaza,

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
          El cursor entrega código en la posición 0 y nombre en la 1.
          El map adapta esas columnas a la estructura consumida por el controlador.
        */
        return rows.map(row => ({
            codigo: row[0],
            nombre: row[1]
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
  Invoca PKG_TIPOHILA.insertarTipoHilaza con codTipoHilaza y nomTipoHilaza
  de data como binds de entrada, conservando los valores recibidos.
*/
export async function insertarTipoHilaza(data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_TIPOHILA.insertarTipoHilaza(
                    :cod_tipo_hilaza,
                    :nom_tipo_hilaza
                );
            END;
            `,
            {
                cod_tipo_hilaza: data.codTipoHilaza,
                nom_tipo_hilaza: data.nomTipoHilaza
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

/*
  Invoca PKG_TIPOHILA.actualizarTipoHilaza usando codTipoHilaza como
  identificador y data.nomTipoHilaza como nombre enviado a Oracle.
*/
export async function actualizarTipoHilaza(codTipoHilaza, data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_TIPOHILA.actualizarTipoHilaza(
                    :cod_tipo_hilaza,
                    :nom_tipo_hilaza
                );
            END;
            `,
            {
                cod_tipo_hilaza: codTipoHilaza,
                nom_tipo_hilaza: data.nomTipoHilaza
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

/*
  Invoca PKG_TIPOHILA.eliminarTipoHilaza con el código como única entrada.
  Las validaciones de la eliminación se delegan al procedimiento Oracle.
*/
export async function eliminarTipoHilaza(codTipoHilaza) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_TIPOHILA.eliminarTipoHilaza(
                    :cod_tipo_hilaza
                );
            END;
            `,
            {
                cod_tipo_hilaza: codTipoHilaza
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