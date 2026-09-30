/*=============================================================================
  Nombre responsabilidad: Acceso Oracle para órdenes de trabajo ORDEPROD

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 25/Septiembre/2026

  Descripcion responsabilidad:
  Ejecuta los procedimientos de PKG_ORDEPROD desde los controladores
  del recurso para consultar el historial y detalle de órdenes de trabajo.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';

/*
  Invoca PKG_ORDEPROD.consultaOrdeProd con filtros y paginación.
  Devuelve { totalRegistros, datos }: el total procede del bind NUMBER OUT
  y datos contiene los objetos construidos con las filas del cursor OUT.
*/
export async function consultarOrdeProd({
    codOrden = null,
    codTipoHilaza = null,
    fechaInicio = null,
    fechaFin = null,
    pagina = 1,
    registrosPagina = 10
} = {}) {

    let connection;
    let result;

    try {

        connection = await getConnection();

        /*
          Construye fechas a medianoche con las cadenas recibidas; sin valor,
          envía null. Los binds DATE IN transmiten estos objetos a Oracle.
        */
        const inicio = fechaInicio
            ? new Date(`${fechaInicio}T00:00:00`)
            : null;

        const fin = fechaFin
            ? new Date(`${fechaFin}T00:00:00`)
            : null;

        result = await connection.execute(
            `
            BEGIN
                PKG_ORDEPROD.consultaOrdeProd(
                    :cod_orden,
                    :cod_tipo_hilaza,
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
                cod_orden: codOrden,

                cod_tipo_hilaza: codTipoHilaza,

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

        /*
          El bind OUT de tipo CURSOR entrega el result set abierto por Oracle.
          Se leen sus filas y se cierra antes de construir la respuesta.
        */
        const resultSet = result.outBinds.cursor;

        const rows = await resultSet.getRows();

        await resultSet.close();

        /*
          El total se obtiene por separado del cursor. Cada fila aporta orden [0],
          hilaza [1-2], fecha [3], usuario [4-5] y cantidad de molinetes [6].
          El map adapta esas posiciones a propiedades con nombre sin recalcularlas.
        */
        return {
            totalRegistros: result.outBinds.total_registros,

            datos: rows.map(row => ({
                codigoOrden: row[0],
                codigoTipoHilaza: row[1],
                nombreTipoHilaza: row[2],
                fechaGeneracion: row[3],
                codigoUsuario: row[4],
                nombreUsuario: row[5],
                cantidadMolinetes: row[6]
            }))
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

/*
  Invoca PKG_ORDEPROD.consultaDetalleOrdeProd para codOrden.
  Devuelve un arreglo de detalles con datos de hilaza, molinete y talla,
  cantidades y totales calculados por Oracle, RPM, fecha y usuario.
*/
export async function consultarDetalleOrdeProd(codOrden) {

    let connection;
    let result;

    try {

        connection = await getConnection();

        result = await connection.execute(
            `
            BEGIN
                PKG_ORDEPROD.consultaDetalleOrdeProd(
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
          Conserva el orden del cursor: orden [0], hilaza [1-2], molinete [3-4],
          perímetro [5], talla [6-7], cantidades del detalle [8-10], totales
          por molinete [11-13], RPM [14], fecha [15] y usuario [16-17].
          Los totales se copian de Oracle; no se acumulan nuevamente aquí.
        */
        return rows.map(row => ({
            codigoOrden: row[0],

            codigoTipoHilaza: row[1],
            nombreTipoHilaza: row[2],

            codigoMolinete: row[3],
            nombreMolinete: row[4],

            perimetro: row[5],

            codigoTalla: row[6],
            nombreTalla: row[7],

            rollos: row[8],
            metrosRollo: row[9],
            totalMetrosTalla: row[10],

            totalRollosMolinete: row[11],
            totalMetrosMolinete: row[12],
            tiempoGiroMolinete: row[13],

            rpm: row[14],

            fechaGeneracion: row[15],

            codigoUsuario: row[16],
            nombreUsuario: row[17]
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