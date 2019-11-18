import mongoose, { Schema, Model } from 'mongoose'

import { IMessage } from 'types';

const MessageSchema: Schema<IMessage> = new Schema(
    {
        text: {
            type: String,
            required: true,
        },
        isReaded: {
            type: Boolean,
            default: false
        },    
        dialog: {
            type: Schema.Types.ObjectId, 
            ref: 'Dialog',
            required: true
        },
        user: {
            type: Schema.Types.ObjectId, 
            ref: 'User',
            required: true
        }
    }, {
        timestamps: true
})

const MessageModel: Model<IMessage> = mongoose.model<IMessage>('Messages', MessageSchema)

export default MessageModel