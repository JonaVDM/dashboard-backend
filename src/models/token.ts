import { model, Schema, Document } from 'mongoose';
import { IUser } from './user';

// The amount of time a token may be valid
const VALID_TIME = 24 * 60 * 60 * 1000;

interface TokenInterface extends Document {
    token: string,
    date: Date,
    user: IUser,
    generate: (size: number) => Promise<string>,
    isValid: () => Promise<boolean>,
}

export interface IToken extends TokenInterface {
    user: IUser,
}

const schema = new Schema({
    token: String,
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

schema.methods.generate = async function (size: number): Promise<string> {
    let token: string;

    do {
        token = '';

        for (let i = 0; i < size; i++) {

            let random = Math.floor(Math.random() * 62);

            if (random < 10) {
                random += 48;
            } else if (random < 36) {
                random += 55;
            } else {
                random += 61;
            }

            token = token.concat(String.fromCharCode(random));
        }
    } while (await Token.findOne({ token }));

    this.token = token;

    return token;
}

schema.methods.isValid = async function (): Promise<boolean> {
    const now = new Date();

    if (now.getTime() - this.date.getTime() > VALID_TIME) {
        await this.delete();
        return false;
    }

    await this.update({ now });

    return true;
}

const Token = model<TokenInterface>('Token', schema);


export default Token;
