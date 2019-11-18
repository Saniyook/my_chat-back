import { Document, Schema } from 'mongoose';

export default interface IDialog extends Document {
    chatters: [
        {
            type: Schema.Types.ObjectId,
            ref: string
        }
    ]
    lastMessage: [
        {
            type: Schema.Types.ObjectId
            ref: string
        }
    ]
}

