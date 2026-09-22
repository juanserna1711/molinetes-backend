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
  Consulta los rendimientos por talla utilizando los filtros recibidos.
*/
export async function consultarRendTallas({
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
                PKG_RENDTALLA.consultaRendTalla(
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
        if (connection) {
            await connection.close();
        }
    }
}


/*
  Registra un nuevo rendimiento por talla con la información recibida.
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
        if (connection) {
            await connection.close();
        }
    }
}


/*
  Actualiza la información del rendimiento por talla seleccionado.
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
        if (connection) {
            await connection.close();
        }
    }
}

/*
  Elimina el rendimiento por talla correspondiente al código recibido.
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
        if (connection) {
            await connection.close();
        }
    }
}