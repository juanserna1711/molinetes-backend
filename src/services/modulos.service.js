/*=============================================================================
  Nombre responsabilidad: Acceso Oracle para módulos

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 08/Octubre/2026

  Descripcion responsabilidad:
  Ejecuta los procedimientos de PKG_MODULO desde los controladores del recurso.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';

/*
  Invoca PKG_MODULO.consultaModulo con código, nombre y zona opcionales.
  Envía null para filtros ausentes y devuelve objetos de módulo desde el cursor.
*/
export async function consultarModulos({
    codModulo = null,
    nomModulo = null,
    zonaModulo = null
} = {}) {

    let connection;
    let result;

    try {
        connection = await getConnection();

        result = await connection.execute(
            `
            BEGIN
                PKG_MODULO.consultaModulo(
                    :cod_modulo,
                    :nom_modulo,
                    :zona_modulo,
                    :cursor
                );
            END;
            `,
            {
                cod_modulo: codModulo,
                nom_modulo: nomModulo,
                zona_modulo: zonaModulo,

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
          Convierte las columnas del cursor a propiedades del servicio:
          código [0], archivo [1], menú [2], nombre [3], zona [4] y orden [5].
        */
        return rows.map(row => ({
            codigo: row[0],
            archivo: row[1],
            menu: row[2],
            nombre: row[3],
            zona: row[4],
            orden: row[5]
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
  Invoca PKG_MODULO.insertarModulo vinculando los datos del módulo con los parámetros esperados por Oracle.
*/
export async function insertarModulo(data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_MODULO.insertarModulo(
                    :cod_modulo,
                    :arch_modulo,
                    :nom_modulo,
                    :zona_modulo,
                    :orde_modulo
                );
            END;
            `,
            {
                cod_modulo: data.codModulo,
                arch_modulo: data.archModulo,
                nom_modulo: data.nomModulo,
                zona_modulo: data.zonaModulo,
                orde_modulo: data.ordeModulo
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
  Invoca PKG_MODULO.actualizarModulo con el código del módulo y los
  valores de archivo, nombre, zona y orden recibidos en data.
*/
export async function actualizarModulo(codModulo, data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_MODULO.actualizarModulo(
                    :cod_modulo,
                    :arch_modulo,
                    :nom_modulo,
                    :zona_modulo,
                    :orde_modulo
                );
            END;
            `,
            {
                cod_modulo: codModulo,
                arch_modulo: data.archModulo,
                nom_modulo: data.nomModulo,
                zona_modulo: data.zonaModulo,
                orde_modulo: data.ordeModulo
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
  Invoca PKG_MODULO.eliminarModulo con codModulo como único bind de entrada.
  Oracle determina si el registro puede eliminarse.
*/
export async function eliminarModulo(codModulo) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_MODULO.eliminarModulo(:cod_modulo);
            END;
            `,
            {
                cod_modulo: codModulo
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