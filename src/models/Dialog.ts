import { UserSchema } from './User';
import mongoose, { Schema, Model } from 'mongoose'

import {IDialog} from 'types'

const DialogSchema: Schema<IDialog> = new Schema(
    {
        chatters: [
            {
                type:Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        lastMessage: {
            type: Schema.Types.ObjectId, 
            ref: 'Messages'
        }
    }, {
        timestamps: true
})

const DialogModel: Model<IDialog> = mongoose.model<IDialog>('Dialog', DialogSchema)

export default DialogModel