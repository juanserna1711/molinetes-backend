/*=============================================================================
  Nombre responsabilidad: Acceso Oracle para rendimientos por talla

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Ejecuta los procedimientos de PKG_RENDTALLA desde los controladores del recurso.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';

/*
  Invoca PKG_RENDTALLA.consultaRendTalla con nombre opcional.
  Devuelve objetos con datos de talla, medidas, resultados del rendimiento
  y datos de registro; los filtros ausentes se envían como null.
*/
export async function consultarRendTallas({
    nomTalla = null
} = {}) {

    let connection;
    let result;

    try {
        connection = await getConnection();

        result = await connection.execute(
            `
            BEGIN
                PKG_RENDTALLA.consultaRendTalla(
                    :nom_talla,
                    :cursor
                );
            END;
            `,
            {
                nom_talla: nomTalla,

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
          El cursor aporta talla [0-2], ancho [3], peso por m2 [4], peso del
          rollo [5], rendimiento [6], metros por rollo [7], fecha [8] y usuario [9].
          Se renombran las posiciones sin recalcular ni reemplazar valores nulos.
        */
        return rows.map(row => ({
            codigo: row[0],
            nombre: row[1],
            estado: row[2],
            ancho: row[3],
            pesoM2: row[4],
            pesoRollo: row[5],
            rendimiento: row[6],
            metrosRollo: row[7],
            fechaGeneracion: row[8],
            usuario: row[9]
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
  Invoca PKG_RENDTALLA.insertarRendTalla con talla, ancho, peso por m2,
  peso del rollo y usuario de data como binds de entrada. El servicio no
  calcula rendimiento ni metros: esa responsabilidad queda en Oracle.
*/
export async function insertarRendTalla(data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_RENDTALLA.insertarRendTalla(
                    :cod_talla,
                    :ancho_rendtall,
                    :peso_rendtall,
                    :rollo_rendtall,
                    :usuario_rendtall
                );
            END;
            `,
            {
                cod_talla: data.codTalla,
                ancho_rendtall: data.anchoRendtall,
                peso_rendtall: data.pesoRendtall,
                rollo_rendtall: data.rolloRendtall,
                usuario_rendtall: data.usuarioRendtall
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
  Invoca PKG_RENDTALLA.actualizarRendTalla para codTalla, enviando las
  medidas y el usuario de data. Conserva los valores al vincular las
  propiedades JavaScript con los parámetros de entrada PL/SQL.
*/
export async function actualizarRendTalla(codTalla, data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_RENDTALLA.actualizarRendTalla(
                    :cod_talla,
                    :ancho_rendtall,
                    :peso_rendtall,
                    :rollo_rendtall,
                    :usuario_rendtall
                );
            END;
            `,
            {
                cod_talla: codTalla,
                ancho_rendtall: data.anchoRendtall,
                peso_rendtall: data.pesoRendtall,
                rollo_rendtall: data.rolloRendtall,
                usuario_rendtall: data.usuarioRendtall
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
  Invoca PKG_RENDTALLA.eliminarRendTalla con codTalla como único bind.
  Solicita eliminar la información de rendimiento asociada a esa talla.
*/
export async function eliminarRendTalla(codTalla) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_RENDTALLA.eliminarRendTalla(:cod_talla);
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