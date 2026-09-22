# MOLIPLUS Backend

## Descripción

API HTTP para la gestión de tallas, usuarios, molinetes, rendimientos por talla y cálculos TIGIMOLI. Expone recursos Express y delega el acceso a datos en procedimientos de packages Oracle.

## Tecnologías

Según `package.json`: Node.js con módulos ES, Express 5, cors 2, dotenv 17 y oracledb 7. Nodemon 3 se utiliza para desarrollo. Los rangos exactos están en `package.json` y las versiones resueltas en `package-lock.json`.

## Requisitos

Node.js y npm compatibles con las dependencias, acceso de red a Oracle y una configuración de conexión con permisos para ejecutar `PKG_TALLA`, `PKG_RENDTALLA`, `PKG_USUARIO`, `PKG_MOLINETE` y `PKG_TIGIMOLI`.

El proyecto no declara `engines` ni una versión de Oracle. No contiene una llamada a `initOracleClient` ni un script de instalación de los packages. Los objetos de base de datos deben estar disponibles antes de utilizar sus servicios.

## Instalación

Desde la carpeta del backend:

```sh
npm ci
```

Configurar el entorno local según los nombres incluidos en `.env.example`, con los datos proporcionados para el ambiente correspondiente.

## Variables de entorno

| Nombre | Finalidad |
|--------|-----------|
| `DB_USER` | Usuario utilizado al crear el pool Oracle. |
| `DB_PASSWORD` | Contraseña de conexión a Oracle. |
| `DB_CONNECT_STRING` | Identificador de conexión utilizado por oracledb. |
| `PORT` | Puerto HTTP; app.js usa 3000 si no está informado. |

dotenv carga las variables en app.js y config/database.js. No se incluyen credenciales ni valores de conexión en esta documentación.

## Ejecución

```sh
npm run dev
```

Para ejecutar directamente con Node.js:

```sh
npm start
```

El arranque espera la creación del pool Oracle antes de escuchar. Si la inicialización falla, registra el error y termina con código 1. `GET /health` responde un mensaje de disponibilidad del servidor; su manejador no ejecuta una consulta de base de datos.

## Estructura del proyecto

| Ubicación | Responsabilidad |
|-----------|-----------------|
| `src/config/database.js` | Creación, préstamo de conexiones y cierre del pool Oracle. |
| `src/controllers` | Lectura de query/params/body, invocación del servicio y respuesta HTTP. |
| `src/routes` | Métodos y rutas asociados a cada controlador. |
| `src/services` | Llamadas PL/SQL, binds, lectura de cursores y conversión de filas. |
| `src/utils/handleError.js` | Traducción de códigos Oracle reconocidos a errores HTTP. |
| `src/app.js` | Middlewares, montaje de rutas, arranque y señales de cierre. |

## Arquitectura del backend

`Route → Controller → Service → Oracle / Package PL/SQL`.

Express aplica `cors()` y `express.json()`. Cada router se monta bajo `/api` con su recurso. Los controladores convierten los códigos y la paginación con Number cuando corresponde, pasan los datos al servicio y generan JSON. Los servicios obtienen una conexión del pool y ejecutan bloques anónimos PL/SQL con binds.

El código revisado no incorpora middleware de autenticación ni endpoints de inicio de sesión. El recurso usuarios administra registros de usuario.

## Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Comprueba que el servidor HTTP responde. |
| GET | `/api/tallas` | Consultar registros. |
| POST | `/api/tallas` | Crear un registro. |
| PUT | `/api/tallas/:codigo` | Actualizar por código. |
| PATCH | `/api/tallas/:codigo/activar` | Activar por código. |
| PATCH | `/api/tallas/:codigo/desactivar` | Desactivar por código. |
| DELETE | `/api/tallas/:codigo` | Eliminar por código. |
| GET | `/api/rendtallas` | Consultar registros. |
| POST | `/api/rendtallas` | Crear un registro. |
| PUT | `/api/rendtallas/:codigo` | Actualizar por código. |
| DELETE | `/api/rendtallas/:codigo` | Eliminar por código. |
| GET | `/api/usuarios` | Consultar registros. |
| POST | `/api/usuarios` | Crear un registro. |
| PUT | `/api/usuarios/:codigo` | Actualizar por código. |
| PATCH | `/api/usuarios/:codigo/activar` | Activar por código. |
| PATCH | `/api/usuarios/:codigo/desactivar` | Desactivar por código. |
| DELETE | `/api/usuarios/:codigo` | Eliminar por código. |
| GET | `/api/molinetes` | Consultar registros. |
| POST | `/api/molinetes` | Crear un registro. |
| PUT | `/api/molinetes/:codigo` | Actualizar por código. |
| DELETE | `/api/molinetes/:codigo` | Eliminar por código. |
| GET | `/api/tigimoli` | Consultar historial paginado. |
| GET | `/api/tigimoli/detalle` | Consultar detalle por código de molinete y fecha. |
| POST | `/api/tigimoli` | Registrar un cálculo completo. |

