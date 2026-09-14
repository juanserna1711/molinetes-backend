import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';


/**
 * Consulta USUARIO.
 */
export async function consultarUsuarios({
    codUsuario = null,
    nomUsuario = null,
    estaUsuario = null
} = {}) {

    let connection;
    let result;

    try {
        connection = await getConnection();

        result = await connection.execute(
            `
            BEGIN
                PKG_USUARIO.consultaUsuario(
                    :cod_usuario,
                    :nom_usuario,
                    :esta_usuario,
                    :cursor
                );
            END;
            `,
            {
                cod_usuario: codUsuario,
                nom_usuario: nomUsuario,
                esta_usuario: estaUsuario,
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
            password: row[2],
            estado: row[3]
        }));

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}


/**
 * Inserta un USUARIO.
 */
export async function insertarUsuario(data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_USUARIO.insertarUsuario(
                    :cod_usuario,
                    :nom_usuario,
                    :pass_usuario,
                    :esta_usuario
                );
            END;
            `,
            {
                cod_usuario: data.codUsuario,
                nom_usuario: data.nomUsuario,
                pass_usuario: data.passUsuario,
                esta_usuario: data.estaUsuario
            }
        );

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}


/**
 * Actualiza USUARIO.
 */
export async function actualizarUsuario(codUsuario, data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_USUARIO.actualizarUsuario(
                    :cod_usuario,
                    :nom_usuario,
                    :pass_usuario,
                    :esta_usuario
                );
            END;
            `,
            {
                cod_usuario: codUsuario,
                nom_usuario: data.nomUsuario,
                pass_usuario: data.passUsuario,
                esta_usuario: data.estaUsuario
            }
        );

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}


/**
 * Activa un USUARIO.
 */
export async function activarUsuario(codUsuario) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_USUARIO.activarUsuario(:cod_usuario);
            END;
            `,
            {
                cod_usuario: codUsuario
            }
        );

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}


/**
 * Desactiva un USUARIO.
 */
export async function desactivarUsuario(codUsuario) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_USUARIO.desactivarUsuario(:cod_usuario);
            END;
            `,
            {
                cod_usuario: codUsuario
            }
        );

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

/**
 * Elimina un USUARIO.
 */
export async function eliminarUsuario(codUsuario) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_USUARIO.eliminarUsuario(:cod_usuario);
            END;
            `,
            {
                cod_usuario: codUsuario
            }
        );

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}