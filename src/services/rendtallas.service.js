import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';


/**
 * Consulta TALLA y su información de RENDTALL asociada.
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


/**
 * Inserta una TALLA y su RENDTALL asociado.
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


/**
 * Actualiza RENDTALL y su TALLA asociada.
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

/**
 * Elimina una TALLA y su RENDTALL asociado.
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