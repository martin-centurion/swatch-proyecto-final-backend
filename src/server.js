import http from 'http';
import Mongodb from './db/mongodb.js';
import app from './app.js';
import config from './config.js';
import { loggerDev } from './config/logger.js';
import { inits } from './socket.js';

await Mongodb.getInstance();

const server = http.createServer(app);
const PORT = config.port;
loggerDev.info(`PORT: ${config.port}`);

export const serverHttp = server.listen(PORT, () => {
    loggerDev.info(`Server running in http://localhost:${PORT} (${config.env})`);
});

inits(serverHttp);