/*=============================================================================
  Nombre responsabilidad: Acceso Oracle para usuarios

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Ejecuta los procedimientos de PKG_USUARIO desde los controladores del recurso.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';

/*
  Invoca PKG_USUARIO.consultaUsuario con código, nombre y estado opcionales.
  Los filtros ausentes se envían como null; devuelve objetos de usuario
  con los cuatro valores recibidos por el cursor Oracle.
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

        /*
          El bind OUT de tipo CURSOR entrega el result set abierto por Oracle.
          Se leen sus filas y se cierra antes de construir la respuesta.
        */
        const resultSet = result.outBinds.cursor;

        const rows = await resultSet.getRows();

        await resultSet.close();

        /*
          El cursor se mapea por posición: código [0], nombre [1], password [2]
          y estado [3]. El valor de password se incluye tal como llega de Oracle.
        */
        return rows.map(row => ({
            codigo: row[0],
            nombre: row[1],
            password: row[2],
            estado: row[3]
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
  Invoca PKG_USUARIO.insertarUsuario con código, nombre, contraseña y estado
  de data como binds de entrada. passUsuario se transmite sin transformación
  en esta función.
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
  Invoca PKG_USUARIO.actualizarUsuario con codUsuario como identificador
  y nombre, contraseña y estado de data. Los binds conservan los valores
  recibidos, incluido passUsuario.
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
  Solicita la activación a PKG_USUARIO.activarUsuario mediante cod_usuario.
  El cambio de estado y sus validaciones se delegan a Oracle.
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
  Solicita la desactivación a PKG_USUARIO.desactivarUsuario mediante
  cod_usuario, sin solicitar la eliminación del registro.
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
  Invoca PKG_USUARIO.eliminarUsuario con codUsuario como único bind.
  Los errores de la operación se propagan tras intentar cerrar la conexión.
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