Las rutas con `:codigo` toman el identificador de `req.params`. No se definen rutas GET por identificador en el path: las consultas de catálogos reciben filtros por query string.

## Entradas y respuestas

| Recurso | Query de consulta |
|---------|-------------------|
| Molinetes | `codigo`, `nombre`. |
| Tallas, usuarios y rendtallas | `codigo`, `nombre`, `estado`. |
| Historial TIGIMOLI | `codigo`, `nombre`, `fecha`, `pagina` (por defecto 1), `registrosPagina` (por defecto 10). |
| Detalle TIGIMOLI | `codigo` de molinete y `fecha` de generación. |

Los filtros ausentes de los catálogos se convierten a null. En el historial, fecha se convierte a Date agregando medianoche; en el detalle se utiliza `new Date(fechaGeneracion)`.

| Recurso | Campos del cuerpo usados al crear |
|---------|----------------------------------|
| Molinetes | `codMolinete`, `nomMolinete`, `rpmMolinete`, `periMolinete`. |
| Tallas | `codTalla`, `nomTalla`, `estaTalla`. |
| Usuarios | `codUsuario`, `nomUsuario`, `passUsuario`, `estaUsuario`. |
| Rendimientos | `codTalla`, `anchoRendtall`, `pesoRendtall`, `rolloRendtall`, `usuarioRendtall`. |
| TIGIMOLI | `codigosMolinetes`, `codigosTallas`, `cantidadesRollos`, `usuario`. |

En las actualizaciones se utiliza el código de la URL y los restantes campos del cuerpo. Activación, desactivación y eliminación usan el código de la URL. Los tres arreglos de TIGIMOLI representan valores correspondientes por posición.

Las consultas responden HTTP 200 con `{ success: true, data }`; el historial agrega `totalRegistros`. Las creaciones responden 201 con `success` y `message`; las demás escrituras responden 200 con esas propiedades.

Las filas Oracle se convierten a objetos: código/nombre/estado para tallas; código/nombre/RPM/perímetro para molinetes; parámetros, resultados y auditoría para rendimientos; resumen y detalle por talla para TIGIMOLI. La consulta de usuarios incluye el campo `password` tal como lo mapea el servicio.

## Integración con Oracle

database.js crea un pool con mínimo 1, máximo 5 e incremento 1. `getConnection()` exige que el pool esté inicializado y obtiene una conexión para cada operación.

| Servicio | Package y procedimientos invocados |
|----------|------------------------------------|
| tallas.service.js | `PKG_TALLA`: consultaTalla, insertarTalla, actualizarTalla, activarTalla, desactivarTalla, eliminarTalla. |
| rendtallas.service.js | `PKG_RENDTALLA`: consultaRendTalla, insertarRendTalla, actualizarRendTalla, eliminarRendTalla. |
| usuarios.service.js | `PKG_USUARIO`: consultaUsuario, insertarUsuario, actualizarUsuario, activarUsuario, desactivarUsuario, eliminarUsuario. |
| molinetes.service.js | `PKG_MOLINETE`: consultaMolinete, insertarMolinete, actualizarMolinete, eliminarMolinete. |
| tigimoli.service.js | `PKG_TIGIMOLI`: consultaTigimoli, consultaDetalleTigimoli, registrarCalculoTigimoli. |

Las consultas reciben un SYS_REFCURSOR mediante `BIND_OUT`/`CURSOR`. El servicio llama a `getRows()`, cierra el resultSet y convierte las columnas por posición. El historial también recibe `total_registros` como NUMBER de salida; las fechas se enlazan como DATE de entrada.

El registro TIGIMOLI pasa los arreglos mediante binds NUMBER/BIND_IN y el usuario como bind adicional. Los servicios de escritura no retornan datos y no declaran autoCommit ni commit/rollback en JavaScript; la política transaccional de los packages no se puede deducir de este repositorio.

Todos los servicios intentan cerrar la conexión adquirida en `finally`. Los cursores se cierran después de leerlos en el flujo normal. SIGINT y SIGTERM esperan `closeDatabase()`, que llama `pool.close(10)`, y terminan el proceso. app.js no conserva un servidor HTTP para cerrarlo explícitamente.

## Manejo de errores

Los controladores capturan los errores y llaman a `handleError(error, res, defaultMessage)`. Esta utilidad registra el error en consola y consulta `error.errorNum`.

- Códigos 20001–20015 reconocidos: responden con HTTP 400, 404 o 409 según el mapa existente y JSON con `success: false`, `code`, `field` y `message`.
- Códigos no reconocidos: responden 500 con `success: false` y el mensaje predeterminado del controlador.

El mapa contempla parámetros de rendimiento, existencia de registros, RPM/perímetro y consistencia/cantidad de datos del cálculo. No hay un middleware global de errores propio declarado en app.js.

## Scripts disponibles

| Comando | Acción declarada |
|---------|------------------|
| `npm run dev` | `nodemon src/app.js`. |
| `npm start` | `node src/app.js`. |

No hay scripts de pruebas, lint ni compilación declarados.
