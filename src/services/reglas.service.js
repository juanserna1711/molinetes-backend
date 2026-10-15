/*=============================================================================
  Nombre responsabilidad: Acceso Oracle para reglas de permisos

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 08/Octubre/2026

  Descripcion responsabilidad:
  Ejecuta los procedimientos de PKG_REGLAS desde los controladores del recurso.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';

/*
  Invoca PKG_REGLAS.consultaReglas con código de regla, usuario y módulo
  opcionales. Envía null para filtros ausentes y devuelve las reglas desde el cursor abierto por Oracle.
*/
export async function consultarReglas({
    codRegla = null,
    codUsuario = null,
    codModulo = null
} = {}) {

    let connection;
    let result;

    try {
        connection = await getConnection();

        result = await connection.execute(
            `
            BEGIN
                PKG_REGLAS.consultaReglas(
                    :cod_regla,
                    :cod_usuario,
                    :cod_modulo,
                    :cursor
                );
            END;
            `,
            {
                cod_regla: codRegla,
                cod_usuario: codUsuario,
                cod_modulo: codModulo,

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
          Convierte las columnas del cursor a propiedades utilizadas por
          controladores y frontend para representar la matriz de permisos.
        */
        return rows.map(row => ({
            codigo: row[0],
            codigoUsuario: row[1],
            nombreUsuario: row[2],
            codigoModulo: row[3],
            nombreModulo: row[4],
            archivoModulo: row[5],
            zonaModulo: row[6],
            consulta: row[7],
            insercion: row[8],
            actualiza: row[9],
            elimina: row[10],
            reporte: row[11]
        }));

    } finally {
        /*
          Intenta cerrar la conexión adquirida tanto al completar como al fallar.
          Sin catch local, los errores se propagan al llamador.
        */
        if (connection) {
            await connection.close();
        }
    }
}

/*
  Invoca PKG_REGLAS.insertarRegla para asociar un usuario y un módulo con los permisos recibidos en data.
*/
export async function insertarRegla(data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_REGLAS.insertarRegla(
                    :cod_usuario,
                    :cod_modulo,
                    :consulta,
                    :insercion,
                    :actualiza,
                    :elimina,
                    :reporte
                );
            END;
            `,
            {
                cod_usuario: data.codUsuario,
                cod_modulo: data.codModulo,
                consulta: data.consulta,
                insercion: data.insercion,
                actualiza: data.actualiza,
                elimina: data.elimina,
                reporte: data.reporte
            }
        );

    } finally {
        /*
          Intenta cerrar la conexión adquirida tanto al completar como al fallar.
          Sin catch local, los errores se propagan al llamador.
        */
        if (connection) {
            await connection.close();
        }
    }
}

/*
  Invoca PKG_REGLAS.actualizarRegla con el código de la regla y los valores actuales de permisos recibidos en data.
*/
export async function actualizarRegla(codRegla, data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_REGLAS.actualizarRegla(
                    :cod_regla,
                    :consulta,
                    :insercion,
                    :actualiza,
                    :elimina,
                    :reporte
                );
            END;
            `,
            {
                cod_regla: codRegla,
                consulta: data.consulta,
                insercion: data.insercion,
                actualiza: data.actualiza,
                elimina: data.elimina,
                reporte: data.reporte
            }
        );

    } finally {
        /*
          Intenta cerrar la conexión adquirida tanto al completar como al fallar.
          Sin catch local, los errores se propagan al llamador.
        */
        if (connection) {
            await connection.close();
        }
    }
}

/*
  Invoca PKG_REGLAS.eliminarRegla con codRegla como único bind de entrada.
  Oracle determina si la regla puede eliminarse.
*/
export async function eliminarRegla(codRegla) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_REGLAS.eliminarRegla(:cod_regla);
            END;
            `,
            {
                cod_regla: codRegla
            }
        );

    } finally {
        /*
          Intenta cerrar la conexión adquirida tanto al completar como al fallar.
          Sin catch local, los errores se propagan al llamador.
        */
        if (connection) {
            await connection.close();
        }
    }
}