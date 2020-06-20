import 'colors';
import log from '../../lib/log';

/**
 * A middleware function that makes a log in the console for all the requests
 */
export default function (req: any, res: any, next: any) {
    log(`${req.method.blue} ${req.url.white}`);
    next();
}
