/*=============================================================================
  Nombre responsabilidad: Acceso Oracle para tipos de hilaza

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 24/Septiembre/2026

  Descripcion responsabilidad:
  Ejecuta los procedimientos de PKG_TIPOHILA desde los controladores del recurso.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';

/*
  Consulta los tipos de hilaza utilizando los filtros recibidos.
*/
export async function consultarTiposHilaza({
    codTipoHilaza = null,
    nomTipoHilaza = null
} = {}) {

    let connection;
    let result;

    try {
        connection = await getConnection();

        result = await connection.execute(
            `
            BEGIN
                PKG_TIPOHILA.consultaTipoHilaza(
                    :cod_tipo_hilaza,
                    :nom_tipo_hilaza,
                    :cursor
                );
            END;
            `,
            {
                cod_tipo_hilaza: codTipoHilaza,
                nom_tipo_hilaza: nomTipoHilaza,

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
            codigo: row[0],
            nombre: row[1]
        }));

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

/*
  Registra un nuevo tipo de hilaza con la información recibida.
*/
export async function insertarTipoHilaza(data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_TIPOHILA.insertarTipoHilaza(
                    :cod_tipo_hilaza,
                    :nom_tipo_hilaza
                );
            END;
            `,
            {
                cod_tipo_hilaza: data.codTipoHilaza,
                nom_tipo_hilaza: data.nomTipoHilaza
            }
        );

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

/*
  Actualiza la información del tipo de hilaza seleccionado.
*/
export async function actualizarTipoHilaza(codTipoHilaza, data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_TIPOHILA.actualizarTipoHilaza(
                    :cod_tipo_hilaza,
                    :nom_tipo_hilaza
                );
            END;
            `,
            {
                cod_tipo_hilaza: codTipoHilaza,
                nom_tipo_hilaza: data.nomTipoHilaza
            }
        );

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

/*
  Elimina el tipo de hilaza correspondiente al código recibido.
*/
export async function eliminarTipoHilaza(codTipoHilaza) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_TIPOHILA.eliminarTipoHilaza(
                    :cod_tipo_hilaza
                );
            END;
            `,
            {
                cod_tipo_hilaza: codTipoHilaza
            }
        );

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}