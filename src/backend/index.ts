import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser'; 
import { createServer } from 'http';
import { expressMiddleware } from "./trpc/appRouter.js";
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { Server } from 'socket.io';
import { YSocketIO } from 'y-socket.io/dist/server';
import { loginHandler, OAuthCallback } from './auth/oauth-handlers.js';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

const { PORT, DATABASE_URL } = process.env;

export const db: NodePgDatabase = drizzle({ connection: DATABASE_URL, casing: 'snake_case'});

const app = express();

app.use(cookieParser());

export const logger = pino();
const httpLogger = pinoHttp({
    logger: logger
});

app.use(httpLogger);

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(
    '/trpc',
    expressMiddleware,
);

app.get('/auth/login', loginHandler);
app.get('/auth/callback', OAuthCallback);

export const httpServer = createServer(app);
export const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173"
    }
});

export const ySocketIO = new YSocketIO(io, {
    authenticate: (handshake) => {
        return true;
    },
});
ySocketIO.initialize();

httpServer.listen(PORT, () => {
    logger.info(`Running node server on ${PORT}`);
});
