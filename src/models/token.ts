import { model, Schema, Document } from 'mongoose';

import { IUser } from './user';

interface TokenInterface extends Document {
    token: string,
    date: Date,
    user: IUser,
    generate: (size: number) => Promise<string>
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

const Token = model<TokenInterface>('Token', schema);


export default Token;
