import { model, Schema, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import strings from '../lib/strings';

interface RoleInterface extends Document {
    role: string,
    permissions: [string]
}

export type IRole = RoleInterface;

const schema = new Schema({
    role: {
        type: String,
        required: [true, strings.ERR_MISSING_VALUE],
        unique: true,
        uniqueCaseInsensitive: true,
        validate: {
            validator(value: string): boolean {
                return !value.includes(' ')
            },
            message: strings.ERR_VALUE_NO_SPACE
        }
    },
    permissions: {
        type: [String],
    }
});

schema.plugin(uniqueValidator, { message: strings.ERR_VALUE_UNIQUE });

const Role = model<RoleInterface>('Role', schema);
export default Role;
