import { model, Schema, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface RoleInterface extends Document {
    name: string,
    permissions: [string]
}

export type IRole = RoleInterface;

const schema = new Schema({
    name: {
        type: String,
        required: [true, 'validation.value.missing'],
        unique: true,
        uniqueCaseInsensitive: true,
        validate: {
            validator(value: string): boolean {
                return !value.includes(' ')
            },
            message: 'validation.value.space'
        }
    },
    permissions: {
        type: [String],
    }
});

schema.plugin(uniqueValidator, { message: 'validation.value.unique' });

const Role = model<RoleInterface>('Role', schema);
export default Role;
