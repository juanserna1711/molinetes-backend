/*=============================================================================
  Nombre responsabilidad: Acceso Oracle para molinetes

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Ejecuta los procedimientos de PKG_MOLINETE desde los controladores del recurso.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';

/*
  Invoca PKG_MOLINETE.consultaMolinete con código y nombre opcionales.
  Los filtros ausentes se envían como null; devuelve objetos con código,
  nombre, RPM y perímetro a partir de las filas del cursor Oracle.
*/
export async function consultarMolinetes({
    codMolinete = null,
    nomMolinete = null
} = {}) {

    let connection;
    let result;

    try {
        connection = await getConnection();

        result = await connection.execute(
            `
            BEGIN
                PKG_MOLINETE.consultaMolinete(
                    :cod_molinete,
                    :nom_molinete,
                    :cursor
                );
            END;
            `,
            {
                cod_molinete: codMolinete,
                nom_molinete: nomMolinete,
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
          El orden del cursor determina el mapeo: posiciones 0 y 1 para código
          y nombre, 2 para RPM y 3 para perímetro.
        */
        return rows.map(row => ({
            codigo: row[0],
            nombre: row[1],
            rpm: row[2],
            perimetro: row [3]
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
  Invoca PKG_MOLINETE.insertarMolinete con los valores de data.
  Los binds de entrada relacionan codMolinete, nomMolinete, rpmMolinete
  y periMolinete con los cuatro parámetros PL/SQL sin transformar valores.
*/
export async function insertarMolinete(data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_MOLINETE.insertarMolinete(
                    :cod_molinete,
                    :nom_molinete,
                    :rpm_molinete,
                    :peri_molinete
                );
            END;
            `,
            {
                cod_molinete: data.codMolinete,
                nom_molinete: data.nomMolinete,
                rpm_molinete: data.rpmMolinete,
                peri_molinete: data.periMolinete
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
  Invoca PKG_MOLINETE.actualizarMolinete con codMolinete como identificador
  y data como origen del nombre, las RPM y el perímetro enviados a Oracle.
*/
export async function actualizarMolinete(codMolinete, data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_MOLINETE.actualizarMolinete(
                    :cod_molinete,
                    :nom_molinete,
                    :rpm_molinete,
                    :peri_molinete
                );
            END;
            `,
            {
                cod_molinete: codMolinete,
                nom_molinete: data.nomMolinete,
                rpm_molinete: data.rpmMolinete,
                peri_molinete: data.periMolinete
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
  Invoca PKG_MOLINETE.eliminarMolinete con el código como único bind de entrada.
  Las validaciones de eliminación quedan a cargo del procedimiento Oracle.
*/
export async function eliminarMolinete(codMolinete) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_MOLINETE.eliminarMolinete(:cod_molinete);
            END;
            `,
            {
                cod_molinete: codMolinete
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