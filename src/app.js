/*=============================================================================
  Nombre responsabilidad: Inicializar la API de MOLIPLUS

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Configura Express, carga dotenv y registra los recursos de tallas, rendimientos, usuarios, molinetes y TIGIMOLI.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { initDatabase, closeDatabase } from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import tallasRoutes from './routes/tallas.routes.js';
import rendtallasRoutes from './routes/rendtallas.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import molinetesRoutes from './routes/molinetes.routes.js';
import tigimoliRoutes from './routes/tigimoli.routes.js';
import tipohilazaRoutes from './routes/tipohilaza.routes.js';
import tihipromRoutes from './routes/tihiprom.routes.js';
import ordeprodRoutes from './routes/ordeprod.routes.js';
import modulosRoutes from './routes/modulos.routes.js';
import reglasRoutes from './routes/reglas.routes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

/*
  Middlewares
*/
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

/*
  Rutas
*/
app.use('/api/auth', authRoutes);
app.use('/api/tallas', tallasRoutes);
app.use('/api/rendtallas', rendtallasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/molinetes', molinetesRoutes);
app.use('/api/tigimoli', tigimoliRoutes);
app.use('/api/tipohilaza', tipohilazaRoutes);
app.use('/api/tihiprom', tihipromRoutes);
app.use('/api/ordeprod', ordeprodRoutes);
app.use('/api/modulos', modulosRoutes);
app.use('/api/reglas', reglasRoutes);

/*
  Inicializa la conexión con Oracle y pone en marcha el servidor.
*/
async function startServer() {

    try {

        await initDatabase();

        app.listen(PORT, () => {
          console.log ("Molinetes Backend Iniciado Correctamente")
        });

    } catch (error) {

        console.error('No fue posible iniciar el servidor.');
        console.error(error);

        process.exit(1);
    }
}


/*
  Cierra las conexiones de base de datos y termina el proceso.
*/
async function shutdown() {

    console.log('Cerrando servidor...');

    await closeDatabase();

    process.exit(0);
}


process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);


startServer();