import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';


/**
 * Consulta TIGIMOLI.
 */
export async function consultarTigimoli({
    codMoli = null,
    nomMoli = null,
    fechaGeneracion = null,
    pagina = 1,
    registrosPagina = 10
} = {}) {

    let connection;
    let result;

    try {

        connection = await getConnection();

        const fecha = fechaGeneracion
            ? new Date(`${fechaGeneracion}T00:00:00`)
            : null;

        result = await connection.execute(
            `
            BEGIN
                PKG_TIGIMOLI.consultaTigimoli(
                    :cod_moli,
                    :nom_moli,
                    :fecha_generacion,
                    :pagina,
                    :registros_pagina,
                    :total_registros,
                    :cursor
                );
            END;
            `,
            {
                cod_moli: codMoli,

                nom_moli: nomMoli,

                fecha_generacion: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.DATE,
                    val: fecha
                },

                pagina: pagina,

                registros_pagina: registrosPagina,

                total_registros: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.NUMBER
                },

                cursor: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.CURSOR
                }
            }
        );

        const resultSet = result.outBinds.cursor;

        const rows = await resultSet.getRows();

        await resultSet.close();

        return {
            totalRegistros: result.outBinds.total_registros,

            datos: rows.map(row => ({
                codigoMoli: row[0],
                nombreMolinete: row[1],
                fechaGeneracion: row[2],
                cantidadTallas: row[3],
                cantidadRollos: row[4],
                totalMetros: row[5],
                tiempoGiro: row[6]
            }))
        };

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}


/**
 * Consulta el detalle de TIGIMOLI.
 */
export async function consultarDetalleTigimoli({
    codMoli,
    fechaGeneracion
}) {

    let connection;
    let result;

    try {

        connection = await getConnection();

        const fecha = new Date(fechaGeneracion);

        result = await connection.execute(
            `
            BEGIN
                PKG_TIGIMOLI.consultaDetalleTigimoli(
                    :cod_moli,
                    :fecha_generacion,
                    :cursor
                );
            END;
            `,
            {
                cod_moli: codMoli,

                fecha_generacion: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.DATE,
                    val: fecha
                },

                cursor: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.CURSOR
                }
            }
        );

        const resultSet = result.outBinds.cursor;

        const rows = await resultSet.getRows();

        await resultSet.close();

        return rows.map(row => ({
            codigoTalla: row[0],
            nombreTalla: row[1],
            rollos: row[2],
            metrosRollo: row[3],
            totalMetros: row[4]
        }));

    } finally {

        if (connection) {
            await connection.close();
        }

    }
}


/**
 * Inserta TIGIMOLI.
 */
export async function insertarTigimoli(data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_TIGIMOLI.insertarTigimoli(
                    :cod_moli,
                    :cod_talla,
                    :rollos,
                    :usuario
                );
            END;
            `,
            {
                cod_moli: data.codMoli,
                cod_talla: data.codTalla,
                rollos: data.rollos,
                usuario: data.usuario
            }
        );

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}