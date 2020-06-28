import { model, Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

import Token from './token';
import {IRole} from './role';

const SALT_ROUNDS = 10;

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    role: IRole
    generateToken: (size: number) => Promise<string>,
    can: (...requirements: [string]) => boolean
}

const schema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, 'validation.value.missing'],
        unique: true,
        uniqueCaseInsensitive: true,
        validate: {
            validator(value: string): boolean {
                return !value.includes(' ');
            },
            message: 'validation.value.space'
        }
    },
    email: {
        type: String,
        required: [true, 'validation.value.missing'],
        unique: true,
        uniqueCaseInsensitive: true,
        validate: {
            validator(email: string): boolean {
                // eslint-disable-next-line no-useless-escape
                const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return regex.test(email);
            },
            message: 'validation.email.invalid'
        }
    },
    password: {
        type: String,
        required: [true, 'validation.value.missing'],
        validate: {
            validator(value: string): boolean {
                return value.length >= 6
            },
            message: 'validation.password.short'
        },
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: [true, 'validation.value.missing'],
    }
});

schema.pre<IUser>('save', async function (next) {
    try {
        // Update the password with the hash
        this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
        next();
    } catch (e) {
        return next(e);
    }
});

schema.pre('updateOne', async function (next) {
    const password = this.getUpdate().password;
    if (!password) {
        return next();
    }
    try {
        const hashed = await bcrypt.hash(password, SALT_ROUNDS);
        this.getUpdate().password = hashed;
        next();
    } catch (error) {
        return next(error);
    }
});


schema.methods.generateToken = async function (size: number): Promise<string> {
    const token = new Token({ user: this._id });
    await token.generate(size);

    await token.save();

    return token.token;
}

schema.methods.can = function (...requirements: [string]): boolean {
    for (const requirement in requirements) {

        // This search for the category and or the specific requirement of the
        // role. For example user.read, this would search for both user and
        // user.read;
        const category = requirement.split('.')[0];
        if (!this.role.permissions.includes(requirement)
            && !this.role.permissions.includes(category)) {
            return false;
        }
    }

    return true;
}

const User = model<IUser>('User', schema);

export default User;
