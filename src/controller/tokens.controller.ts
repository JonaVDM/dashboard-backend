import Token from '../models/token';
import { RequestData } from '../typings/request-data';
import Controller from './controller';

export default class TokensController extends Controller {

    /**
     * Get back a list of all the tokens
     */
    public async tokens(data: RequestData) {
        if (!this.can(data, 'token.read')) {
            return this.unauthorized;
        }
        const tokens = await Token.find({}, 'token date').populate('user', 'name').exec();

        return [{ tokens }];
    }

    /**
     * Delete one token
     * Expects an id to be in the body
     */
    public async deleteToken(data: RequestData) {
        if (!this.can(data, 'token.delete')) {
            return this.unauthorized;
        }

        const { id } = data.params;

        const result = await Token.deleteOne({ _id: id });

        return [{ 'deleted': !!result.deletedCount }];
    }
}
