import express from 'express';
import { createServer } from 'http';
import { expressMiddleware } from "./trpc/trpc.js";
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { Server } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from './types/event-type.js';
import { serverEventListeners } from './socket/serv-event-listeners.js';
import { specialEventListeners } from './socket/special-event-listners.js';

const PORT = process.env.PORT || 3000;

const app = express();
export const httpServer = createServer(app);
export const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
        origin: "http://localhost:5173"
    }
});

// Socket listners declaration
io.on("connection", (socket) => {
    serverEventListeners(socket);
    specialEventListeners(socket);
    logger.info(`Connection established for host ${socket.client.request.headers.origin}`)
});

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

httpServer.listen(PORT, () => {
    logger.info(`Running node server on ${PORT}`);
});
