/*=============================================================================
  Nombre responsabilidad: Acceso Oracle para cálculos TIGIMOLI

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Ejecuta los procedimientos de PKG_TIGIMOLI desde los controladores del recurso.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';

/*
  Consulta los cálculos TIGIMOLI utilizando los filtros recibidos.
*/
export async function consultarTigimoli({
    codigosMolinetes = null,
    fechaInicio = null,
    fechaFin = null,
    pagina = 1,
    registrosPagina = 10
} = {}) {

    let connection;
    let result;

    try {

        connection = await getConnection();

        const codigos = Array.isArray(codigosMolinetes)
            && codigosMolinetes.length > 0
            ? codigosMolinetes.join(',')
            : null;

        const inicio = fechaInicio
            ? new Date(`${fechaInicio}T00:00:00`)
            : null;

        const fin = fechaFin
            ? new Date(`${fechaFin}T00:00:00`)
            : null;

        result = await connection.execute(
            `
            BEGIN
                PKG_TIGIMOLI.consultaTigimoli(
                    :codigos_molinetes,
                    :fecha_inicio,
                    :fecha_fin,
                    :pagina,
                    :registros_pagina,
                    :total_registros,
                    :cursor
                );
            END;
            `,
            {
                codigos_molinetes: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: codigos
                },

                fecha_inicio: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.DATE,
                    val: inicio
                },

                fecha_fin: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.DATE,
                    val: fin
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

/*
  Consulta el detalle del cálculo seleccionado.
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

/*
  Registra un nuevo cálculo TIGIMOLI con la información recibida.
*/
export async function registrarCalculoTigimoli(data) {

    let connection;

    try {

        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_TIGIMOLI.registrarCalculoTigimoli(
                    :codigos_molinetes,
                    :codigos_tallas,
                    :cantidades_rollos,
                    :usuario
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

                usuario: data.usuario
            }
        );

    } finally {

        if (connection) {
            await connection.close();
        }

    }

}