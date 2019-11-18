import { Document, Schema } from 'mongoose';

export default interface IMessage extends Document {
    text: {
        type: string,
    },
    unread: boolean,
    dialog: {
        type: Schema.Types.ObjectId,
        ref: string
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: string
    },
    attachments?: Array<any>,
    [key: string]: any 
}