import { IUser } from '../models/user';

export interface RequestData {
    user?: IUser,
    body?: any,
    params?: any
}
