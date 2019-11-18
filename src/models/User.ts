import mongoose, { Schema, Model } from 'mongoose'
import { isEmail } from 'validator'
import differenceInMinutes from 'date-fns/differenceInMinutes'

import { IUser } from 'types'
import { generateHash, generateHex } from 'helpers'

export const UserSchema: Schema<IUser> = new Schema(
    {
        email: {
            type: String,
            required: 'Email is required',
            validate: [isEmail, 'Invalid Email'],
            index: { unique: true }
        },
        avatar: String,
        fullname: {
            type: String,
            required: 'Name is required'
        },
        password: {
            type: String,
            required: 'Password is required'
        },
        confirmed: {
            type: Boolean,
            default: false
        },
        confirm_hash: String,
        last_seen: {
            type: Date,
            default: new Date()
        },
        color: String
    }, {
    timestamps: true
})

UserSchema.virtual('isOnline').get(function(this: IUser) {
    return differenceInMinutes(new Date(), this.last_seen) < 15
})

UserSchema.set('toJSON', {
    virtuals:true
}
)
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.confirmed) {
        this.color = generateHex(this._id.toString())
        this.password = await generateHash(this.password)
        this.confirm_hash = await generateHash(this._id.toString());
    }
    next()
})

const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema)

export default UserModel