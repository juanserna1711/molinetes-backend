/*=============================================================================
  Nombre responsabilidad: Acceso Oracle para promedios por tipo de hilaza

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 24/Septiembre/2026

  Descripcion responsabilidad:
  Ejecuta los procedimientos de PKG_TIHIPROM desde los controladores del recurso.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';

/*
  Invoca PKG_TIHIPROM.consultaTiHiProm con hilaza y talla opcionales.
  Envía null para filtros ausentes y devuelve objetos con medidas, promedio
  y datos de registro obtenidos del cursor Oracle.
*/
export async function consultarTiHiProm({
    codTipoHilaza = null,
    codTalla = null
} = {}) {

    let connection;
    let result;

    try {
        connection = await getConnection();

        result = await connection.execute(
            `
            BEGIN
                PKG_TIHIPROM.consultaTiHiProm(
                    :cod_tipo_hilaza,
                    :cod_talla,
                    :cursor
                );
            END;
            `,
            {
                cod_tipo_hilaza: codTipoHilaza,
                cod_talla: codTalla,

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
          Traduce posiciones del cursor a propiedades: hilaza [0-1], talla [2-3],
          peso [4], ancho [5], promedio [6], fecha [7] y usuario [8].
          El promedio se recibe de Oracle; el map no lo vuelve a calcular.
        */
        return rows.map(row => ({
            codigoTipoHilaza: row[0],
            nombreTipoHilaza: row[1],
            codigoTalla: row[2],
            nombreTalla: row[3],
            peso: row[4],
            ancho: row[5],
            promedio: row[6],
            fechaGeneracion: row[7],
            usuario: row[8]
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
  Invoca PKG_TIHIPROM.insertarTiHiProm con hilaza, talla, peso, ancho
  y usuario de data como binds de entrada. El cálculo del promedio
  y las validaciones quedan a cargo del procedimiento Oracle.
*/
export async function insertarTiHiProm(data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_TIHIPROM.insertarTiHiProm(
                    :cod_tipo_hilaza,
                    :cod_talla,
                    :peso_tihiprom,
                    :ancho_tihiprom,
                    :usuario_tihiprom
                );
            END;
            `,
            {
                cod_tipo_hilaza: data.codTipoHilaza,
                cod_talla: data.codTalla,
                peso_tihiprom: data.pesoTiHiProm,
                ancho_tihiprom: data.anchoTiHiProm,
                usuario_tihiprom: data.usuarioTiHiProm
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
  Invoca PKG_TIHIPROM.actualizarTiHiProm para la pareja codTipoHilaza/codTalla.
  Vincula pesoTiHiProm, anchoTiHiProm y usuarioTiHiProm de data a los binds
  de medidas y usuario sin transformar sus valores.
*/
export async function actualizarTiHiProm(codTipoHilaza, codTalla, data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_TIHIPROM.actualizarTiHiProm(
                    :cod_tipo_hilaza,
                    :cod_talla,
                    :peso_tihiprom,
                    :ancho_tihiprom,
                    :usuario_tihiprom
                );
            END;
            `,
            {
                cod_tipo_hilaza: codTipoHilaza,
                cod_talla: codTalla,
                peso_tihiprom: data.pesoTiHiProm,
                ancho_tihiprom: data.anchoTiHiProm,
                usuario_tihiprom: data.usuarioTiHiProm
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
  Invoca PKG_TIHIPROM.eliminarTiHiProm con hilaza y talla como entradas.
  Ambos códigos identifican la información cuya eliminación se solicita.
*/
export async function eliminarTiHiProm(codTipoHilaza, codTalla) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_TIHIPROM.eliminarTiHiProm(
                    :cod_tipo_hilaza,
                    :cod_talla
                );
            END;
            `,
            {
                cod_tipo_hilaza: codTipoHilaza,
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
  Invoca PKG_TIHIPROM.aplicarTipoHilaza para aplicar la hilaza a RENDTALL.
  Envía codTipoHilaza y usuarioRendtall como binds de entrada; no realiza
  cálculos de rendimiento ni obtiene un result set en este servicio.
*/
export async function aplicarTipoHilaza(codTipoHilaza, usuarioRendtall) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_TIHIPROM.aplicarTipoHilaza(
                    :cod_tipo_hilaza,
                    :usuario_rendtall
                );
            END;
            `,
            {
                cod_tipo_hilaza: codTipoHilaza,
                usuario_rendtall: usuarioRendtall
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