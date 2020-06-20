import { IUser } from '../src/models/user';

declare interface RequestData {
    user?: IUser,
    body?: any,
    params?: any
}
