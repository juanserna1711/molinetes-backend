/*=============================================================================
  Nombre responsabilidad: Acceso Oracle para tallas

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Ejecuta los procedimientos de PKG_TALLA desde los controladores del recurso.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';

/*
  Invoca PKG_TALLA.consultaTalla con código, nombre y estado opcionales.
  Envía null para filtros ausentes y devuelve objetos de talla desde el cursor.
*/
export async function consultarTallas({
    codTalla = null,
    nomTalla = null,
    estaTalla = null
} = {}) {

    let connection;
    let result;

    try {
        connection = await getConnection();

        result = await connection.execute(
            `
            BEGIN
                PKG_TALLA.consultaTalla(
                    :cod_talla,
                    :nom_talla,
                    :esta_talla,
                    :cursor
                );
            END;
            `,
            {
                cod_talla: codTalla,
                nom_talla: nomTalla,
                esta_talla: estaTalla,

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
          Convierte las tres columnas del cursor a propiedades del servicio:
          código [0], nombre [1] y estado [2], conservando sus valores.
        */
        return rows.map(row => ({
            codigo: row[0],
            nombre: row[1],
            estado: row[2]
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
  Invoca PKG_TALLA.insertarTalla vinculando codTalla, nomTalla y estaTalla
  de data con los binds de entrada de código, nombre y estado.
*/
export async function insertarTalla(data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_TALLA.insertarTalla(
                    :cod_talla,
                    :nom_talla,
                    :esta_talla
                );
            END;
            `,
            {
                cod_talla: data.codTalla,
                nom_talla: data.nomTalla,
                esta_talla: data.estaTalla
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
  Invoca PKG_TALLA.actualizarTalla con el identificador codTalla y el
  nombre y estado de data; estos valores se envían directamente a Oracle.
*/
export async function actualizarTalla(codTalla, data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_TALLA.actualizarTalla(
                    :cod_talla,
                    :nom_talla,
                    :esta_talla
                );
            END;
            `,
            {
                cod_talla: codTalla,
                nom_talla: data.nomTalla,
                esta_talla: data.estaTalla
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
  Solicita la activación a PKG_TALLA.activarTalla mediante el bind cod_talla.
  El servicio delega el cambio de estado y sus validaciones en Oracle.
*/
export async function activarTalla(codTalla) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_TALLA.activarTalla(:cod_talla);
            END;
            `,
            {
                cod_talla: codTalla
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
  Solicita la desactivación a PKG_TALLA.desactivarTalla mediante cod_talla.
  El servicio delega el cambio de estado y sus validaciones en Oracle.
*/
export async function desactivarTalla(codTalla) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_TALLA.desactivarTalla(:cod_talla);
            END;
            `,
            {
                cod_talla: codTalla
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
  Invoca PKG_TALLA.eliminarTalla con codTalla como único bind de entrada.
  Oracle determina si el registro puede eliminarse.
*/
export async function eliminarTalla(codTalla) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_TALLA.eliminarTalla(:cod_talla);
            END;
            `,
            {
                cod_talla: codTalla
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