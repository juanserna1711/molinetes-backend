import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';


/**
 * Consulta TALLA y su información de RENDTALL asociada.
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
                    :esta_talla,
                    :ancho_rendtall,
                    :peso_rendtall,
                    :rollo_rendtall,
                    :usuario_rendtall
                );
            END;
            `,
            {
                cod_talla: data.codTalla,
                nom_talla: data.nomTalla,
                esta_talla: data.estaTalla,
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
 * Actualiza TALLA y su RENDTALL asociado.
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
                    :esta_talla,
                    :ancho_rendtall,
                    :peso_rendtall,
                    :rollo_rendtall,
                    :usuario_rendtall
                );
            END;
            `,
            {
                cod_talla: codTalla,
                nom_talla: data.nomTalla,
                esta_talla: data.estaTalla,
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
 * Activa una TALLA.
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


/**
 * Desactiva una TALLA.
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


/**
 * Elimina una TALLA y su RENDTALL asociado.
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