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
  Consulta los promedios por tipo de hilaza utilizando los filtros recibidos.
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

        const resultSet = result.outBinds.cursor;

        const rows = await resultSet.getRows();

        await resultSet.close();

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
        if (connection) {
            await connection.close();
        }
    }
}

/*
  Registra nueva información de promedio para un tipo de hilaza y talla.
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
        if (connection) {
            await connection.close();
        }
    }
}

/*
  Actualiza la información de promedio del tipo de hilaza y talla seleccionados.
*/
export async function actualizarTiHiProm(
    codTipoHilaza,
    codTalla,
    data
) {

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
        if (connection) {
            await connection.close();
        }
    }
}

/*
  Elimina la información correspondiente al tipo de hilaza y talla recibidos.
*/
export async function eliminarTiHiProm(
    codTipoHilaza,
    codTalla
) {

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
        if (connection) {
            await connection.close();
        }
    }
}

/*
  Aplica en RENDTALL la parametrización del tipo de hilaza seleccionado.
*/
export async function aplicarTipoHilaza(
    codTipoHilaza,
    usuarioRendtall
) {

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
        if (connection) {
            await connection.close();
        }
    }
}