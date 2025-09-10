import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser'; 
import { createServer } from 'http';
import { expressMiddleware } from "./trpc/appRouter.js";
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { Server } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from './types/event-type.js';
import { specialEventHandlers } from './socket/special-event-handlers.js';
import { clientEventHandlers } from './socket/client-event-handlers.js';
import { loginHandler, OAuthCallback } from './auth/oauth-handlers.js';
import { jwtMiddleware } from './auth/middleware.js';
import { drizzle } from 'drizzle-orm/node-postgres';

const { PORT, DATABASE_URL } = process.env;

export const db = drizzle(DATABASE_URL!);

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
    jwtMiddleware,
);

app.use(
    '/trpc',
    expressMiddleware,
);

app.get('/auth/login', loginHandler);
app.get('/auth/callback', OAuthCallback);

export const httpServer = createServer(app);
export const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
        origin: "http://localhost:5173"
    }
});

io.on("connection", (socket) => {
    clientEventHandlers(socket);
    specialEventHandlers(socket);
    logger.info(`Connection established for host ${socket.client.request.headers.origin}`)
});

httpServer.listen(PORT, () => {
    logger.info(`Running node server on ${PORT}`);
});
