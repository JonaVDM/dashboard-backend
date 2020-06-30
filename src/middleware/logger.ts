import 'colors';
import log from '../lib/log';
import { RequestData } from '../../typings/request-data';

/**
 * A middleware function that makes a log in the console for all the requests
 */
export default async function (req: any, data: RequestData): Promise<RequestData> {
    log(`${req.method.blue} ${req.url.white}`);
    return data;
}
