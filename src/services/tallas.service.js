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
  Consulta los tallas utilizando los filtros recibidos.
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

        const resultSet = result.outBinds.cursor;

        const rows = await resultSet.getRows();

        await resultSet.close();

        return rows.map(row => ({
            codigo: row[0],
            nombre: row[1],
            estado: row[2]
        }));

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}


/*
  Registra un nuevo talla con la información recibida.
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
        if (connection) {
            await connection.close();
        }
    }
}


/*
  Actualiza la información del talla seleccionado.
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
        if (connection) {
            await connection.close();
        }
    }
}


/*
  Activa el registro correspondiente al código recibido.
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
        if (connection) {
            await connection.close();
        }
    }
}


/*
  Desactiva el registro correspondiente al código recibido.
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
        if (connection) {
            await connection.close();
        }
    }
}

/*
  Elimina el talla correspondiente al código recibido.
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
        if (connection) {
            await connection.close();
        }
    }
}