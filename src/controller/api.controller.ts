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
}
