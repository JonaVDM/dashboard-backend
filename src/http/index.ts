import express from 'express';
import log from '../lib/log';
import http from 'http';
import logger from '../lib/logger';
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

// Use the route logger
app.use(logger);

// Setup the paths/routes
app.use('/api', routes);

// Custom error handler
app.use(function (err: any, req: any, res: any, next: any) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);

    // handle CSRF token errors here
    res.status(403);
    res.send({'error': 'Invalid CSRF Token'});
});

export function start(callback?: () => void) {
    if (!process.env.PORT) return
    server.listen(process.env.PORT, callback);
    log('Server Started'.green);
}

export function stop() {
    server.close();
}

export default app;
