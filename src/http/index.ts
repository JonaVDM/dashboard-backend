import express from 'express';
import log from '../lib/log';
import http from 'http';
import routes from '../routes';
import path from 'path';

// Create the express/http server
const app = express();
export const server = http.createServer(app);

// Set the render engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../views'));

// Setup the json parser
app.use(express.json());

// Setup the paths/routes
app.use('/api', routes);

export function start(callback?: () => void) {
    if (!process.env.PORT) return
    server.listen(process.env.PORT, callback);
    log('Server Started'.green);
}

export function stop() {
    server.close();
}

export default app;
