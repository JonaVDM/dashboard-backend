/**
 * The Global api controller
 * Here you should specify small things that are not worthy of a own controller
 */
export default class APIController {

    /**
     * The 404 render function for the api controller
     */
    public 404(req: any, res: any): void {
        res.status(404).send({ message: 'api.not.found' });
    }

    /**
     * The Error handler
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public errors(error: Error, req: any, res: any, next: any) {
        const status = res.statusCode !== 200 ? res.statusCode : 400;
        const { message, stack } = error;

        const content: {message: string, stack?: string} = {
            message
        }

        if (process.env.MODE != 'production') {
            content.stack = stack;
        }

        res.status(status).send(content);
    }
}
